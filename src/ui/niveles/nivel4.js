import { retosDeNivel } from '../../data/retos.js';
import { crearAsignar } from '../widgets/asignar.js';
import { jugarReto, cabeceraEtapas } from './comun.js';
import { ocultarJuego } from '../../game/juego.js';

const ETAPAS = ['Entrega', 'Pago y documentos', 'Controversia', 'Cierre'];
const ETAPA_DE_RETO = [0, 1, 2, 3, 3];

// NIVEL 4 · Misión comercial: entrega, pago y documentos, controversia y cierre (naturaleza de las decisiones y exequátur).
export async function jugarNivel4(ctx) {
  ocultarJuego();
  const retos = retosDeNivel(4);
  for (let i = 0; i < retos.length; i++) {
    await jugarReto(ctx, retos[i], {
      crear: crearAsignar, tema: 'tema-mision',
      cabecera: cabeceraEtapas(ETAPAS, ETAPA_DE_RETO[i] ?? 0),
      textoContinuar: i === retos.length - 1 ? 'Terminar la misión' : 'Siguiente etapa'
    });
    if (!ctx.activo()) return;
  }
}
