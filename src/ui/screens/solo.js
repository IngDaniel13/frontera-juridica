import { el, boton, mostrarAviso } from '../../utils/dom.js';
import { ir } from '../router.js';
import { iniciarPartida } from './partida.js';
import { validarApodo } from '../../multiplayer/players.js';
import { crearBackendLocal } from '../../multiplayer/local.js';
import { leerApodo, guardarApodo, guardarResultadoLocal } from '../../utils/almacenamiento.js';
import { fijarDesfase } from '../../utils/tiempo.js';
import { reproducir } from '../../utils/sonido.js';

// MODO INDIVIDUAL (local): se evalúa en el navegador y el puntaje se guarda solo en este dispositivo.
export function pantallaSolo(cont) {
  let partida = null;
  const campo = el('input', { id: 'apodo', maxlength: '16', autocomplete: 'nickname', value: leerApodo(), placeholder: 'Tu alias' });

  async function empezar() {
    const v = validarApodo(campo.value);
    if (!v.ok) { mostrarAviso(v.mensaje, 'error'); campo.focus(); return; }
    guardarApodo(v.valor);
    let backend;
    try { backend = await crearBackendLocal(); } catch { mostrarAviso('No se pudo cargar el juego. Recarga la página.', 'error'); return; }
    fijarDesfase(0);
    partida = iniciarPartida({
      cont, backend,
      alSalir: () => { if (confirm('¿Salir de la partida? Perderás el progreso.')) ir('inicio'); },
      alTerminar: ({ puntos, perfectos, total }) => {
        guardarResultadoLocal({ nombre: v.valor, puntos, aciertos: perfectos, total });
        reproducir('victoria');
        ir('resultadoSolo', { nombre: v.valor, puntos, aciertos: perfectos, total });
      }
    });
  }
  campo.addEventListener('keydown', (e) => { if (e.key === 'Enter') empezar(); });

  cont.append(el('main', { class: 'pantalla pantalla--mapa' }, el('div', { class: 'pantalla__contenido' },
    el('h2', {}, 'Modo individual'),
    el('p', {}, 'Cuatro niveles: explora la Cámara, recorre los instrumentos de la CCI, negocia un contrato y cumple una misión comercial. Tu puntaje se guarda en este dispositivo.'),
    el('div', { class: 'campo' }, el('label', { for: 'apodo' }, 'Tu nombre o alias'), campo),
    boton('EMPEZAR', 'primario', empezar),
    boton('Volver', 'fantasma', () => ir('inicio')))));

  return () => partida?.detener();
}
