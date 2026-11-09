// Backend LOCAL (modo individual): evalúa en el navegador con las mismas reglas que el servidor.
import { evaluarReto, calcularBono, TIEMPOS_REFERENCIA } from './scoring.js';

export async function crearBackendLocal() {
  const { SECRETOS } = await import('../data/retosLocales.js');   // se carga solo en modo individual
  const inicios = new Map();
  const ganados = new Map();
  return {
    async entrarNivel(nivel) { if (!inicios.has(nivel)) inicios.set(nivel, Date.now()); },
    async enviarReto(reto, respuesta) {
      const s = SECRETOS[reto.id];
      const { credito, puntos } = evaluarReto(s.solucion, respuesta, reto.puntos);
      ganados.set(reto.nivel, (ganados.get(reto.nivel) || 0) + puntos);
      return { credito, puntos, solucion: s.solucion, feedback: s.feedback, resumen: s.resumen };
    },
    async terminarNivel(nivel) {
      const segundos = (Date.now() - (inicios.get(nivel) ?? Date.now())) / 1000;
      return { bono: calcularBono({ puntosGanados: ganados.get(nivel) || 0, segundos, referencia: TIEMPOS_REFERENCIA[nivel] }) };
    }
  };
}
