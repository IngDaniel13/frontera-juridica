// Operaciones de salas y partidas. Todas las escrituras pasan por funciones RPC validadas en el servidor.
import { getSupabase, asegurarSesion } from '../services/supabase.js';

const MENSAJES = {
  no_autenticado: 'Tu sesión no es válida. Recarga la página.',
  apodo_invalido: 'El alias debe tener entre 2 y 16 caracteres.',
  sala_no_existe: 'No existe una sala con ese código.',
  partida_iniciada: 'La partida ya comenzó y no admite nuevos jugadores.',
  partida_no_iniciada: 'La partida aún no ha comenzado.',
  sala_llena: 'La sala está llena (máximo 10 jugadores).',
  apodo_en_uso: 'Ese alias ya está en uso en la sala. Elige otro.',
  solo_anfitrion: 'Solo el anfitrión puede hacer esto.',
  faltan_jugadores: 'Se necesitan al menos 2 jugadores para iniciar.',
  no_miembro: 'No perteneces a esta sala.',
  reto_desconocido: 'Reto no reconocido por el servidor. ¿Ejecutaste seed_retos.sql?',
  sin_retos: 'La base de datos no tiene retos. Ejecuta seed_retos.sql.',
  nivel_no_disponible: 'Ese nivel aún no está disponible.',
  nivel_no_iniciado: 'Debes entrar al nivel antes de jugarlo.',
  nivel_incompleto: 'Aún faltan retos por completar en este nivel.',
  respuesta_invalida: 'La respuesta enviada no es válida.',
  ya_respondida: 'Ya resolviste este reto.'
};

export class ErrorJuego extends Error {
  constructor(mensaje, codigo = 'desconocido') { super(mensaje); this.codigo = codigo; }
}

function traducir(error) {
  const codigo = String(error?.message || '').trim();
  if (MENSAJES[codigo]) return new ErrorJuego(MENSAJES[codigo], codigo);
  if (/Failed to fetch|NetworkError|network/i.test(codigo)) return new ErrorJuego('Sin conexión con el servidor. Revisa tu internet.', 'red');
  return new ErrorJuego(`No se pudo completar la operación. (${codigo || 'error desconocido'})`, 'desconocido');
}

async function rpc(nombre, args = {}) {
  const sb = await getSupabase();
  const { data, error } = await sb.rpc(nombre, args);
  if (error) throw traducir(error);
  return data;
}

export async function crearSala(apodo) { await asegurarSesion(); return rpc('crear_sala', { p_nickname: apodo }); }
export async function unirseSala(codigo, apodo) { await asegurarSesion(); return rpc('unirse_sala', { p_code: codigo, p_nickname: apodo }); }
export const salirSala = (salaId) => rpc('salir_sala', { p_room: salaId });
export const marcarConexion = (salaId, estado) => rpc('marcar_conexion', { p_room: salaId, p_estado: estado });
export const iniciarPartida = (salaId) => rpc('iniciar_partida', { p_room: salaId });
export const finalizarPartida = (salaId) => rpc('finalizar_partida', { p_room: salaId });
export const horaServidor = () => rpc('hora_servidor');
export const rankingGeneral = async (limite = 20) => { await asegurarSesion(); return rpc('ranking_general', { p_limite: limite }); };

export async function obtenerSala(id) {
  const sb = await getSupabase();
  const { data, error } = await sb.from('rooms').select('*').eq('id', id).maybeSingle();
  if (error) throw traducir(error);
  if (!data) throw new ErrorJuego('No tienes acceso a esta sala o ya no existe.', 'sala_no_existe');
  return data;
}

export const mapearJugador = (fila) => ({
  id: fila.player_id,
  nombre: fila.players?.nickname ?? 'Jugador',
  puntos: fila.score,
  respondidas: fila.answered_count,       // en esta versión: retos completados
  conectado: fila.connection_status === 'connected',
  terminado: Boolean(fila.finished_at)
});

export async function obtenerJugadores(salaId) {
  const sb = await getSupabase();
  const { data, error } = await sb.from('room_players')
    .select('player_id, score, answered_count, current_rank, connection_status, finished_at, players(nickname)')
    .eq('room_id', salaId);
  if (error) throw traducir(error);
  return data.map(mapearJugador);
}

// Progreso propio (para reanudar tras recargar): retos resueltos y niveles terminados.
export async function obtenerMiProgreso(salaId) {
  const sb = await getSupabase();
  const [r, n] = await Promise.all([
    sb.from('challenge_results').select('challenge_id, credit, points_earned').eq('room_id', salaId),
    sb.from('level_runs').select('level_id, finished_at').eq('room_id', salaId)
  ]);
  if (r.error) throw traducir(r.error);
  if (n.error) throw traducir(n.error);
  return {
    respondidos: new Map(r.data.map((x) => [x.challenge_id, { puntos: x.points_earned, credito: Number(x.credit) }])),
    nivelesTerminados: new Set(n.data.filter((x) => x.finished_at).map((x) => x.level_id))
  };
}

// Backend de partida para el modo sala (misma interfaz que el backend local).
export function crearBackendSala(salaId) {
  return {
    async entrarNivel(nivel) { await rpc('entrar_nivel', { p_room: salaId, p_level: nivel }); },
    async enviarReto(reto, respuesta) {
      const r = await rpc('enviar_reto', { p_room: salaId, p_challenge: reto.id, p_answer: respuesta });
      return { credito: Number(r.credito), puntos: r.puntos, puntajeTotal: r.puntaje_total, solucion: r.solucion, feedback: r.feedback, resumen: r.resumen };
    },
    async terminarNivel(nivel) {
      const r = await rpc('terminar_nivel', { p_room: salaId, p_level: nivel });
      return { bono: r.bono, puntajeTotal: r.puntaje_total };
    }
  };
}
