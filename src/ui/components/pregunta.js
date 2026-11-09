import { el } from '../../utils/dom.js';
import { reproducir } from '../../utils/sonido.js';
import { ahoraServidor } from '../../utils/tiempo.js';

const LETRAS = ['A', 'B', 'C', 'D'];

// Panel de pregunta con temporizador. Sirve para el modo individual y el multijugador.
export function crearPanelPregunta({ pregunta, numero, total, inicioMs, onResponder, onTiempoAgotado }) {
  const limiteMs = pregunta.tiempo * 1000;
  let respondida = false;
  let detenido = false;
  let reloj = null;

  const lblTiempo = el('span', { class: 'panel__tiempo' }, `${pregunta.tiempo} s`);
  const relleno = el('i');
  const barra = el('div', { class: 'barra' }, relleno);
  const botones = pregunta.opciones.map((texto, i) =>
    el('button', { type: 'button', class: 'opcion', onClick: () => elegir(i) },
      el('span', { class: 'opcion__letra' }, LETRAS[i]), el('span', {}, texto)));
  const retro = el('div', { class: 'retro', hidden: true, 'aria-live': 'polite' });
  const pie = el('div', { class: 'panel__pie' });
  const raiz = el('section', { class: 'panel', 'aria-label': 'Pregunta' },
    el('div', { class: 'panel__cabecera' }, el('span', {}, `Pregunta ${numero} de ${total}`), lblTiempo),
    barra,
    el('p', { class: 'enunciado' }, pregunta.enunciado),
    el('div', { class: 'opciones' }, botones),
    retro, pie);

  const restante = () => limiteMs - (ahoraServidor() - inicioMs);
  const detener = () => { detenido = true; clearInterval(reloj); };

  function tick() {
    const r = Math.max(0, restante());
    lblTiempo.textContent = `${Math.ceil(r / 1000)} s`;
    relleno.style.width = `${Math.min(100, (r / limiteMs) * 100)}%`;
    relleno.classList.toggle('barra--poco', r < limiteMs * 0.25);
    if (r <= 0 && !detenido) {
      detener();
      botones.forEach((b) => { b.disabled = true; });
      if (!respondida) onTiempoAgotado?.();
    }
  }

  function elegir(i) {
    if (respondida || detenido || restante() <= 0) return;
    respondida = true;
    reproducir('seleccion');
    botones.forEach((b, k) => { b.disabled = true; b.classList.toggle('opcion--elegida', k === i); });
    onResponder?.(i, Math.max(0, ahoraServidor() - inicioMs) / 1000);
  }

  tick();
  reloj = setInterval(tick, 100);

  return {
    raiz,
    pie,
    mensaje(texto) {
      retro.hidden = false;
      retro.replaceChildren(el('p', { class: 'retro__estado' }, texto));
    },
    // Marca la opción elegida sin revelar si es correcta (multijugador).
    bloquear(indice) {
      respondida = true;
      botones.forEach((b, k) => { b.disabled = true; b.classList.toggle('opcion--elegida', k === indice); });
    },
    // Permite reintentar si falló el envío por la red y aún queda tiempo.
    reabrir() {
      if (detenido || restante() <= 0) return;
      respondida = false;
      botones.forEach((b) => { b.disabled = false; b.classList.remove('opcion--elegida'); });
    },
    revelar({ correcta, elegida, puntos, explicacion }) {
      detener();
      const acerto = elegida !== null && elegida !== undefined && elegida === correcta;
      botones.forEach((b, k) => {
        b.disabled = true;
        b.classList.remove('opcion--elegida');
        if (k === correcta) b.classList.add('opcion--correcta');
        else if (k === elegida) b.classList.add('opcion--incorrecta');
      });
      const estado = elegida === null || elegida === undefined ? 'Tiempo agotado. +0 puntos'
        : acerto ? `¡Correcto! +${puntos} puntos` : 'Incorrecto. +0 puntos';
      reproducir(acerto ? 'correcto' : 'incorrecto');
      retro.hidden = false;
      retro.className = `retro ${acerto ? 'retro--ok' : 'retro--mal'}`;
      retro.replaceChildren(el('p', { class: 'retro__estado' }, estado), el('p', { class: 'retro__texto' }, explicacion));
      barra.hidden = true;
      lblTiempo.textContent = '';
    },
    destruir() { detener(); raiz.remove(); }
  };
}
