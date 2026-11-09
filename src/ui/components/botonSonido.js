import { el } from '../../utils/dom.js';
import { alternarSonido, sonidoActivo } from '../../utils/sonido.js';

// Botón de texto (menús)
export function botonSonido() {
  const b = el('button', { type: 'button', class: 'boton boton--fantasma' });
  const pintar = () => { b.textContent = `Sonido: ${sonidoActivo() ? 'activado' : 'desactivado'}`; };
  b.addEventListener('click', () => { alternarSonido(); pintar(); });
  pintar();
  return b;
}

// Botón compacto (barra superior durante el juego)
export function botonSonidoIcono() {
  const b = el('button', { type: 'button', class: 'hud__boton' });
  const pintar = () => { b.textContent = sonidoActivo() ? '🔊' : '🔇'; b.setAttribute('aria-label', sonidoActivo() ? 'Desactivar sonido' : 'Activar sonido'); };
  b.addEventListener('click', () => { alternarSonido(); pintar(); });
  pintar();
  return b;
}
