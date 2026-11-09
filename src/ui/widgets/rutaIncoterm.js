import { el } from '../../utils/dom.js';
import { reproducir } from '../../utils/sonido.js';

// Simulador de contrato: al probar cada Incoterm la ruta muestra quién asume cada tramo y dónde pasa el riesgo.
export function crearIncoterm(reto, { alConfirmar }) {
  let actual = null;
  let bloqueado = false;

  const chips = reto.opciones.map((o) => el('button', { type: 'button', class: 'rt-chip', onClick: () => elegir(o) }, o.texto));
  const ruta = el('div', { class: 'rt-ruta' });
  const desc = el('p', { class: 'rt-desc' });
  const tareas = el('ul', { class: 'rt-tareas' });
  const confirmar = el('button', { type: 'button', class: 'boton boton--primario', disabled: true, onClick: enviar }, 'Firmar contrato');

  function pintar() {
    chips.forEach((c, i) => { c.classList.toggle('rt-chip--on', actual === reto.opciones[i]); c.disabled = bloqueado; });
    ruta.replaceChildren(...reto.nodos.map((n, i) => {
      const riesgo = actual && i === actual.riesgoEn;
      const antes = actual && i < actual.riesgoEn;
      return el('div', { class: `rt-nodo${riesgo ? ' rt-nodo--riesgo' : ''}${antes ? ' rt-nodo--vendedor' : ''}${actual && !antes && !riesgo ? ' rt-nodo--comprador' : ''}` },
        el('span', { class: 'rt-nodo__punto' }, riesgo ? '⚠' : ''), el('span', { class: 'rt-nodo__texto' }, n));
    }));
    desc.textContent = actual ? `${actual.texto}: ${actual.desc}${actual ? ` El riesgo pasa al comprador en «${reto.nodos[actual.riesgoEn]}».` : ''}` : 'Elige un Incoterm para ver cómo cambia la operación.';
    tareas.replaceChildren(...(actual ? reto.tareas.map((t) => {
      const v = actual.asignacion[t.id] === 'V';
      return el('li', { class: `rt-tarea rt-tarea--${v ? 'v' : 'c'}` }, el('span', { class: 'rt-tarea__quien' }, v ? 'Vendedor' : 'Comprador'), t.texto);
    }) : []));
    confirmar.disabled = bloqueado || !actual;
    confirmar.textContent = actual ? `Firmar contrato con ${actual.texto}` : 'Firmar contrato';
  }

  function elegir(o) { if (bloqueado) return; reproducir('seleccion'); actual = o; pintar(); }
  function enviar() { bloqueado = true; pintar(); alConfirmar({ incoterm: actual.id }); }

  const raiz = el('div', { class: 'rt' },
    el('div', { class: 'tarjeta rt-brief' }, el('p', {}, reto.brief)),
    el('div', { class: 'rt-chips' }, chips),
    ruta,
    el('p', { class: 'rt-leyenda' }, el('span', { class: 'rt-l rt-l--v' }, 'Riesgo del vendedor'), el('span', { class: 'rt-l rt-l--c' }, 'Riesgo del comprador'), el('span', {}, '⚠ punto de transferencia')),
    desc, tareas, confirmar);
  pintar();
  return { raiz, bloquear() { bloqueado = true; pintar(); }, desbloquear() { bloqueado = false; pintar(); } };
}
