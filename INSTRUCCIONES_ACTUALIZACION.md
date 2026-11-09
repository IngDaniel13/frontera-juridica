# Actualización v3 · Fronteras Jurídicas

Esta actualización se aplica sobre tu proyecto actual (el que ya tiene el parche v2). No hay dependencias nuevas:
**no hace falta `npm install`**. Los archivos conservan sus rutas: copia el contenido de esta carpeta sobre tu proyecto y acepta «Reemplazar».

## 1. Qué cambió y por qué

| Tema | Cambio |
|---|---|
| **Pantalla fija** | Ninguna pantalla usa scroll. Se reparte el alto con flexbox/grid, el contenido largo se divide en pasos (tarjetas, paginador, páginas) o ventanas emergentes, los textos se ajustan al espacio (`utils/ajuste.js`, mínimo 14 px) y en móvil horizontal se usan dos columnas. No se ocultan barras: se eliminó el desbordamiento. |
| **Nivel 1** | Mismo contenido, soluciones, puntos y fichas de exploración (verificado: idéntico al anterior). Solo cambia la distribución: la clasificación muestra **una tarjeta a la vez** y sus categorías; los números permiten volver a cualquier tarjeta y cambiar la decisión antes de confirmar. |
| **Nivel 2** | Nuevo: **Instrumentos de la CCI**. Mapa con 3 estaciones (Incoterms 2020, UCP 600, Arbitraje CCI): se descubren conceptos y se resuelven asociaciones y clasificaciones. 6 actividades. |
| **Nivel 3** | Nuevo: **negociación** con Herr Keller: Incoterm de entrega → crédito documentario sujeto a UCP 600 → arbitraje CCI → revisión y firma. Reacciones de la contraparte y consecuencias jurídicas al firmar. |
| **Nivel 4** | Nuevo: **misión en 4 etapas** (entrega y responsabilidades, pago y documentos, controversia, cierre con naturaleza de decisiones y exequátur) + «Conceptos clave» al final. |
| **Botón «Firmar contrato»** | Ver sección 2. |
| **Puntos** | Se mantienen 8.000 puntos base + bono de hasta 15 % por nivel (máx. 9.200). Los rangos y la migración SQL **no cambian**. |
| **Multijugador** | Intacto: salas, códigos, alias, evaluación en el servidor, clasificación en vivo (botón 🏆, ahora en ventana emergente paginada) y reanudación. |

## 2. Causa real del fallo de «Firmar contrato»
En `negociar.js` (v2), al firmar, `jugarReto` llamaba a `widget.bloquear()` y este **volvía a dibujar la ronda actual**. Como tras la última ronda el índice ya estaba fuera de rango (`reto.rondas[r]` = `undefined`), lanzaba un `TypeError` **antes de enviar la firma**: el botón ya se había borrado, la puntuación nunca se enviaba y no había forma de continuar (lo reproduje con el código anterior). Corrección:
- `bloquear()`/`desbloquear()` solo cambian el estado de los botones, no vuelven a dibujar rondas.
- La firma es un paso propio de **revisión** (resumen del contrato) + **ventana de confirmación** («Seguir revisando» / «Sí, firmar»). Solo se habilita con los 3 puntos cerrados.
- `jugarReto` (`niveles/comun.js`) ahora ejecuta todo dentro de `try/catch`: si falla el envío, muestra el error y **reactiva el botón** sin perder el contrato ni el puntaje.
- Tras firmar, el resultado explica las consecuencias y termina con **«Continuar al nivel 4»**.

## 3. Archivos

### Eliminar (obsoletos)
- `src/ui/widgets/clasificar.js`
- `src/ui/widgets/toggles.js`
- `src/ui/widgets/rutaIncoterm.js`
- `src/ui/widgets/nodoRuta.js`
- `src/ui/widgets/expediente.js`
- `src/ui/components/pregunta.js` (opcional: ya no se usa)

### Archivos NUEVOS
- `src/utils/ajuste.js`
- `src/ui/components/modal.js`, `paginador.js`, `listaPaginada.js`
- `src/ui/widgets/asignar.js`
- `src/styles/pantalla-fija.css`

