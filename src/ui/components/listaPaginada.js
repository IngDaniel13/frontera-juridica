import { el } from '../../utils/dom.js';

// Lista paginada sin scroll: mide el espacio REAL disponible y muestra solo las filas que caben; el resto va en páginas.
// renderFila(dato, indiceGlobal) → Node. Se vuelve a calcular cuando cambia el tamaño del contenedor.
export function crearListaPaginada({ renderFila, vacio = '' }) {
  let datos = [];
  let pagina = 0;
  let tam = 3;
  const lista = el('div', { class: 'lista-pag' });
  const info = el('span', { class: 'tabla__pagina' });
  const prev = el('button', { type: 'button', class: 'boton boton--fantasma tabla__btn', 'aria-label': 'Página anterior', onClick: () => { pagina -= 1; pintar(); } }, '◀');
  const next = el('button', { type: 'button', class: 'boton boton--fantasma tabla__btn', 'aria-label': 'Página siguiente', onClick: () => { pagina += 1; pintar(); } }, '▶');
  const pager = el('div', { class: 'tabla__pager' }, prev, info, next);
  pager.hidden = true;
  const raiz = el('div', { class: 'lista-pag-zona' }, lista, pager);

  // ¿Cuántas filas caben ahora mismo en el alto disponible?
  function capacidad() {
    const muestra = datos.slice(0, 3);
    lista.replaceChildren(...muestra.map((d, i) => renderFila(d, i)));
    const alto = Math.max(...[...lista.children].map((c) => c.offsetHeight), 1);
    return Math.max(1, Math.floor((lista.clientHeight + 6) / (alto + 6)));
  }

  function pintar() {
    if (!datos.length) { pager.hidden = true; lista.replaceChildren(el('p', { class: 'suave centrado' }, vacio)); return; }
    if (raiz.isConnected) {
      pager.hidden = true;
      let cabe = capacidad();                         // primero sin paginador
      if (datos.length > cabe) { pager.hidden = false; cabe = capacidad(); }   // si no caben todas, con paginador
      tam = Math.min(cabe, Math.max(1, cabe));
    }
    const total = Math.max(1, Math.ceil(datos.length / tam));
    pagina = Math.min(Math.max(0, pagina), total - 1);
    lista.replaceChildren(...datos.slice(pagina * tam, pagina * tam + tam).map((d, k) => renderFila(d, pagina * tam + k)));
    pager.hidden = total <= 1;
    info.textContent = `${pagina + 1} / ${total}`;
    prev.disabled = pagina === 0;
    next.disabled = pagina >= total - 1;
  }

  let pendiente = false;
  const reprogramar = () => { if (pendiente) return; pendiente = true; requestAnimationFrame(() => { pendiente = false; if (raiz.isConnected) pintar(); }); };
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(reprogramar).observe(lista);
  window.addEventListener('resize', reprogramar);

  return { raiz, actualizar(nuevos) { datos = nuevos; pintar(); reprogramar(); } };
}
