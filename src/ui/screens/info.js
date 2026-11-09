import { el, boton } from '../../utils/dom.js';
import { ir } from '../router.js';
import { NIVELES } from '../../levels/index.js';
import { RANGOS } from '../../data/ranks.js';
import { crearPaginador } from '../components/paginador.js';
import { cintaModoLocal } from './inicio.js';

export function pantallaInfo(cont) {
  const nivelLi = (n) => el('li', {}, el('strong', {}, `Nivel ${n.id}. ${n.nombre}: `), n.ejes.join(', ') + '.');
  const paginas = [
    { titulo: 'El proyecto', contenido: [el('p', {}, 'Fronteras Jurídicas es un videojuego educativo para aprender Derecho Internacional Privado y los instrumentos de la Cámara de Comercio Internacional (CCI), a partir de operaciones entre Colombia y Alemania.')] },
    { titulo: 'Niveles 1 y 2', contenido: [el('ul', {}, NIVELES.slice(0, 2).map(nivelLi))] },
    { titulo: 'Niveles 3 y 4', contenido: [el('ul', {}, NIVELES.slice(2).map(nivelLi))] },
    { titulo: 'Rangos', contenido: [el('ul', {}, RANGOS.map((r) => el('li', {}, `${r.nombre} (desde ${r.desde.toLocaleString('es-CO')} puntos)`)))] },
    { titulo: 'Nota académica', contenido: [el('p', {}, 'El contenido es una síntesis pedagógica y debe ser validado por el docente responsable. Las situaciones son hipotéticas y no constituyen asesoría jurídica.')] }
  ];
  cont.append(el('main', { class: 'pantalla pantalla--mapa' }, el('div', { class: 'pantalla__contenido pantalla__contenido--llena' },
    cintaModoLocal(), el('h2', {}, 'Información del proyecto'), crearPaginador(paginas), boton('Volver', 'primario', () => ir('inicio')))));
}
