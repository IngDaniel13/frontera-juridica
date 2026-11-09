import { el, boton } from '../../utils/dom.js';
import { ir } from '../router.js';
import { crearPaginador } from '../components/paginador.js';

export function pantallaComoJugar(cont) {
  const paginas = [
    { titulo: 'Cuatro niveles', contenido: [el('ul', {},
      el('li', {}, el('strong', {}, 'Nivel 1 · Explora: '), 'camina por la Cámara, descubre fichas y clasifica herramientas.'),
      el('li', {}, el('strong', {}, 'Nivel 2 · Instrumentos CCI: '), 'visita tres estaciones (Incoterms, UCP 600, arbitraje).'),
      el('li', {}, el('strong', {}, 'Nivel 3 · Negocia: '), 'acuerda entrega, pago y controversias, y firma.'),
      el('li', {}, el('strong', {}, 'Nivel 4 · Misión: '), 'cuatro etapas que integran todo.')) ] },
    { titulo: 'Aprender haciendo', contenido: [
      el('p', {}, 'Cada reto cuenta una sola vez: decide con cuidado. Al terminar verás qué ocurrió, por qué, qué concepto jurídico se aplica y qué habría sido mejor.'),
      el('p', {}, 'Toca ℹ en cualquier reto para volver a leer sus instrucciones.')] },
    { titulo: 'Puntos y rangos', contenido: [
      el('p', {}, 'Cada reto da puntos según la calidad de tus decisiones (también hay aciertos parciales). Al cerrar un nivel recibes un bono de hasta 15 % por precisión y rapidez.'),
      el('p', {}, 'Rangos: Novato jurídico, Aprendiz internacionalista, Jurista en formación, Especialista internacional y Maestro del Derecho Internacional Privado.')] },
    { titulo: 'Multijugador', contenido: [
      el('p', {}, 'Un jugador crea la sala y comparte el código. Al iniciar, todos juegan los cuatro niveles a su ritmo y compiten en una clasificación en vivo (botón 🏆).'),
      el('p', {}, 'Gana quien más puntos sume.')] }
  ];
  cont.append(el('main', { class: 'pantalla pantalla--mapa' }, el('div', { class: 'pantalla__contenido pantalla__contenido--llena' },
    el('h2', {}, 'Cómo jugar'), crearPaginador(paginas), boton('Volver', 'primario', () => ir('inicio')))));
}
