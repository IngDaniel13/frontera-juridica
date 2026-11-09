import { el, boton, mostrarAviso } from '../../utils/dom.js';
import { NIVELES } from '../../levels/index.js';
import { retoPorId } from '../../data/retos.js';
import { crearAsignar } from '../widgets/asignar.js';
import { vigilarAjuste } from '../../utils/ajuste.js';
import { jugarReto } from './comun.js';
import { bus } from '../../utils/eventos.js';
import { reproducir } from '../../utils/sonido.js';
import { mostrarNivel, escenaNivel } from '../../game/juego.js';

// NIVEL 1 · Exploración y descubrimiento: se recorre la Cámara, se reúnen fichas y se desbloquean dos retos de clasificación.
export async function jugarNivel1(ctx) {
  const nivel = NIVELES[0];
  const idxFichas = nivel.puntos.flatMap((p, i) => (p.tipo === 'ficha' ? [i] : []));
  const idxRetos = nivel.puntos.flatMap((p, i) => (p.tipo === 'reto' ? [i] : []));
  const retosIds = idxRetos.map((i) => nivel.puntos[i].reto);
  if (retosIds.every((id) => ctx.respondidos.has(id))) return;           // nivel ya resuelto (reanudación)

  const reanudando = retosIds.some((id) => ctx.respondidos.has(id));
  const fichas = new Set(reanudando ? idxFichas : []);
  const hechos = new Set(idxFichas.filter(() => reanudando));
  retosIds.forEach((id, k) => { if (ctx.respondidos.has(id)) hechos.add(idxRetos[k]); });
  const completados = [...hechos];
  const bloqueados = idxRetos.filter((i, k) => !(fichas.size === idxFichas.length && retosIds.slice(0, k).every((id) => ctx.respondidos.has(id))));

  const progreso = () => ctx.hud.actualizar({ progreso: fichas.size < idxFichas.length ? `Fichas ${fichas.size}/${idxFichas.length}` : 'Retos' });
  ctx.mostrar(null);
  progreso();
  await mostrarNivel(1, 'explora', { completados, bloqueados });
  if (!ctx.activo()) return;
  mostrarAviso('Toca la pantalla para caminar. Acércate a los círculos «!» para descubrir.', 'info', 4500);

  return new Promise((resolver) => {
    let ocupado = false;
    const siguienteReto = () => idxRetos.find((i, k) => !ctx.respondidos.has(retosIds[k]));

    const offBloq = bus.on('punto-bloqueado', ({ indice }) => {
      const p = nivel.puntos[indice];
      mostrarAviso(fichas.size < idxFichas.length ? 'Aún no: descubre todas las fichas de la Cámara.' : `Primero completa: ${nivel.puntos[siguienteReto()]?.etiqueta ?? 'el reto anterior'}.`, 'info', 3000);
      return p;
    });

    const offPunto = bus.on('punto-alcanzado', async ({ indice }) => {
      if (ocupado) return;
      ocupado = true;
      const p = nivel.puntos[indice];
      if (p.tipo === 'ficha') await mostrarFicha(indice, p); else await resolverReto(indice, p);
      ocupado = false;
    });
    ctx.alDetener(() => { offBloq(); offPunto(); });

    function mostrarFicha(indice, p) {
      return new Promise((hecho) => {
        const f = nivel.fichas[p.ficha];
        reproducir('seleccion');
        const texto = el('p', { class: 'ficha__texto' }, f.texto);
        const cuerpo = el('div', { class: 'ficha__cuerpo' }, texto);
        const panel = el('section', { class: 'panel ficha', 'aria-label': 'Descubrimiento' },
          el('p', { class: 'ficha__etiqueta' }, `Descubrimiento · ${p.etiqueta}`), el('h3', {}, f.titulo), cuerpo,
          boton('Guardar en mi carpeta', 'primario', () => {
            panel.remove();
            fichas.add(indice);
            escenaNivel()?.marcarCompletado(indice);
            if (fichas.size === idxFichas.length) {
              escenaNivel()?.desbloquear(siguienteReto());
              mostrarAviso('¡Carpeta completa! Se abrió la «Mesa de clasificación».', 'info', 4500);
            }
            progreso();
            escenaNivel()?.bloquear(false);
            hecho();
          }));
        ctx.cont.append(panel);
        vigilarAjuste(cuerpo, texto);
      });
    }

    async function resolverReto(indice, p) {
      const reto = retoPorId(p.reto);
      await jugarReto(ctx, reto, { crear: crearAsignar, tema: 'tema-camara' });
      if (!ctx.activo()) return;
      ctx.mostrar(null);
      escenaNivel()?.marcarCompletado(indice);
      escenaNivel()?.bloquear(false);
      const sig = siguienteReto();
      if (sig === undefined) { offBloq(); offPunto(); resolver(); return; }
      escenaNivel()?.desbloquear(sig);
      mostrarAviso(`Se abrió: ${nivel.puntos[sig].etiqueta}.`, 'info', 3500);
    }
  });
}
