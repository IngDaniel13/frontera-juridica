# Parche v2 · Fronteras Jurídicas (mecánicas diferenciadas por nivel)

Copia el CONTENIDO de esta carpeta sobre tu proyecto `FRONTERAS-JURIDICAS` (acepta «Reemplazar»).
Todo lo demás (router, lobby, Realtime, Supabase auth, sonidos, ranking, estilos base) queda igual.

## 1. Eliminar (4 archivos obsoletos)
- `src/data/questions.js`
- `src/data/respuestasLocales.js`
- `scripts/banco-preguntas.mjs`
- `supabase/seed_preguntas.sql`
- (Opcional) `src/ui/components/pregunta.js`: ya no se usa.

## 2. Reemplazar (ya existen)
`scripts/generar-datos.mjs` · `src/main.js` · `src/data/ranks.js` · `src/multiplayer/scoring.js` · `src/multiplayer/rooms.js`
`src/ui/screens/` → `solo.js`, `sala.js`, `resultadoSolo.js`, `comoJugar.js`, `clasificacion.js`
`src/ui/components/hud.js` · `src/game/juego.js` · `src/game/scenes/NivelScene.js` · `src/game/objects/PuntoDesafio.js`
`src/game/systems/texturas.js` · `src/levels/level1.js`, `level2.js`, `level3.js`, `level4.js`

## 3. Añadir (archivos nuevos)
`scripts/banco-retos.mjs` · `src/data/retos.js` · `src/data/retosLocales.js` · `src/multiplayer/local.js`
`src/ui/screens/partida.js` · `src/ui/niveles/` (comun, nivel1–4) · `src/ui/widgets/` (7 archivos) · `src/styles/niveles.css`
`supabase/migracion_v2.sql` · `supabase/seed_retos.sql`

## 4. Probar sin Supabase (modo local)
```bash
npm run dev
```
(No hace falta `npm install` de nuevo: no hay dependencias nuevas.)

## 5. Supabase (solo para multijugador) — en este orden, en SQL Editor
1. Pega y ejecuta `supabase/migracion_v2.sql`  (borra las tablas antiguas `questions` y `answers`).
2. Pega y ejecuta `supabase/seed_retos.sql`.
3. No cambies nada más: `.env`, Auth anónimo y Realtime siguen igual.

## 6. Si cambias contenido
Edita `scripts/banco-retos.mjs` → `npm run generar-datos` (regenera `retos.js`, `retosLocales.js` y `seed_retos.sql`) → vuelve a ejecutar `seed_retos.sql` en Supabase.
