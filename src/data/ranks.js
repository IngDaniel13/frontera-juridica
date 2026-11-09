// Rangos según puntaje acumulado (máximo posible: 8.000 + 15 % de bono = 9.200).
// Si cambias los umbrales, actualiza también la función rango_para() de supabase/migracion_v2.sql.
export const RANGOS = [
  { nivel: 1, nombre: 'Novato jurídico', desde: 0 },
  { nivel: 2, nombre: 'Aprendiz internacionalista', desde: 2000 },
  { nivel: 3, nombre: 'Jurista en formación', desde: 4000 },
  { nivel: 4, nombre: 'Especialista internacional', desde: 6000 },
  { nivel: 5, nombre: 'Maestro del Derecho Internacional Privado', desde: 7500 }
];

export function rangoPorPuntos(puntos) {
  let actual = RANGOS[0];
  for (const r of RANGOS) if (puntos >= r.desde) actual = r;
  return actual;
}

export const siguienteRango = (puntos) => RANGOS.find((r) => r.desde > puntos) || null;
