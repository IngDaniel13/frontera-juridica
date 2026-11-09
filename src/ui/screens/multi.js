import { el, boton, mostrarAviso } from '../../utils/dom.js';
import { ir } from '../router.js';
import { supabaseConfigurado } from '../../services/supabase.js';
import { validarApodo } from '../../multiplayer/players.js';
import { leerApodo, guardarApodo, guardarSalaActiva } from '../../utils/almacenamiento.js';
import { cintaModoLocal } from './inicio.js';

export function pantallaMulti(cont, params = {}) {
  if (!supabaseConfigurado) {
    cont.append(el('main', { class: 'pantalla pantalla--mapa' }, el('div', { class: 'pantalla__contenido' },
      cintaModoLocal(),
      el('h2', {}, 'Multijugador'),
      el('section', { class: 'tarjeta' },
        el('p', {}, 'Para jugar con otras personas se necesita conectar el proyecto a Supabase (gratuito).'),
        el('p', { class: 'suave' }, 'Sigue la sección «Configuración de Supabase» del README, crea el archivo .env y reinicia el juego. Mientras tanto, el modo individual funciona sin conexión.')),
      boton('Jugar en modo individual', 'primario', () => ir('solo')),
      boton('Volver', 'fantasma', () => ir('inicio')))));
    return;
  }

  const apodo = el('input', { id: 'apodo', maxlength: '16', autocomplete: 'nickname', value: leerApodo(), placeholder: 'Tu alias' });
  const codigo = el('input', { id: 'codigo', class: 'codigo', maxlength: '5', autocomplete: 'off', autocapitalize: 'characters', placeholder: 'CÓDIGO', value: params.codigo || '' });
  const btnCrear = boton('CREAR SALA', 'primario', () => accion('crear'));
  const btnUnir = boton('UNIRSE', 'normal', () => accion('unir'));
  codigo.addEventListener('input', () => { codigo.value = codigo.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); });

  async function accion(tipo) {
    const v = validarApodo(apodo.value);
    if (!v.ok) { mostrarAviso(v.mensaje, 'error'); apodo.focus(); return; }
    if (tipo === 'unir' && codigo.value.length !== 5) { mostrarAviso('El código de la sala tiene 5 caracteres.', 'error'); codigo.focus(); return; }
    guardarApodo(v.valor);
    btnCrear.disabled = btnUnir.disabled = true;
    try {
      const salas = await import('../../multiplayer/rooms.js');
      const r = tipo === 'crear' ? await salas.crearSala(v.valor) : await salas.unirseSala(codigo.value, v.valor);
      guardarSalaActiva(r.room_id);
      history.replaceState(null, '', location.pathname);   // limpia ?sala= de la dirección
      ir('sala', { salaId: r.room_id });
    } catch (e) {
      mostrarAviso(e.message, 'error', 6000);
      btnCrear.disabled = btnUnir.disabled = false;
    }
  }

  cont.append(el('main', { class: 'pantalla pantalla--mapa' }, el('div', { class: 'pantalla__contenido' },
    el('h2', {}, 'Multijugador'),
    el('div', { class: 'form2' },
      el('div', { class: 'form2__col' },
        el('div', { class: 'campo' }, el('label', { for: 'apodo' }, 'Tu nombre o alias'), apodo),
        btnCrear),
      el('div', { class: 'form2__col' },
        el('div', { class: 'campo' }, el('label', { for: 'codigo' }, 'Código de la sala'), codigo),
        btnUnir)),
    boton('Volver', 'fantasma', () => ir('inicio')))));
  if (params.codigo) apodo.focus();
}
