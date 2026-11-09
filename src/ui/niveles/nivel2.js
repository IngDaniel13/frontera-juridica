import { el, boton } from '../../utils/dom.js';
import { NIVELES } from '../../levels/index.js';
import { retoPorId } from '../../data/retos.js';
import { crearAsignar } from '../widgets/asignar.js';
import { abrirModal } from '../components/modal.js';
import { jugarReto, cabeceraEtapas } from './comun.js';
import { ocultarJuego } from '../../game/juego.js';
import { reproducir } from '../../utils/sonido.js';

const TEMA = 'tema-estacion';

// NIVEL 2 · Instrumentos de la CCI: un mapa con tres estaciones. En cada una se descubren conceptos y se resuelven
// actividades de asociación y clasificación. Las estaciones se visitan en el orden que el jugador prefiera.
export async function jugarNivel2(ctx) {
  ocultarJuego();
  const nivel = NIVELES[1];
  const hechas = () => nivel.estaciones.filter((e) => e.retos.every((id) => ctx.respondidos.has(id)));
  const descubiertas = new Set(hechas().map((e) => e.id));

  while (hechas().length < nivel.estaciones.length) {
    const estacion = await mostrarMapa(ctx, nivel, hechas());
    if (!ctx.activo()) return;
    if (!descubiertas.has(estacion.id)) {
      await descubrir(ctx, estacion);
      if (!ctx.activo()) return;
      descubiertas.add(estacion.id);
    }
    const pendientes = estacion.retos.filter((id) => !ctx.respondidos.has(id));
    for (let k = 0; k < pendientes.length; k++) {
      const ultimo = k === pendientes.length - 1;
      await jugarReto(ctx, retoPorId(pendientes[k]), {
        crear: crearAsignar, tema: TEMA,
        cabecera: cabeceraEtapas(estacion.retos.map(() => estacion.nombre), estacion.retos.indexOf(pendientes[k]), 'Actividad'),
        textoContinuar: ultimo ? 'Volver al mapa' : 'Siguiente actividad'
      });
      if (!ctx.activo()) return;
    }
  }
}

function mostrarMapa(ctx, nivel, hechas) {
  return new Promise((resolver) => {
    const ids = new Set(hechas.map((e) => e.id));
    const tiles = nivel.estaciones.map((e) => {
      const lista = ids.has(e.id);
      return el('button', { type: 'button', class: `hub__tile${lista ? ' hub__tile--hecha' : ''}`, disabled: lista, onClick: () => { reproducir('seleccion'); resolver(e); } },
        el('span', { class: 'hub__icono', 'aria-hidden': 'true' }, e.icono),
        el('span', { class: 'hub__texto' }, el('strong', {}, e.nombre), el('small', {}, e.resumen)),
        el('span', { class: 'hub__estado' }, lista ? '✓ Completada' : 'Visitar'));
    });
    ctx.mostrar(el('main', { class: `pantalla reto ${TEMA}` }, el('div', { class: 'reto__fijo' },
      el('div', { class: 'reto__titulo' }, el('h2', {}, 'Instrumentos de la CCI')),
      el('p', { class: 'reto__corto' }, `Visita las ${nivel.estaciones.length} estaciones en el orden que prefieras · ${ids.size}/${nivel.estaciones.length} completadas`),
      el('div', { class: 'hub' }, tiles))));
  });
}

function descubrir(ctx, estacion) {
  return new Promise((resolver) => {
    const leidas = new Set();
    const ir = el('button', { type: 'button', class: 'boton boton--primario', disabled: true, onClick: () => resolver() }, 'Ir a la actividad');
    const cartas = estacion.descubre.map((d, i) => el('button', { type: 'button', class: 'dc-carta', onClick: () => abrir(d, i) },
      el('strong', {}, d.titulo), el('small', {}, 'Toca para leer')));
    function abrir(d, i) {
      reproducir('seleccion');
      leidas.add(i);
      cartas[i].classList.add('dc-carta--leida');
      cartas[i].querySelector('small').textContent = '✓ Leída';
      ir.disabled = leidas.size < estacion.descubre.length;
      ir.textContent = ir.disabled ? `Ir a la actividad (leídas ${leidas.size}/${estacion.descubre.length})` : 'Ir a la actividad';
      abrirModal({ titulo: d.titulo, cuerpo: el('p', { class: 'dc-texto' }, d.texto), botones: [{ texto: 'Entendido', variante: 'primario' }] });
    }
    ir.textContent = `Ir a la actividad (leídas 0/${estacion.descubre.length})`;
    ctx.mostrar(el('main', { class: `pantalla reto ${TEMA}` }, el('div', { class: 'reto__fijo' },
      el('div', { class: 'reto__titulo' }, el('h2', {}, `${estacion.icono} ${estacion.nombre}`)),
      el('p', { class: 'reto__corto' }, 'Descubre: toca cada tarjeta y lee antes de pasar a la actividad.'),
      el('div', { class: 'dc' }, cartas), ir)));
  });
}
