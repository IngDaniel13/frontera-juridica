import { el } from '../../utils/dom.js';
import { reproducir } from '../../utils/sonido.js';
import { vigilarAjuste } from '../../utils/ajuste.js';

// Contenido por páginas dentro de una pantalla fija: título, tarjeta, puntos y botones Anterior/Siguiente.
// paginas: [{ titulo, contenido: Node[] }]
export function crearPaginador(paginas) {
  let i = 0;
  const titulo = el('h2', { class: 'pg__titulo' });
  const cuerpo = el('div', { class: 'pg__cuerpo' });
  const tarjeta = el('div', { class: 'tarjeta pg__tarjeta' }, cuerpo);
  const puntos = el('div', { class: 'pg__puntos', 'aria-hidden': 'true' }, paginas.map(() => el('i')));
  const anterior = el('button', { type: 'button', class: 'boton boton--fantasma', onClick: () => ir(-1) }, '◀ Anterior');
  const siguiente = el('button', { type: 'button', class: 'boton boton--normal', onClick: () => ir(1) }, 'Siguiente ▶');
  const raiz = el('div', { class: 'pg' }, titulo, tarjeta, puntos, el('div', { class: 'pg__nav' }, anterior, siguiente));
  const reajustar = vigilarAjuste(tarjeta, cuerpo);

  function ir(delta) { reproducir('seleccion'); i = Math.min(paginas.length - 1, Math.max(0, i + delta)); pintar(); }
  function pintar() {
    titulo.textContent = paginas[i].titulo;
    cuerpo.replaceChildren(...paginas[i].contenido);
    [...puntos.children].forEach((p, k) => p.classList.toggle('on', k === i));
    anterior.disabled = i === 0;
    siguiente.disabled = i === paginas.length - 1;
    reajustar();
  }
  pintar();
  return raiz;
}
