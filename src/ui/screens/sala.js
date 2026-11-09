import { el, boton, mostrarAviso, formatoPuntos } from '../../utils/dom.js';
import { ir } from '../router.js';
import { iniciarPartida } from './partida.js';
import { crearTablaPaginada } from '../components/tablaPosiciones.js';
import { abrirModal } from '../components/modal.js';
import { rangoPorPuntos } from '../../data/ranks.js';
import { TOTAL_RETOS } from '../../data/retos.js';
import { reproducir } from '../../utils/sonido.js';
import { fijarDesfase } from '../../utils/tiempo.js';
import { limpiarSalaActiva } from '../../utils/almacenamiento.js';
import { asegurarSesion } from '../../services/supabase.js';
import * as salas from '../../multiplayer/rooms.js';
import { conectarSala } from '../../multiplayer/realtime.js';
import { ocultarJuego } from '../../game/juego.js';

// Controlador del modo sala. Cada jugador juega las cuatro experiencias a su ritmo desde su dispositivo;
// Supabase evalúa los retos, calcula puntos y sincroniza la clasificación en vivo.
export function pantallaSala(cont, { salaId }) {
  let activo = true;
  let sala = null, miId = null, canal = null, partida = null;
  let jugadores = new Map(), presentes = new Set();
  let vistaActual = '', refrescarVista = () => {}, modal = null;
  const globales = [];

  const raiz = el('div', { class: 'vista-sala' });
  const banner = el('div', { class: 'cinta cinta--flotante', hidden: true }, 'Conexión perdida. Reintentando…');
  cont.append(raiz, banner);

  const esHost = () => Boolean(sala && sala.host_id === miId);
  const listaJugadores = () => [...jugadores.values()].map((j) => ({ ...j, conectado: presentes.size ? presentes.has(j.id) : j.conectado }));
  const miPuntaje = () => jugadores.get(miId)?.puntos ?? 0;
  const miTerminado = () => Boolean(jugadores.get(miId)?.terminado);

  let tablaModal = null;
  function pintarModal() { tablaModal?.actualizar(listaJugadores()); }
  const refrescar = () => { refrescarVista(); pintarModal(); };

  function abrirTabla() {
    if (modal) return;
    tablaModal = crearTablaPaginada({ miId, total: TOTAL_RETOS, mostrarConexion: true });
    modal = abrirModal({ titulo: 'Clasificación en vivo', cuerpo: tablaModal.raiz, botones: [{ texto: 'Cerrar', variante: 'primario' }], llena: true, alCerrar: () => { modal = null; tablaModal = null; } });
    pintarModal();
  }

  function limpiarVista() {
    partida?.detener(); partida = null;
    raiz.replaceChildren();
    refrescarVista = () => {};
  }

  // ───── Arranque ─────
  (async function arrancar() {
    try {
      const usuario = await asegurarSesion();
      miId = usuario.id;
      const t0 = Date.now();
      const horaSrv = await salas.horaServidor();
      fijarDesfase(Date.parse(horaSrv) - (t0 + Date.now()) / 2);
      const [s, js] = await Promise.all([salas.obtenerSala(salaId), salas.obtenerJugadores(salaId)]);
      if (!activo) return;
      sala = s;
      jugadores = new Map(js.map((j) => [j.id, j]));
      canal = await conectarSala({
        salaId, jugadorId: miId,
        alCambiarSala: (nueva) => { sala = { ...sala, ...nueva }; render(); },
        alCambiarJugador: (tipo, nuevo) => {
          if (tipo === 'UPDATE' && nuevo && jugadores.has(nuevo.player_id)) {
            Object.assign(jugadores.get(nuevo.player_id), {
              puntos: nuevo.score, respondidas: nuevo.answered_count,
              conectado: nuevo.connection_status === 'connected', terminado: Boolean(nuevo.finished_at)
            });
            render();
          } else { recargarJugadores(); }
        },
        alCambiarPresencia: (ids) => { presentes = ids; refrescar(); },
        alRespondio: () => {},
        alEstadoConexion: (estado) => { const ok = estado === 'SUBSCRIBED'; banner.hidden = ok; if (ok) resincronizar(); }
      });
      if (!activo) { canal.cerrar(); return; }
      salas.marcarConexion(salaId, 'connected').catch(() => {});
      const intervalo = setInterval(() => { if (document.visibilityState === 'visible') resincronizar(); }, 12000);
      const alVolver = () => { if (document.visibilityState === 'visible') resincronizar(); };
      const alCerrar = () => { salas.marcarConexion(salaId, 'disconnected').catch(() => {}); };
      document.addEventListener('visibilitychange', alVolver);
      window.addEventListener('pagehide', alCerrar);
      globales.push(() => clearInterval(intervalo), () => document.removeEventListener('visibilitychange', alVolver), () => window.removeEventListener('pagehide', alCerrar));
      render();
    } catch (e) {
      mostrarAviso(e.message, 'error', 6000);
      limpiarSalaActiva();
      ir('multi');
    }
  })();

  async function recargarJugadores() {
    try { jugadores = new Map((await salas.obtenerJugadores(salaId)).map((j) => [j.id, j])); refrescar(); } catch { /* se reintenta luego */ }
  }

  async function resincronizar() {
    if (!activo || !miId) return;
    try {
      const [s, js] = await Promise.all([salas.obtenerSala(salaId), salas.obtenerJugadores(salaId)]);
      if (!activo) return;
      sala = s; jugadores = new Map(js.map((j) => [j.id, j]));
      render();
    } catch (e) {
      if (e.codigo === 'sala_no_existe') { mostrarAviso('La sala ya no está disponible.', 'error'); limpiarSalaActiva(); ir('inicio'); }
    }
  }

  // ───── Vistas ─────
  function claveVista() {
    if (sala.status === 'waiting') return 'lobby';
    if (sala.status === 'finished') return 'final';
    return miTerminado() ? 'espera' : 'juego';
  }

  function render() {
    if (!activo || !sala) return;
    const clave = claveVista();
    if (clave === vistaActual) { refrescar(); return; }
    vistaActual = clave;
    limpiarVista();
    if (clave === 'lobby') vistaLobby();
    else if (clave === 'juego') vistaJuego();
    else if (clave === 'espera') vistaEspera();
    else vistaFinal();
    pintarModal();
  }

  async function salir() {
    if (!confirm('¿Salir de la sala?')) return;
    try { await salas.salirSala(salaId); } catch { /* ignorar */ }
    limpiarSalaActiva();
    ir('inicio');
  }

  function vistaLobby() {
    ocultarJuego();
    const enlace = `${location.origin}${location.pathname}?sala=${sala.room_code}`;
    const lista = el('div', { class: 'lobby-jugadores' });
    const contador = el('h3', {});
    const btnIniciar = boton('INICIAR PARTIDA', 'primario', async () => {
      btnIniciar.disabled = true;
      try { await salas.iniciarPartida(salaId); await resincronizar(); }
      catch (e) { mostrarAviso(e.message, 'error'); btnIniciar.disabled = false; }
    });
    const espera = el('p', { class: 'suave centrado' }, 'Esperando a que el anfitrión inicie la partida…');

    refrescarVista = () => {
      const js = listaJugadores();
      contador.textContent = `Jugadores (${js.length}/10)`;
      lista.replaceChildren(...js.map((j) => el('span', { class: `chip-jugador${j.id === miId ? ' chip-jugador--yo' : ''}` },
        el('span', { class: `punto-linea${j.conectado ? ' punto-linea--on' : ''}` }),
        el('span', { class: 'chip-jugador__nombre' }, `${j.id === sala.host_id ? '★ ' : ''}${j.nombre}`))));
      btnIniciar.disabled = js.length < 2;
      btnIniciar.textContent = js.length < 2 ? 'INICIAR (mínimo 2 jugadores)' : 'INICIAR PARTIDA';
    };

    const compartir = boton('Compartir invitación', 'normal', async () => {
      try {
        if (navigator.share) await navigator.share({ title: 'Fronteras Jurídicas', text: `Únete a mi sala con el código ${sala.room_code}`, url: enlace });
        else { await navigator.clipboard.writeText(enlace); mostrarAviso('Enlace copiado.'); }
      } catch { /* el usuario canceló */ }
    });

    raiz.append(el('main', { class: 'pantalla pantalla--mapa' }, el('div', { class: 'lobby' },
      el('div', { class: 'lobby__izq' },
        el('h2', {}, 'Sala de espera'),
        el('p', { class: 'centrado' }, 'Código de la sala'),
        el('div', { class: 'codigo-sala', 'aria-label': `Código ${sala.room_code.split('').join(' ')}` }, sala.room_code),
        compartir),
      el('div', { class: 'lobby__der' },
        contador, lista,
        esHost() ? btnIniciar : espera),
      boton('Salir de la sala', 'fantasma', salir))));
    refrescarVista();
  }

  // Cada jugador recorre los 4 niveles a su ritmo. Si recarga la página, retoma donde quedó.
  async function vistaJuego() {
    let progreso;
    try { progreso = await salas.obtenerMiProgreso(salaId); } catch (e) { mostrarAviso(e.message, 'error'); return; }
    if (!activo || vistaActual !== 'juego') return;
    let nivelInicial = 0;
    while (progreso.nivelesTerminados.has(nivelInicial + 1)) nivelInicial += 1;
    partida = iniciarPartida({
      cont: raiz, backend: salas.crearBackendSala(salaId),
      estado: { respondidos: progreso.respondidos, nivelInicial, puntos: miPuntaje() },
      alTabla: abrirTabla, alSalir: salir,
      alTerminar: () => {
        const yo = jugadores.get(miId);
        if (yo) yo.terminado = true;     // el servidor lo confirma por Realtime
        render();
      }
    });
  }

  function vistaEspera() {
    ocultarJuego();
    const tabla = crearTablaPaginada({ miId, total: TOTAL_RETOS, mostrarConexion: true });
    refrescarVista = () => tabla.actualizar(listaJugadores());
    raiz.append(el('main', { class: 'pantalla pantalla--mapa' }, el('div', { class: 'final' },
      el('div', { class: 'final__izq' },
        el('header', { class: 'sello' }, el('h1', {}, '¡MISIÓN TERMINADA!'), el('p', {}, 'Esperando a los demás…')),
        el('section', { class: 'tarjeta centrado tarjeta--compacta' },
          el('p', { class: 'cuenta-atras' }, formatoPuntos(miPuntaje())),
          el('h3', {}, `Rango: ${rangoPorPuntos(miPuntaje()).nombre}`))),
      el('div', { class: 'final__der' }, tabla.raiz,
        esHost() ? boton('Terminar la partida para todos', 'normal', () => {
          abrirModal({
            titulo: '¿Terminar la partida?', cuerpo: el('p', {}, 'Los jugadores que no hayan terminado conservarán su puntaje actual.'),
            botones: [{ texto: 'Cancelar', variante: 'fantasma' }, { texto: 'Terminar', variante: 'primario', onClick: async () => { try { await salas.finalizarPartida(salaId); await resincronizar(); } catch (e) { mostrarAviso(e.message, 'error'); } } }]
          });
        }) : el('p', { class: 'suave centrado' }, 'Termina cuando todos acaben o el anfitrión la cierre.'),
        boton('Salir', 'fantasma', salir)))));
    refrescarVista();
  }

  function vistaFinal() {
    ocultarJuego();
    limpiarSalaActiva();
    reproducir('victoria');
    const orden = listaJugadores().sort((a, b) => b.puntos - a.puntos);
    const pos = orden.findIndex((j) => j.id === miId) + 1;
    const tabla = crearTablaPaginada({ miId, total: TOTAL_RETOS });
    refrescarVista = () => tabla.actualizar(listaJugadores());
    raiz.append(el('main', { class: 'pantalla pantalla--mapa' }, el('div', { class: 'final' },
      el('div', { class: 'final__izq' },
        el('header', { class: 'sello' }, el('h1', {}, '¡PARTIDA TERMINADA!'), el('p', {}, orden[0] ? `Ganó ${orden[0].nombre} con ${formatoPuntos(orden[0].puntos)} puntos` : '')),
        el('section', { class: 'tarjeta centrado tarjeta--compacta' },
          el('p', {}, `Tu posición: ${pos}.º de ${orden.length}`),
          el('p', { class: 'cuenta-atras' }, formatoPuntos(miPuntaje())),
          el('h3', {}, `Rango: ${rangoPorPuntos(miPuntaje()).nombre}`))),
      el('div', { class: 'final__der' }, tabla.raiz,
        el('div', { class: 'fila-botones' }, boton('Volver al menú', 'primario', () => ir('inicio')), boton('Otra partida', 'normal', () => ir('multi')))))));
    refrescarVista();
  }

  return () => {
    activo = false;
    limpiarVista();
    modal?.cerrar();
    globales.forEach((f) => f());
    canal?.cerrar();
  };
}
