import { el, mostrarAviso } from '../../utils/dom.js';
import { reproducir } from '../../utils/sonido.js';

// Mesa de clasificación: toca una tarjeta y luego la caja donde va. Toca una tarjeta colocada para devolverla.
export function crearClasificar(reto, { alConfirmar }) {
  const asignacion = new Map();
  let seleccionado = null;
  let bloqueado = false;

  const pool = el('div', { class: 'cl-pool' });
  const cajas = reto.categorias.map((cat) => {
    const zona = el('div', { class: 'cl-zona' });
    const cabecera = el('button', { type: 'button', class: 'cl-caja__cab', onClick: () => colocar(cat.id) }, cat.texto);
    return { cat, zona, caja: el('div', { class: 'cl-caja' }, cabecera, zona) };
  });
  const progreso = el('p', { class: 'suave centrado' });
  const confirmar = el('button', { type: 'button', class: 'boton boton--primario', disabled: true, onClick: enviar }, 'Confirmar clasificación');

  function tarjeta(item) {
    return el('button', { type: 'button', class: `cl-carta${seleccionado === item.id ? ' cl-carta--sel' : ''}`, onClick: () => elegir(item.id) }, item.texto);
  }

  function pintar() {
    pool.replaceChildren(...reto.items.filter((i) => !asignacion.has(i.id)).map(tarjeta));
    cajas.forEach((c) => c.zona.replaceChildren(...reto.items.filter((i) => asignacion.get(i.id) === c.cat.id).map(tarjeta)));
    const faltan = reto.items.length - asignacion.size;
    progreso.textContent = faltan ? `Faltan ${faltan} por colocar.` : 'Todo colocado. Revisa y confirma.';
    confirmar.disabled = bloqueado || faltan > 0;
    pool.hidden = faltan === 0;
  }

  function elegir(id) {
    if (bloqueado) return;
    reproducir('seleccion');
    if (asignacion.has(id)) { asignacion.delete(id); seleccionado = null; }
    else seleccionado = seleccionado === id ? null : id;
    pintar();
  }

  function colocar(catId) {
    if (bloqueado) return;
    if (!seleccionado) { mostrarAviso('Primero toca una tarjeta y luego la caja donde va.', 'info', 2500); return; }
    reproducir('seleccion');
    asignacion.set(seleccionado, catId);
    seleccionado = null;
    pintar();
  }

  function enviar() { bloqueado = true; pintar(); alConfirmar(Object.fromEntries(asignacion)); }

  const raiz = el('div', { class: 'cl' },
    el('p', { class: 'suave' }, 'Toca una tarjeta y luego la caja donde va.'), pool,
    el('div', { class: 'cl-cajas' }, cajas.map((c) => c.caja)), progreso, confirmar);
  pintar();
  return { raiz, bloquear() { bloqueado = true; pintar(); }, desbloquear() { bloqueado = false; pintar(); } };
}
