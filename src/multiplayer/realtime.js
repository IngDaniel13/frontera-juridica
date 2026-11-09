// Canal en tiempo real de una sala: cambios de datos (salas y jugadores), Presence (quién está en línea) y Broadcast (aviso «respondió»).
import { getSupabase } from '../services/supabase.js';

export async function conectarSala({ salaId, jugadorId, alCambiarSala, alCambiarJugador, alCambiarPresencia, alRespondio, alEstadoConexion }) {
  const sb = await getSupabase();
  const canal = sb.channel(`sala:${salaId}`, { config: { presence: { key: jugadorId }, broadcast: { self: false } } });

  canal
    .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${salaId}` },
      (p) => { if (p.new && p.new.id) alCambiarSala(p.new); })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'room_players', filter: `room_id=eq.${salaId}` },
      (p) => alCambiarJugador(p.eventType, p.new, p.old))
    .on('presence', { event: 'sync' }, () => alCambiarPresencia(new Set(Object.keys(canal.presenceState()))))
    .on('broadcast', { event: 'respondio' }, ({ payload }) => alRespondio(payload))
    .subscribe((estado) => {
      if (estado === 'SUBSCRIBED') canal.track({ en_linea: true });
      alEstadoConexion(estado);
    });

  return {
    avisarRespuesta: (indice) => canal.send({ type: 'broadcast', event: 'respondio', payload: { jugadorId, indice } }),
    cerrar: () => sb.removeChannel(canal)
  };
}
