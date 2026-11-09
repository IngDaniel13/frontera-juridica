import { retosDeNivel } from '../../data/retos.js';
import { crearNegociar } from '../widgets/negociar.js';
import { jugarReto } from './comun.js';
import { ocultarJuego } from '../../game/juego.js';

// NIVEL 3 · Negociación internacional: entrega (Incoterm), pago (crédito documentario UCP 600), controversias (arbitraje CCI),
// revisión del contrato y firma. Tras la firma se muestran las consecuencias y se pasa al nivel 4 conservando el puntaje.
export async function jugarNivel3(ctx) {
  ocultarJuego();
  for (const reto of retosDeNivel(3)) {
    await jugarReto(ctx, reto, { crear: crearNegociar, tema: 'tema-mesa', textoContinuar: 'Continuar al nivel 4' });
    if (!ctx.activo()) return;
  }
}
