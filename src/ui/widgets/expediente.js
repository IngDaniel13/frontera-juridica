import { el } from '../../utils/dom.js';
import { reproducir } from '../../utils/sonido.js';

// Escritorio de investigación: abre cada documento, detecta la contradicción y corrige el Incoterm.
export function crearExpediente(reto, { alConfirmar }) {
  const vistos = new Set();
  const sel = { doc: null, incoterm: null };
  let bloqueado = false;

  const lector = el('div', { class: 'ex-lector', hidden: true });
  const contador = el('p', { class: 'suave centrado' });
  const informe = el('div', { class: 'ex-informe', hidden: true });
  const confirmar = el('button', { type: 'button', class: 'boton boton--primario', disabled: true, onClick: enviar }, 'Presentar hallazgo');

  const docs = reto.documentos.map((d) => el('button', { type: 'button', class: 'ex-doc', onClick: () => abrir(d) },
    el('span', { class: 'ex-doc__icono', 'aria-hidden': 'true' }, '📄'), el('strong', {}, d.titulo), el('small', {}, 'Toca para leer')));
  const chipsDoc = reto.documentos.map((d) => el('button', { type: 'button', class: 'rt-chip', onClick: () => elegir('doc', d.id) }, d.titulo));
  const chipsInc = reto.opciones.map((o) => el('button', { type: 'button', class: 'rt-chip', onClick: () => elegir('incoterm', o.id) }, o.texto));

  function abrir(d) {
    reproducir('seleccion');
    vistos.add(d.id);
    lector.hidden = false;
    lector.replaceChildren(el('h4', {}, d.titulo), el('p', {}, d.texto));
    pintar();
  }
  function elegir(campo, valor) { if (bloqueado) return; reproducir('seleccion'); sel[campo] = valor; pintar(); }

  function pintar() {
    docs.forEach((b, i) => b.classList.toggle('ex-doc--visto', vistos.has(reto.documentos[i].id)));
    chipsDoc.forEach((b, i) => { b.classList.toggle('rt-chip--on', sel.doc === reto.documentos[i].id); b.disabled = bloqueado; });
    chipsInc.forEach((b, i) => { b.classList.toggle('rt-chip--on', sel.incoterm === reto.opciones[i].id); b.disabled = bloqueado; });
    const todos = vistos.size === reto.documentos.length;
    contador.textContent = todos ? 'Ya leíste todo el expediente.' : `Documentos leídos: ${vistos.size} de ${reto.documentos.length}`;
    informe.hidden = !todos;
    confirmar.disabled = bloqueado || !todos || !sel.doc || !sel.incoterm;
  }
  function enviar() { bloqueado = true; pintar(); alConfirmar({ doc: sel.doc, incoterm: sel.incoterm }); }

  informe.append(el('h4', {}, 'Tu informe'), el('p', {}, reto.preguntaDoc), el('div', { class: 'rt-chips' }, chipsDoc),
    el('p', {}, reto.preguntaOpcion), el('div', { class: 'rt-chips' }, chipsInc));
  const raiz = el('div', { class: 'ex' }, el('div', { class: 'tarjeta' }, el('p', {}, reto.brief)),
    el('div', { class: 'ex-escritorio' }, docs), lector, contador, informe, confirmar);
  pintar();
  return { raiz, bloquear() { bloqueado = true; pintar(); }, desbloquear() { bloqueado = false; pintar(); } };
}
