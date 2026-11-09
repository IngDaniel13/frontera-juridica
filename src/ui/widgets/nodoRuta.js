import { el } from '../../utils/dom.js';
import { reproducir } from '../../utils/sonido.js';

// Ruta de la operación: el jugador toca el punto exacto donde ocurre el hecho jurídico.
export function crearNodo(reto, { alConfirmar }) {
  let elegido = null;
  let bloqueado = false;
  const confirmar = el('button', { type: 'button', class: 'boton boton--primario', disabled: true, onClick: enviar }, 'Marcar este punto');
  const nodos = reto.nodos.map((n, i) => ({ n, b: el('button', { type: 'button', class: 'nd-nodo', onClick: () => elegir(n.id) },
    el('span', { class: 'nd-punto' }, String(i + 1)), el('span', { class: 'nd-texto' }, n.texto)) }));

  function pintar() {
    nodos.forEach(({ n, b }) => { b.classList.toggle('nd-nodo--on', elegido === n.id); b.disabled = bloqueado; });
    confirmar.disabled = bloqueado || !elegido;
  }
  function elegir(id) { if (bloqueado) return; reproducir('seleccion'); elegido = id; pintar(); }
  function enviar() { bloqueado = true; pintar(); alConfirmar({ nodo: elegido }); }

  const raiz = el('div', { class: 'nd' }, el('div', { class: 'nd-ruta' }, nodos.map((x) => x.b)), confirmar);
  pintar();
  return { raiz, bloquear() { bloqueado = true; pintar(); }, desbloquear() { bloqueado = false; pintar(); } };
}
