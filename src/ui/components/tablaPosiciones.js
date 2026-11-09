import { el, formatoPuntos } from '../../utils/dom.js';
import { rangoPorPuntos } from '../../data/ranks.js';
import { crearListaPaginada } from './listaPaginada.js';

// Tabla de posiciones: posición, nombre, puntuación, progreso y rango. Paginada según el espacio disponible (sin scroll).
// jugadores: [{ id, nombre, puntos, respondidas, conectado }]
export function crearTablaPaginada({ miId = null, total = 1, mostrarConexion = false } = {}) {
  const ordenar = (js) => [...js].sort((a, b) => b.puntos - a.puntos || a.nombre.localeCompare(b.nombre, 'es'));
  const lp = crearListaPaginada({
    renderFila: (j, i) => {
      const pct = Math.min(100, Math.round(((j.respondidas || 0) / Math.max(total, 1)) * 100));
      return el('div', { class: `fila${j.id === miId ? ' fila--yo' : ''}` },
        el('span', { class: 'fila__pos' }, `${i + 1}.`),
        el('div', { class: 'fila__nombre' },
          el('strong', {}, mostrarConexion ? el('span', { class: `punto-linea${j.conectado ? ' punto-linea--on' : ''}`, title: j.conectado ? 'En línea' : 'Desconectado' }) : null, j.nombre),
          el('span', { class: 'fila__sub' }, `${rangoPorPuntos(j.puntos).nombre} · ${j.respondidas || 0}/${total}`),
          el('div', { class: 'progreso' }, el('i', { style: `width:${pct}%` }))),
        el('span', { class: 'fila__puntos' }, formatoPuntos(j.puntos)));
    }
  });
  return { raiz: lp.raiz, actualizar: (js) => lp.actualizar(ordenar(js)) };
}
