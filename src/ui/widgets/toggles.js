import { el } from '../../utils/dom.js';
import { reproducir } from '../../utils/sonido.js';

// Panel de decisiones: cada fila (tramo, imprevisto o cláusula) se resuelve eligiendo una de las opciones.
export function crearToggles(reto, { alConfirmar }) {
  const sel = {};
  let bloqueado = false;
  const progreso = el('p', { class: 'suave centrado' });
  const confirmar = el('button', { type: 'button', class: 'boton boton--primario', disabled: true, onClick: enviar }, 'Confirmar decisiones');

  const filas = reto.filas.map((f, n) => {
    const botones = reto.opciones.map((o, k) => el('button', {
      type: 'button', class: `tg-op tg-op--${k}`, 'aria-pressed': 'false', onClick: () => elegir(f.id, o.id)
    }, o.texto));
    const li = el('li', { class: `tg-fila tg-fila--${reto.visual || 'lista'}` },
      el('span', { class: 'tg-fila__num', 'aria-hidden': 'true' }, reto.visual === 'eventos' ? '⚡' : reto.visual === 'clausulas' ? '§' : String(n + 1)),
      el('span', { class: 'tg-fila__texto' }, f.texto),
      el('div', { class: 'tg-fila__ops' }, botones));
    return { f, li, botones };
  });

  function pintar() {
    filas.forEach(({ f, li, botones }) => {
      botones.forEach((b, k) => {
        const on = sel[f.id] === reto.opciones[k].id;
        b.classList.toggle('tg-op--on', on);
        b.setAttribute('aria-pressed', String(on));
        b.disabled = bloqueado;
      });
      li.classList.toggle('tg-fila--hecha', sel[f.id] !== undefined);
      li.dataset.sel = sel[f.id] ?? '';
    });
    const hechas = Object.keys(sel).length;
    progreso.textContent = `Decisiones: ${hechas} de ${reto.filas.length}`;
    confirmar.disabled = bloqueado || hechas < reto.filas.length;
  }

  function elegir(fid, oid) { if (bloqueado) return; reproducir('seleccion'); sel[fid] = oid; pintar(); }
  function enviar() { bloqueado = true; pintar(); alConfirmar({ ...sel }); }

  const raiz = el('div', { class: 'tg' },
    reto.contexto ? el('div', { class: 'tg-contexto' }, reto.contexto) : null,
    el('ul', { class: 'tg-lista' }, filas.map((x) => x.li)), progreso, confirmar);
  pintar();
  return { raiz, bloquear() { bloqueado = true; pintar(); }, desbloquear() { bloqueado = false; pintar(); } };
}
