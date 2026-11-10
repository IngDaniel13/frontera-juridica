import { el, boton } from '../../utils/dom.js';
import { ir } from '../router.js';
import { supabaseConfigurado } from '../../services/supabase.js';
import { botonSonido } from '../components/botonSonido.js';

export function cintaModoLocal() {
  return supabaseConfigurado ? null
    : el('div', { class: 'cinta', role: 'note' }, 'MODO LOCAL DE DEMOSTRACIÓN · sin Supabase: solo modo individual');
}

export function pantallaInicio(cont) {
  cont.append(el('main', { class: 'pantalla pantalla--mapa' }, el('div', { class: 'menu' },
    el('div', { class: 'menu__izq' },
      cintaModoLocal(),
      el('header', { class: 'sello' }, el('h1', {}, 'FRONTERAS', el('br'), 'JURÍDICAS'), el('p', {}, 'Juego de Derecho Internacional Privado'), el('p', { class: 'grupo-academico' }, 'GRUPO 8')),
      el('p', { class: 'lema' }, 'Incoterms, UCP 600, arbitraje CCI y una misión comercial.')),
    el('div', { class: 'menu__der' },
      boton('JUGAR', 'primario', () => ir('solo')),
      boton('MULTIJUGADOR', 'normal', () => ir('multi')),
      boton('CLASIFICACIÓN', 'normal', () => ir('clasificacion')),
      boton('CÓMO JUGAR', 'normal', () => ir('comoJugar')),
      el('div', { class: 'fila-botones' }, boton('Información', 'fantasma', () => ir('info')), botonSonido())))));
}
