import { el, mostrarAviso } from '../../utils/dom.js';
import { crearPantallaResultado } from '../widgets/resultado.js';
import { abrirModal } from '../components/modal.js';

// Cabecera compacta de etapas: «Etapa 2 de 4 · Pago» y una barra de progreso.
export function cabeceraEtapas(etapas, actual, rotulo = 'Etapa') {
  return el('div', { class: 'etapas' },
    el('span', { class: 'etapas__txt' }, `${rotulo} ${actual + 1} de ${etapas.length} · ${etapas[actual]}`),
    el('div', { class: 'etapas__barras' }, etapas.map((_, i) => el('i', { class: i < actual ? 'hecha' : i === actual ? 'actual' : '' }))));
}

export const botonInfo = (titulo, texto) => el('button', {
  type: 'button', class: 'ng-mini', 'aria-label': 'Ver instrucciones',
  onClick: () => abrirModal({ titulo, cuerpo: el('p', {}, texto), botones: [{ texto: 'Entendido', variante: 'primario' }] })
}, 'ℹ');

// Presenta un reto: widget interactivo → envío (local o servidor) → pantalla de resultado por pasos → continuar.
export function jugarReto(ctx, reto, { crear, tema, cabecera, textoContinuar = 'Continuar' }) {
  if (ctx.respondidos.has(reto.id)) return Promise.resolve();      // reanudación: ya estaba resuelto
  return new Promise((resolver) => {
    const area = el('div', { class: 'reto__area' });
    let widget = null;
    const marco = el('main', { class: `pantalla reto ${tema}` },
      el('div', { class: 'reto__fijo' }, cabecera || null,
        el('div', { class: 'reto__titulo' }, el('h2', {}, reto.titulo), botonInfo(reto.titulo, reto.instruccion)),
        el('p', { class: 'reto__corto' }, reto.corto), area));
    ctx.mostrar(marco);

    const alConfirmar = async (respuesta) => {
      try {
        widget.bloquear?.();
        const res = await ctx.enviar(reto, respuesta);
        if (!ctx.activo()) return;
        ctx.mostrar(crearPantallaResultado(reto, respuesta, res, { tema, textoContinuar, onContinuar: () => resolver(res) }));
      } catch (e) {
        mostrarAviso(e.message || 'No se pudo enviar. Inténtalo de nuevo.', 'error', 6000);
        widget?.desbloquear?.();
      }
    };
    widget = crear(reto, { alConfirmar });
    area.append(widget.raiz);
  });
}
