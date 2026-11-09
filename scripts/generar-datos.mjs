// Genera los datos del juego a partir de scripts/banco-retos.mjs y valida su coherencia.
// Salida: src/data/retos.js (público), src/data/retosLocales.js (secretos, solo modo individual) y supabase/seed_retos.sql
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { BANCO } from './banco-retos.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const fallo = (id, msg) => { throw new Error(`${id}: ${msg}`); };

// Valores admitidos por cada clave, según el tipo de reto (para validar la solución).
function esquema(r) {
  switch (r.tipo) {
    case 'clasificar': return Object.fromEntries(r.items.map((i) => [i.id, r.categorias.map((c) => c.id)]));
    case 'negociar': return Object.fromEntries(r.rondas.map((x) => [x.clave, x.opciones.map((o) => o.id)]));
    default: return fallo(r.id, `tipo desconocido ${r.tipo}`);
  }
}

const ids = new Set();
for (const r of BANCO) {
  if (ids.has(r.id)) fallo(r.id, 'id repetido');
  ids.add(r.id);
  if (!r.corto) fallo(r.id, 'falta el texto corto de interfaz');
  const esq = esquema(r);
  const claves = Object.keys(r.solucion);
  if (claves.slice().sort().join() !== Object.keys(esq).sort().join()) fallo(r.id, 'la solución debe cubrir exactamente todas las claves');
  for (const k of claves) {
    const creditos = Object.entries(r.solucion[k]);
    if (!creditos.some(([, c]) => c === 1)) fallo(r.id, `la clave ${k} no tiene respuesta con crédito 1`);
    for (const [v, c] of creditos) {
      if (!esq[k].includes(v)) fallo(r.id, `valor inexistente ${k}=${v}`);
      if (c < 0 || c > 1) fallo(r.id, `crédito fuera de rango ${k}=${v}`);
    }
    const fb = r.feedback?.[k];
    if (!fb) fallo(r.id, `falta feedback de ${k}`);
    if (typeof fb === 'object') for (const v of esq[k]) if (!fb[v]) fallo(r.id, `falta feedback de ${k}=${v}`);
  }
  if (!r.resumen || !r.consecuencia) fallo(r.id, 'falta resumen o consecuencia');
  if (r.tipo === 'clasificar' && r.items.length > 7) fallo(r.id, 'demasiadas tarjetas para una pantalla fija');
  if (r.tipo === 'clasificar' && r.categorias.length > 5) fallo(r.id, 'demasiadas categorías para una pantalla fija');
}

const SECRETOS_CAMPOS = ['solucion', 'feedback', 'resumen'];
const publicos = BANCO.map((r) => Object.fromEntries(Object.entries(r).filter(([k]) => !SECRETOS_CAMPOS.includes(k))));
const secretos = Object.fromEntries(BANCO.map((r) => [r.id, { solucion: r.solucion, feedback: r.feedback, resumen: r.resumen }]));
const cab = '// ARCHIVO GENERADO por scripts/generar-datos.mjs. No lo edites a mano: edita scripts/banco-retos.mjs\n';

writeFileSync(join(raiz, 'src/data/retos.js'),
`${cab}// Parte PÚBLICA de los retos (lo que se dibuja). No contiene soluciones.
export const RETOS = ${JSON.stringify(publicos, null, 2)};

export const TOTAL_RETOS = RETOS.length;
export const retoPorId = (id) => RETOS.find((r) => r.id === id);
export const retosDeNivel = (nivel) => RETOS.filter((r) => r.nivel === nivel).sort((a, b) => a.orden - b.orden);
`);
writeFileSync(join(raiz, 'src/data/retosLocales.js'),
`${cab}// Soluciones y retroalimentación. Se cargan SOLO en el modo individual (al terminar cada reto).
// En multijugador no se usan: la evaluación la hace Supabase.
export const SECRETOS = ${JSON.stringify(secretos, null, 2)};
`);

const q = (s) => `'${String(s).replaceAll("'", "''")}'`;
const filas = BANCO.map((r) => `  (${q(r.id)}, ${r.nivel}, ${r.orden}, ${r.puntos}, ${q(JSON.stringify(r.solucion))}::jsonb, ${q(JSON.stringify(r.feedback))}::jsonb, ${q(r.resumen)})`).join(',\n');
const lista = BANCO.map((r) => q(r.id)).join(', ');
writeFileSync(join(raiz, 'supabase/seed_retos.sql'),
`-- ARCHIVO GENERADO por scripts/generar-datos.mjs. Ejecútalo DESPUÉS de migracion_v2.sql (también al actualizar el contenido).
-- Primero elimina retos que ya no existen (así terminar_nivel cuenta solo los retos vigentes).
delete from public.challenges where id not in (${lista});

insert into public.challenges (id, level_id, position, points, solution, feedback, summary) values
${filas}
on conflict (id) do update set
  level_id = excluded.level_id, position = excluded.position, points = excluded.points,
  solution = excluded.solution, feedback = excluded.feedback, summary = excluded.summary;
`);
const total = BANCO.reduce((s, r) => s + r.puntos, 0);
console.log(`OK: ${BANCO.length} retos · ${total} puntos base · máximo con bonos ${Math.round(total * 1.15)}`);
