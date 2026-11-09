// Efectos de sonido sencillos (archivos WAV pequeños). El jugador puede desactivarlos.
const ARCHIVOS = { seleccion: 'select.wav', correcto: 'correct.wav', incorrecto: 'wrong.wav', victoria: 'victory.wav' };
const cache = {};
let activo = true;
try { activo = localStorage.getItem('fj_sonido') !== '0'; } catch { /* sin almacenamiento */ }

export const sonidoActivo = () => activo;

export function alternarSonido() {
  activo = !activo;
  try { localStorage.setItem('fj_sonido', activo ? '1' : '0'); } catch { /* ignorar */ }
  return activo;
}

export function reproducir(nombre) {
  if (!activo || !ARCHIVOS[nombre]) return;
  try {
    const audio = (cache[nombre] ??= new Audio(`${import.meta.env.BASE_URL}assets/audio/${ARCHIVOS[nombre]}`));
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch { /* el audio nunca debe romper el juego */ }
}
