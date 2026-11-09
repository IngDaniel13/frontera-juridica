import { el, boton, mostrarAviso, formatoPuntos } from '../../utils/dom.js';
import { NIVELES } from '../../levels/index.js';
import { TOTAL_RETOS } from '../../data/retos.js';
import { crearHud } from '../components/hud.js';
import { vigilarAjuste } from '../../utils/ajuste.js';
import { jugarNivel1 } from '../niveles/nivel1.js';
import { jugarNivel2 } from '../niveles/nivel2.js';
import { jugarNivel3 } from '../niveles/nivel3.js';
import { jugarNivel4 } from '../niveles/nivel4.js';

const MODULOS = [jugarNivel1, jugarNivel2, jugarNivel3, jugarNivel4];

// Motor de partida común (modo individual y sala). El «backend» decide dónde se evalúa: local (navegador) o Supabase.
export function iniciarPartida({ cont, backend, estado = {}, alTabla, alTerminar, alSalir }) {
  let activo = true;
  const limpiezas = [];
  const respondidos = estado.respondidos || new Map();
  const est = { puntos: estado.puntos || 0, nivelPuntos: 0, perfectos: [...respondidos.values()].filter((r) => r.credito > 0.999).length };
  const hud = crearHud({ titulo: '', onSalir: alSalir, onTabla: alTabla });

  const mostrar = (nodo) => cont.replaceChildren(hud.raiz, ...(nodo ? [nodo] : []));
  const progreso = () => `${respondidos.size}/${TOTAL_RETOS}`;
  hud.actualizar({ puntos: est.puntos, progreso: progreso() });

  const ctx = {
    cont, hud, respondidos, mostrar,
    activo: () => activo,
    alDetener: (fn) => limpiezas.push(fn),
    async enviar(reto, respuesta) {
      const res = await backend.enviarReto(reto, respuesta);
      respondidos.set(reto.id, { puntos: res.puntos, credito: res.credito });
      est.nivelPuntos += res.puntos;
      if (res.credito > 0.999) est.perfectos += 1;
      est.puntos = res.puntajeTotal ?? est.puntos + res.puntos;
      hud.actualizar({ puntos: est.puntos, progreso: progreso() });
      return res;
    }
  };

  // Tarjeta de transición: el texto se ajusta para caber sin scroll.
  function tarjeta({ titulo, lineas, textoBoton }) {
    return new Promise((resolver) => {
      const cuerpo = el('div', { class: 'tarjeta__cuerpo' }, ...lineas.map((l) => (typeof l === 'string' ? el('p', {}, l) : l)));
      const caja = el('div', { class: 'tarjeta tarjeta--fija' }, el('h2', {}, titulo), cuerpo);
      mostrar(el('main', { class: 'pantalla pantalla--velo' }, el('div', { class: 'pantalla__contenido' }, caja, boton(textoBoton, 'primario', resolver))));
      vigilarAjuste(caja, cuerpo);
    });
  }

  async function conReintento(fn) {
    for (;;) {
      try { return await fn(); } catch (e) {
        if (!activo) return undefined;
        await tarjeta({ titulo: 'No se pudo continuar', lineas: [e.message], textoBoton: 'REINTENTAR' });
      }
    }
  }

  async function correr() {
    const inicio = estado.nivelInicial || 0;
    for (let i = inicio; i < NIVELES.length && activo; i++) {
      const nivel = NIVELES[i];
      hud.actualizar({ titulo: `Nivel ${nivel.id} · ${nivel.corto}`, puntos: est.puntos, progreso: progreso() });
      await tarjeta({
        titulo: `Nivel ${nivel.id}: ${nivel.nombre}`,
        lineas: [nivel.intro, el('p', { class: 'suave' }, `Objetivo: ${nivel.objetivo}`)],
        textoBoton: i === inicio && inicio > 0 ? 'CONTINUAR' : 'ENTRAR AL NIVEL'
      });
      if (!activo) return;
      await conReintento(() => backend.entrarNivel(nivel.id));
      est.nivelPuntos = 0;
      for (const [id, r] of respondidos) if (id.startsWith(`n${nivel.id}`)) est.nivelPuntos += r.puntos;
      await MODULOS[i](ctx);
      if (!activo) return;
      const fin = await conReintento(() => backend.terminarNivel(nivel.id));
      if (!activo || !fin) return;
      est.puntos = fin.puntajeTotal ?? est.puntos + fin.bono;
      hud.actualizar({ puntos: est.puntos });
      const hayMas = i < NIVELES.length - 1;
      await tarjeta({
        titulo: `¡Nivel ${nivel.id} completado!`,
        lineas: [`Puntos del nivel: ${formatoPuntos(est.nivelPuntos)}`, `Bono por precisión y rapidez: +${formatoPuntos(fin.bono)}`, `Puntaje total: ${formatoPuntos(est.puntos)}`],
        textoBoton: hayMas ? `CONTINUAR AL NIVEL ${nivel.id + 1}` : 'VER CONCEPTOS CLAVE'
      });
      if (!activo) return;
      if (!hayMas && nivel.recordatorios) {
        // Conceptos clave en páginas de 3 para que se lean cómodamente y quepan en cualquier pantalla sin scroll.
        const grupos = [];
        for (let k = 0; k < nivel.recordatorios.length; k += 3) grupos.push(nivel.recordatorios.slice(k, k + 3));
        for (let g = 0; g < grupos.length && activo; g++) {
          await tarjeta({
            titulo: `Conceptos clave (${g + 1}/${grupos.length})`,
            lineas: [el('ul', { class: 'lista-corta' }, grupos[g].map((t) => el('li', {}, t)))],
            textoBoton: g === grupos.length - 1 ? 'VER RESULTADO FINAL' : 'SIGUIENTE'
          });
        }
      }
    }
    if (activo) alTerminar?.({ puntos: est.puntos, perfectos: est.perfectos, total: TOTAL_RETOS });
  }

  correr().catch((e) => { if (activo) mostrarAviso(e.message || 'Error inesperado en la partida.', 'error', 6000); });
  return { detener() { activo = false; limpiezas.forEach((f) => f()); } };
}