### Archivos que se REEMPLAZAN
- `scripts/banco-retos.mjs`, `scripts/generar-datos.mjs`
- `src/data/retos.js`, `src/data/retosLocales.js` (generados)
- `src/main.js` (solo añade `import './styles/pantalla-fija.css'`)
- `src/styles/niveles.css`
- `src/ui/components/tablaPosiciones.js`
- `src/ui/widgets/negociar.js`, `resultado.js`
- `src/ui/niveles/comun.js`, `nivel1.js`, `nivel2.js`, `nivel3.js`, `nivel4.js`
- `src/ui/screens/partida.js`, `inicio.js`, `comoJugar.js`, `info.js`, `clasificacion.js`, `solo.js`, `multi.js`, `resultadoSolo.js`, `sala.js`
- `src/levels/level2.js`, `level3.js`, `level4.js`  (`level1.js` NO cambia)
- `supabase/seed_retos.sql` (generado)

No se tocan: `package.json`, `.env`, `vite.config.js`, `supabase/migracion_v2.sql`, `schema.sql`, `policies.sql`, `src/game/*`, `src/multiplayer/*`, `src/services/*`, `src/ui/components/hud.js`.

## 4. Configuración, comandos y Supabase
- **Variables de entorno:** ninguna nueva.
- **Comandos:** ninguno obligatorio. Si cambias contenido: edita `scripts/banco-retos.mjs` y ejecuta `npm run generar-datos`.
- **Supabase (solo si usas multijugador):** abre el SQL Editor y ejecuta **únicamente** `supabase/seed_retos.sql`. Reemplaza los retos del servidor por los nuevos (el nivel 2 pasa de 5 a 6 retos y los niveles 3 y 4 cambian). `migracion_v2.sql` ya lo ejecutaste: **no lo repitas**. Sin este paso, el multijugador evaluará con los retos antiguos y fallará.
- No inicies partidas multijugador abiertas antes de actualizar: sus resultados parciales usarían los retos antiguos.

## 5. Cómo iniciar
```bash
npm run dev
```
Abre `http://localhost:5173` (o la dirección de red desde el celular).

## 6. Cómo comprobarlo tú (pruebas manuales)
Marca como probado solo lo que veas funcionar.

**Sin scroll (en cada pantalla)**: menú, instrucciones (4 páginas), información (5), clasificación, formulario individual, multijugador, resultado. Prueba en celular vertical, celular horizontal, tablet y computador (o con F12 → modo dispositivo; también reduce la ventana del navegador). Ni la rueda del ratón ni el gesto táctil deben mover nada, y ningún botón debe quedar cortado.

**Nivel 1 (conserva contenido y mecánica)**: camina por la Cámara; hay 6 fichas («!»); al completarlas se abre la Mesa de clasificación (5 tarjetas) y luego el Baúl del exportador (6 tarjetas). Las tarjetas, categorías y respuestas correctas son las de antes. Comprueba que puedes tocar los números 1–5 para volver a una tarjeta y cambiarla, y que «Confirmar» solo se habilita con todas asignadas. Puntos esperados con todo correcto: 600 y 400.

**Nivel 2**: mapa con 3 estaciones → leer 3 tarjetas (se abren en ventana emergente) → 2 actividades por estación → resultado por pasos. Con todo correcto: 1.500 puntos.

**Nivel 3 y firma**: elige FCA, crédito con UCP 600 y arbitraje CCI; cierra cada punto; en la revisión pulsa «Firmar contrato» → «Seguir revisando» debe devolverte sin perder nada → de nuevo «Firmar contrato» → «Sí, firmar» → resultado → «Continuar al nivel 4». El puntaje del HUD debe conservarse. Prueba también opciones malas (p. ej., «No pactar nada»): debe explicar la consecuencia y aun así permitir firmar. Con todo correcto: 2.500 puntos.

**Nivel 4**: 5 actividades en 4 etapas, luego «Conceptos clave» (2 páginas) y el resultado final. Con todo correcto el total es **9.200** (8.000 + 15 % por nivel si juegas rápido).

**Multijugador**: con Supabase configurado y el seed ejecutado, abre dos pestañas (cada una es un jugador): crear/unirse, iniciar, jugar. Comprueba 🏆 (clasificación en vivo en ventana emergente), recargar la página a mitad de partida (debe retomar), la pantalla de espera al terminar primero y el final.

**Modo local**: sin `.env`, se ve «MODO LOCAL DE DEMOSTRACIÓN»; el modo individual funciona y el multijugador explica por qué no está disponible.
