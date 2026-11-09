import { el } from '../../utils/dom.js';
import { reproducir } from '../../utils/sonido.js';
import { vigilarAjuste } from '../../utils/ajuste.js';
import { abrirModal } from '../components/modal.js';

// Mesa de negociación (sin scroll): la contraparte plantea, el jugador propone, ella reacciona; al cerrar cada punto se
// redacta el contrato. El último paso es la REVISIÓN: resumen del contrato y firma con confirmación.
export function crearNegociar(reto, { alConfirmar }) {
  const total = reto.rondas.length;
  let r = 0;                       // punto actual; r === total significa «revisión y firma»
  let confianza = 50;
  let elegida = null;
  let bloqueado = false;
  const acuerdos = {};
  const cerrados = [];

  const barra = el('i');
  const etapa = el('strong', { class: 'ng-etapa' });
  const globo = el('div', { class: 'ng-globo' });
  const globoTexto = el('p', { class: 'ng-globo__texto' });
  globo.append(globoTexto);
  const props = el('div', { class: 'ng-props' });
  const pie = el('div', { class: 'ng-pie' });
  const reajustar = vigilarAjuste(globo, globoTexto);

  const retrato = (p) => el('div', { class: 'ng-retrato' }, el('span', { class: 'ng-cara' }, p.emoji), el('small', {}, p.nombre));
  const btnInteres = el('button', { type: 'button', class: 'ng-mini', 'aria-label': 'Ver tus intereses', onClick: verIntereses }, 'ℹ');
  const btnContrato = el('button', { type: 'button', class: 'ng-mini', 'aria-label': 'Ver el contrato', onClick: verContrato }, '📄');

  const lineaContrato = (c) => el('li', {}, el('strong', {}, `${c.tema}: `), c.texto);
  function verIntereses() {
    const ronda = reto.rondas[Math.min(r, total - 1)];
    abrirModal({ titulo: 'Tus intereses', cuerpo: el('div', {}, el('p', {}, reto.intro), el('p', { class: 'ng-modal__interes' }, ronda.interes)), botones: [{ texto: 'Entendido', variante: 'primario' }] });
  }
  function verContrato() {
    abrirModal({
      titulo: 'Contrato hasta ahora',
      cuerpo: cerrados.length ? el('ul', { class: 'ng-hoja' }, cerrados.map(lineaContrato)) : el('p', {}, 'Aún no has cerrado ningún punto.'),
      botones: [{ texto: 'Cerrar', variante: 'primario' }]
    });
  }

  function pintarRonda() {
    const ronda = reto.rondas[r];
    const opcion = ronda.opciones.find((o) => o.id === elegida);
    etapa.textContent = `${ronda.tema} (${r + 1}/${total})`;
    if (opcion) {
      const acepta = opcion.reaccion.tipo === 'acepta';
      globo.className = `ng-globo ${acepta ? 'ng-globo--acepta' : 'ng-globo--rechaza'}`;
      globoTexto.textContent = `${acepta ? '🙂' : '😠'} ${opcion.reaccion.texto}`;
    } else {
      globo.className = 'ng-globo ng-globo--ellos';
      globoTexto.textContent = ronda.dice;
    }
    props.className = 'ng-props';
    props.replaceChildren(...ronda.opciones.map((o) => el('button', {
      type: 'button', class: `ng-prop${elegida === o.id ? ' ng-prop--sel' : ''}`, disabled: bloqueado, onClick: () => proponer(o)
    }, o.texto)));
    const acepta = opcion?.reaccion.tipo === 'acepta';
    pie.replaceChildren(el('button', {
      type: 'button', class: 'boton boton--primario', disabled: bloqueado || !acepta, onClick: cerrarPunto
    }, !opcion ? 'Elige una propuesta' : acepta ? 'Cerrar este punto' : 'Rechazó: haz otra propuesta'));
    reajustar();
  }

  function pintarRevision() {
    etapa.textContent = 'Revisión y firma';
    globo.className = 'ng-globo ng-globo--ellos';
    globoTexto.textContent = '«Entonces tenemos un acuerdo. Revise las condiciones y, si está de acuerdo, firmamos.»';
    props.className = 'ng-props ng-props--resumen';
    props.replaceChildren(el('ul', { class: 'ng-hoja' }, cerrados.map(lineaContrato)));
    pie.replaceChildren(el('button', { type: 'button', class: 'boton boton--primario', disabled: bloqueado, onClick: pedirFirma }, bloqueado ? 'Firmando…' : 'Firmar contrato'));
    reajustar();
  }

  const pintar = () => (r >= total ? pintarRevision() : pintarRonda());

  function proponer(o) { if (bloqueado) return; reproducir('seleccion'); elegida = o.id; pintarRonda(); }

  function cerrarPunto() {
    const ronda = reto.rondas[r];
    const o = ronda.opciones.find((x) => x.id === elegida);
    if (!o || o.reaccion.tipo !== 'acepta') return;
    acuerdos[ronda.clave] = o.id;
    cerrados.push({ tema: ronda.tema, texto: o.texto });
    confianza = Math.min(100, Math.max(0, confianza + o.reaccion.confianza));
    barra.style.width = `${confianza}%`;
    elegida = null;
    r += 1;
    pintar();
  }

  // Validación + confirmación: solo se firma con todos los puntos cerrados; el jugador confirma viendo el resumen.
  function pedirFirma() {
    if (bloqueado) return;
    if (Object.keys(acuerdos).length < total) return;
    abrirModal({
      titulo: '¿Confirmas la firma?',
      cuerpo: el('div', {}, el('p', {}, 'Al firmar, el contrato queda cerrado con estas condiciones:'), el('ul', { class: 'ng-hoja' }, cerrados.map(lineaContrato))),
      botones: [
        { texto: 'Seguir revisando', variante: 'fantasma' },
        { texto: 'Sí, firmar', variante: 'primario', onClick: firmar }
      ]
    });
  }
  function firmar() { bloqueado = true; pintarRevision(); alConfirmar({ ...acuerdos }); }

  barra.style.width = `${confianza}%`;
  const raiz = el('div', { class: 'ng' },
    el('div', { class: 'ng-izq' },
      el('div', { class: 'ng-top' }, retrato(reto.contraparte),
        el('div', { class: 'ng-centro' }, etapa, el('div', { class: 'ng-conf', title: 'Confianza de la contraparte' }, barra)),
        retrato(reto.jugador), btnInteres, btnContrato),
      globo),
    el('div', { class: 'ng-der' }, props, pie));
  pintar();
  // Bloquear/desbloquear NO vuelve a dibujar otra ronda: solo cambia el estado de los botones (causa del fallo de la firma).
  return {
    raiz,
    bloquear() { bloqueado = true; pintar(); },
    desbloquear() { bloqueado = false; pintar(); }
  };
}
