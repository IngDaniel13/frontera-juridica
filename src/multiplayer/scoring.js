// Puntuación transversal. LAS MISMAS reglas están en supabase/migracion_v2.sql (evaluar_credito, enviar_reto, terminar_nivel).
// En multijugador manda el servidor; estas funciones se usan en el modo individual (local).
export const PORCENTAJE_BONO = 0.15;
// Tiempo de referencia por nivel (segundos): dentro de ese tiempo el bono es completo; al doble, cero.
export const TIEMPOS_REFERENCIA = { 1: 360, 2: 300, 3: 300, 4: 480 };

// solucion: { clave: { valor: crédito } } · respuesta: { clave: valor }. Crédito = promedio de las claves.
export function evaluarReto(solucion, respuesta, puntos) {
  const claves = Object.keys(solucion);
  const suma = claves.reduce((s, k) => s + (Number(solucion[k]?.[respuesta?.[k]]) || 0), 0);
  const credito = claves.length ? suma / claves.length : 0;
  return { credito, puntos: Math.round(puntos * credito) };
}

// Bono por eficiencia: 15 % de lo ganado en el nivel, escalado por rapidez (solo premia lo bien resuelto).
export function calcularBono({ puntosGanados, segundos, referencia }) {
  const factor = Math.min(Math.max((2 * referencia - segundos) / referencia, 0), 1);
  return Math.round(PORCENTAJE_BONO * puntosGanados * factor);
}
