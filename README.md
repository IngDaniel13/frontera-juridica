# FRONTERAS JURÍDICAS

Videojuego educativo 2D multijugador para aprender y evaluar **Derecho Internacional Privado** a partir de una operación comercial entre Colombia y Alemania. Funciona en el navegador (celulares y computadores), con Phaser 3, Vite y Supabase (plan gratuito).

## Requisitos

- [Node.js](https://nodejs.org) 18 o superior (incluye `npm`).
- [Visual Studio Code](https://code.visualstudio.com).
- Para el multijugador: una cuenta gratuita en [supabase.com](https://supabase.com).

## Instalación y ejecución local

1. Descomprime `FRONTERAS-JURIDICAS.zip` y abre la carpeta en Visual Studio Code (**Archivo → Abrir carpeta**).
2. Abre la terminal integrada (**Terminal → Nueva terminal**) y ejecuta:

```bash
npm install
npm run dev
```

3. Abre la dirección que aparece (normalmente `http://localhost:5173`). Con `npm run dev` también se muestra una dirección de red (`Network`) para abrir el juego desde un celular conectado a la misma red Wi-Fi.

> `npm install` descarga las dependencias y **genera `package-lock.json`** (el ZIP se preparó en un entorno sin acceso a internet, por lo que ese archivo se crea en tu primera instalación).

### Modo local de demostración

Si no has configurado Supabase, el juego arranca igualmente en **modo local**: se ve una cinta roja que lo indica, el **modo individual** (botón JUGAR) funciona completo y la clasificación se guarda en tu dispositivo. El multijugador **no** está disponible hasta configurar Supabase (el juego no simula partidas multijugador).

## Configuración de Supabase (multijugador)

1. Crea una cuenta gratuita en <https://supabase.com> y pulsa **New project**. Elige un nombre, una contraseña de base de datos y la región más cercana.
2. Ve a **Project Settings → API** y copia **Project URL** y la clave **anon public**. (Nunca uses la clave `service_role` en este proyecto.)
3. En la carpeta del proyecto, copia `.env.example` como `.env` y pega los valores:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon
```

4. En Supabase abre **SQL Editor → New query** y ejecuta, **en este orden** (pega el contenido de cada archivo y pulsa *Run*):
   1. `supabase/schema.sql`
   2. `supabase/policies.sql`
   3. `supabase/seed_preguntas.sql`
5. Activa los inicios de sesión anónimos: **Authentication → Sign In / Providers → Allow anonymous sign-ins → activado**. (Cada jugador recibe una identidad anónima; no necesita correo ni contraseña.)
6. Verifica Realtime: **Database → Publications → supabase_realtime** debe incluir las tablas `rooms` y `room_players` (`policies.sql` ya lo hace).
7. Reinicia `npm run dev` (Vite lee `.env` al arrancar). La cinta roja de «modo local» desaparecerá.

### Cómo probar el multijugador
Abre el juego en dos pestañas (cada pestaña es un jugador distinto) o en dos celulares. En la primera: **MULTIJUGADOR → CREAR SALA**. En la segunda: escribe un alias y el código de 5 caracteres (o abre el enlace de invitación). El anfitrión pulsa **INICIAR PARTIDA** (mínimo 2 jugadores, máximo 10).

## Publicación en Netlify (gratuita)

1. Sube el proyecto a un repositorio de GitHub (el archivo `.env` no se sube: está en `.gitignore`).
2. En <https://app.netlify.com> elige **Add new site → Import an existing project** y selecciona el repositorio. Netlify detecta `netlify.toml` (comando `npm run build`, carpeta `dist`).
3. En **Site configuration → Environment variables** agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
4. Despliega. La dirección que te dé Netlify es la que compartes con los estudiantes.

## Cómo funciona

- **Modo individual:** caminas por escenarios 2D (tocar la pantalla o flechas/WASD) hasta los desafíos; cada uno es una pregunta con temporizador, puntos y explicación.
- **Multijugador (estilo Kahoot):** el servidor decide el estado de la sala, cuándo empieza cada pregunta y calcula los puntos. Los dispositivos solo envían la opción elegida.
- **Puntuación:** 1.000 puntos (respuesta correcta instantánea) → 700 (mitad del tiempo) → 400 (último instante), lineal; incorrecta = 0. El tiempo lo mide el servidor.
- **Rangos:** Novato jurídico (0) · Aprendiz internacionalista (5.000) · Jurista en formación (10.000) · Especialista internacional (15.000) · Maestro del Derecho Internacional Privado (19.000). Máximo posible: 23.000.
- **Reconexión:** el estado vive en Supabase. Si un jugador pierde la conexión o recarga la pestaña, vuelve a la sala con su puntaje y respuestas; se muestra un aviso de «Reintentando…» y la sala se resincroniza sola. Si la pestaña se cierra por completo, la identidad anónima se pierde (se guarda por pestaña).
- **Si el anfitrión se desconecta,** la partida queda en pausa hasta que vuelva (solo él puede avanzar).

## Seguridad

- No hay claves privadas en el código; solo la clave pública `anon` por variables de entorno.
- Las tablas tienen RLS: el navegador no puede escribir directamente; todo pasa por funciones SQL (`crear_sala`, `unirse_sala`, `enviar_respuesta`, `avanzar_sala`…) que validan membresía, fase, tiempo y duplicados (`unique(room_id, player_id, question_id)`).
- La tabla `questions` (con la respuesta correcta) no es legible por el navegador; los jugadores leen la vista `questions_public`, y la respuesta correcta solo se entrega cuando la sala está en fase de revelación.
- Limitación conocida: en **modo individual** las respuestas están dentro del código descargado (`respuestasLocales.js`, se carga solo en ese modo); no es un modo competitivo. En multijugador no se envían al navegador.

## Contenido académico: puntos a validar por el docente

Las preguntas son una síntesis pedagógica de los cuatro niveles; se recomienda su validación antes de usarlas en evaluación:

- **Nivel 3, «Compensaciones»:** se interpretó como compensaciones pactadas por incumplimiento o retraso (p. ej. cláusula penal). Confirmar si el temario le da otro alcance.
- **Nivel 4, reconocimiento de decisiones extranjeras:** se aborda el exequátur de sentencias extranjeras ante la Corte Suprema de Justicia de Colombia y sus requisitos generales (firmeza, legalización, orden público, competencia exclusiva). Verificar las referencias normativas exactas y si se desea incluir el reconocimiento de **laudos arbitrales** (Convención de Nueva York), que no se incluyó para no salir del temario.
- Los Incoterms se tratan solo como reglas de entrega, costos y riesgos (versión Incoterms® 2020).

Para editar preguntas: modifica `scripts/banco-preguntas.mjs` y ejecuta `npm run generar-datos` (regenera `src/data/*` y `supabase/seed_preguntas.sql`; luego vuelve a ejecutar el seed en Supabase).

## Estructura

```
FRONTERAS-JURIDICAS/
├── public/ (favicon.svg, assets/audio/*.wav)
├── scripts/ (banco-preguntas.mjs, generar-datos.mjs)
├── src/
│   ├── main.js
│   ├── game/ (config, juego, constantes, scenes/, objects/, systems/)   ← motor Phaser
│   ├── levels/ (level1–4.js, index.js)                                  ← los 4 niveles
│   ├── data/ (questions.js, respuestasLocales.js, ranks.js)
│   ├── multiplayer/ (rooms, realtime, players, scoring)
│   ├── services/supabase.js
│   ├── ui/ (router.js, components/, screens/)
│   ├── styles/main.css
│   └── utils/
├── supabase/ (schema.sql, policies.sql, seed_preguntas.sql)
├── index.html · package.json · vite.config.js · netlify.toml
├── .env.example · .gitignore · README.md
```

Los gráficos pixel art (personaje, escenarios) se generan por código con Phaser, y los 4 efectos de sonido (`.wav`, ~75 KB en total) se crearon localmente: no hay recursos externos ni licencias que atender.
