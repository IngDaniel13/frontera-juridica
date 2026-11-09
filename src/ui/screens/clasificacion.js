import { el, boton, formatoPuntos } from '../../utils/dom.js';
import { ir } from '../router.js';
import { supabaseConfigurado } from '../../services/supabase.js';
import { leerResultadosLocales } from '../../utils/almacenamiento.js';
import { rangoPorPuntos } from '../../data/ranks.js';
import { crearListaPaginada } from '../components/listaPaginada.js';
import { cintaModoLocal } from './inicio.js';

function filaRanking(pos, nombre, puntos, detalle) {
  return el('div', { class: 'fila' },
    el('span', { class: 'fila__pos' }, `${pos}.`),
    el('div', { class: 'fila__nombre' }, el('strong', {}, nombre), el('span', { class: 'fila__sub' }, `${rangoPorPuntos(puntos).nombre} · ${detalle}`)),
    el('span', { class: 'fila__puntos' }, formatoPuntos(puntos)));
}

// Clasificación en páginas según el espacio disponible: nunca hace falta desplazarse.
export function pantallaClasificacion(cont) {
  let mensaje = '';
  const lp = crearListaPaginada({ renderFila: (f) => f });
  const pestLocal = boton('En este dispositivo', 'primario', () => verLocal());
  const pestGeneral = boton('General en línea', 'normal', () => verGeneral());

  function marcar(activa) {
    pestLocal.className = `boton ${activa === 'local' ? 'boton--primario' : 'boton--normal'}`;
    pestGeneral.className = `boton ${activa === 'general' ? 'boton--primario' : 'boton--normal'}`;
  }
  const mostrar = (filas, vacio) => { mensaje = vacio; lp.actualizar(filas.length ? filas : [el('p', { class: 'suave centrado' }, mensaje)]); };
  function verLocal() {
    marcar('local');
    const datos = leerResultadosLocales();
    mostrar(datos.map((r, i) => filaRanking(i + 1, r.nombre, r.puntos, `${r.aciertos}/${r.total} retos perfectos`)), 'Aún no hay partidas individuales en este dispositivo. ¡Juega la primera!');
  }
  async function verGeneral() {
    marcar('general');
    if (!supabaseConfigurado) { mostrar([], 'La clasificación general requiere Supabase (ver README).'); return; }
    mostrar([], 'Cargando…');
    try {
      const { rankingGeneral } = await import('../../multiplayer/rooms.js');
      const datos = await rankingGeneral(20);
      mostrar(datos.map((r) => filaRanking(r.posicion, r.nickname, r.mejor_puntaje, `${r.partidas} partida(s)`)), 'Todavía no hay partidas multijugador terminadas.');
    } catch (e) { mostrar([], `No se pudo cargar: ${e.message}`); }
  }

  cont.append(el('main', { class: 'pantalla pantalla--mapa' }, el('div', { class: 'pantalla__contenido pantalla__contenido--llena' },
    cintaModoLocal(),
    el('h2', {}, 'Clasificación'),
    el('div', { class: 'pestanas' }, pestLocal, pestGeneral),
    lp.raiz,
    boton('Volver', 'fantasma', () => ir('inicio')))));
  verLocal();
}
