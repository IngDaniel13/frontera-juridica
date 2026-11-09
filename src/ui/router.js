import { $ } from '../utils/dom.js';
import { ocultarJuego } from '../game/juego.js';

// Navegador de pantallas muy simple. Cada pantalla puede devolver una función de limpieza.
const pantallas = new Map();
const CON_JUEGO = new Set(['solo', 'sala']);
let limpiar = null;
let contador = 0;

export const registrar = (nombre, fn) => pantallas.set(nombre, fn);

export function ir(nombre, params = {}) {
  if (limpiar) { try { limpiar(); } catch { /* ignorar */ } limpiar = null; }
  const cont = $('#ui');
  cont.replaceChildren();
  if (!CON_JUEGO.has(nombre)) ocultarJuego();
  const token = ++contador;
  const resultado = pantallas.get(nombre)(cont, params);
  Promise.resolve(resultado).then((fn) => {
    if (typeof fn !== 'function') return;
    if (token === contador) limpiar = fn; else fn();
  });
}
