import { el } from '../../utils/dom.js';
import { reproducir } from '../../utils/sonido.js';
import { vigilarAjuste } from '../../utils/ajuste.js';

// Asignación por tarjetas (sin scroll): se muestra UNA tarjeta a la vez; el jugador la asigna a su categoría y pasa a la siguiente.
// Mecánica y puntuación idénticas a la clasificación original: cada tarjeta se asigna a una categoría y se confirma al final.
// Los números permiten volver a cualquier tarjeta para cambiar la decisión antes de confirmar.
export function crearAsignar(reto, { alConfirmar }) {
  const n = reto.items.length;
  const asign = {};
  let actual = 0;
  let bloqueado = false;

  const chips = reto.items.map((it, i) => el('button', { type: 'button', class: 'as-chip', 'aria-label': `Tarjeta ${i + 1}`, onClick: () => saltar(i) }, String(i + 1)));
  const etiqueta = el('small', { class: 'as-etiqueta' });
  const texto = el('p', { class: 'as-texto' });
  const carta = el('div', { class: 'as-carta' }, etiqueta, texto);
  const cats = reto.categorias.map((c) => el('button', { type: 'button', class: 'as-cat', onClick: () => asignar(c.id) }, c.texto));
  const confirmar = el('button', { type: 'button', class: 'boton boton--primario as-confirmar', disabled: true, onClick: enviar }, 'Confirmar');
  const reajustar = vigilarAjuste(carta, texto);

  function siguientePendiente() {
    for (let k = 1; k <= n; k++) { const j = (actual + k) % n; if (asign[reto.items[j].id] === undefined) return j; }
    return -1;
  }

  function pintar() {
    const item = reto.items[actual];
    chips.forEach((c, i) => {
      c.classList.toggle('as-chip--actual', i === actual);
      c.classList.toggle('as-chip--hecho', asign[reto.items[i].id] !== undefined);
      c.disabled = bloqueado;
    });
    etiqueta.textContent = `Tarjeta ${actual + 1} de ${n}`;
    texto.textContent = item.texto;
    cats.forEach((b, k) => { b.classList.toggle('as-cat--on', asign[item.id] === reto.categorias[k].id); b.disabled = bloqueado; });
    const faltan = n - Object.keys(asign).length;
    confirmar.disabled = bloqueado || faltan > 0;
    confirmar.textContent = faltan ? `Confirmar (faltan ${faltan})` : 'Confirmar';
    reajustar();
  }

  function saltar(i) { if (bloqueado) return; reproducir('seleccion'); actual = i; pintar(); }
  function asignar(catId) {
    if (bloqueado) return;
    reproducir('seleccion');
    asign[reto.items[actual].id] = catId;
    const sig = siguientePendiente();
    if (sig !== -1) actual = sig;
    pintar();
  }
  function enviar() { bloqueado = true; pintar(); alConfirmar({ ...asign }); }

  const raiz = el('div', { class: 'as' },
    el('div', { class: 'as-izq' }, el('div', { class: 'as-chips' }, chips), carta),
    el('div', { class: 'as-der' }, el('div', { class: 'as-cats' }, cats), confirmar));
  pintar();
  return { raiz, bloquear() { bloqueado = true; pintar(); }, desbloquear() { bloqueado = false; pintar(); } };
}
