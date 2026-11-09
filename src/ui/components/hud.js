import { el, formatoPuntos } from '../../utils/dom.js';
import { botonSonidoIcono } from './botonSonido.js';

// Barra superior durante la partida: nivel, progreso, puntos, (clasificación en sala), sonido y salida.
export function crearHud({ titulo, onSalir, onTabla }) {
  const lblTitulo = el('span', { class: 'hud__nivel' }, titulo || '');
  const lblProgreso = el('span', { class: 'hud__dato' });
  const lblPuntos = el('span', { class: 'hud__dato' });
  const tabla = onTabla ? el('button', { type: 'button', class: 'hud__boton', 'aria-label': 'Ver clasificación', onClick: onTabla }, '🏆') : null;
  const salir = el('button', { type: 'button', class: 'hud__boton', 'aria-label': 'Salir de la partida', onClick: onSalir }, '✕');
  const raiz = el('header', { class: 'hud' }, lblTitulo, lblProgreso, lblPuntos, tabla, botonSonidoIcono(), salir);
  return {
    raiz,
    actualizar({ titulo: t, progreso, puntos }) {
      if (t !== undefined) lblTitulo.textContent = t;
      if (progreso !== undefined) lblProgreso.textContent = progreso;
      if (puntos !== undefined) lblPuntos.textContent = `${formatoPuntos(puntos)} pts`;
    }
  };
}
