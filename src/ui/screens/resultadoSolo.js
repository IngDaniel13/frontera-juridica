import { el, boton, formatoPuntos } from '../../utils/dom.js';
import { ir } from '../router.js';
import { rangoPorPuntos, siguienteRango } from '../../data/ranks.js';

export function pantallaResultadoSolo(cont, { nombre, puntos, aciertos, total }) {
  const rango = rangoPorPuntos(puntos);
  const sig = siguienteRango(puntos);
  cont.append(el('main', { class: 'pantalla pantalla--mapa' }, el('div', { class: 'pantalla__contenido' },
    el('header', { class: 'sello' }, el('h1', {}, '¡MISIÓN CUMPLIDA!'), el('p', {}, `Bien hecho, ${nombre}`)),
    el('section', { class: 'tarjeta centrado tarjeta--compacta' },
      el('p', { class: 'cuenta-atras' }, formatoPuntos(puntos)),
      el('p', {}, `puntos · ${aciertos} de ${total} retos perfectos`),
      el('h3', {}, `Rango: ${rango.nombre}`),
      el('p', { class: 'suave' }, sig ? `Te faltaron ${formatoPuntos(sig.desde - puntos)} puntos para ser «${sig.nombre}».` : 'Has alcanzado el rango máximo.')),
    el('div', { class: 'fila-botones' }, boton('Jugar de nuevo', 'primario', () => ir('solo')), boton('Clasificación', 'normal', () => ir('clasificacion'))),
    boton('Menú principal', 'fantasma', () => ir('inicio')))));
}
