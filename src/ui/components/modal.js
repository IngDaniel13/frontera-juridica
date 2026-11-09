import { el } from '../../utils/dom.js';

// Ventana emergente que nunca excede la pantalla: su contenido debe caber (se organiza en pasos si es largo).
// botones: [{ texto, variante, onClick, cerrar }]
export function abrirModal({ titulo, cuerpo, botones = [], alCerrar, llena = false }) {
  const raizUi = document.getElementById('ui');
  let abierto = true;
  const cerrar = () => {
    if (!abierto) return;
    abierto = false;
    document.removeEventListener('keydown', teclas);
    caja.remove();
    alCerrar?.();
  };
  const teclas = (e) => { if (e.key === 'Escape') cerrar(); };

  const fila = el('div', { class: 'modal__botones' }, botones.map((b) => el('button', {
    type: 'button', class: `boton boton--${b.variante || 'normal'}`,
    onClick: () => { b.onClick?.(); if (b.cerrar !== false) cerrar(); }
  }, b.texto)));
  const caja = el('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': titulo || 'Aviso' },
    el('div', { class: `modal__caja${llena ? ' modal__caja--llena' : ''}` },
      titulo ? el('h3', { class: 'modal__titulo' }, titulo) : null,
      el('div', { class: 'modal__cuerpo' }, cuerpo),
      botones.length ? fila : null));
  document.addEventListener('keydown', teclas);
  raizUi.append(caja);
  caja.querySelector('button')?.focus?.();
  return { cerrar, raiz: caja };
}
