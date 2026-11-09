import { el } from '../../utils/dom.js';
import { reproducir } from '../../utils/sonido.js';
import { vigilarAjuste } from '../../utils/ajuste.js';

// Filas evaluables de cada tipo de reto: { clave, titulo, etiqueta(valor) }.
function describirFilas(reto) {
  const mapa = (lista) => Object.fromEntries(lista.map((x) => [x.id, x.texto]));
  if (reto.tipo === 'clasificar') {
    const c = mapa(reto.categorias);
    return reto.items.map((i) => ({ clave: i.id, titulo: i.texto, etiqueta: (v) => c[v] }));
  }
  return reto.rondas.map((r) => ({ clave: r.clave, titulo: r.tema, etiqueta: (v) => r.opciones.find((o) => o.id === v)?.texto }));
}

const mejorValor = (creditos = {}) => Object.entries(creditos).sort((a, b) => b[1] - a[1])[0]?.[0];

// Pantalla de resultado por pasos (sin scroll): una tarjeta por decisión (qué decidiste, por qué, consecuencia y alternativa)
// y una última de resumen. Los números permiten saltar a cualquier tarjeta.
export function crearPantallaResultado(reto, respuesta, res, { tema, onContinuar, textoContinuar = 'Continuar' }) {
  const filas = describirFilas(reto);
  const paginas = filas.map((f) => {
    const valor = respuesta[f.clave];
    const cred = Number(res.solucion?.[f.clave]?.[valor]) || 0;
    const fb = res.feedback?.[f.clave];
    const texto = typeof fb === 'string' ? fb : fb?.[valor] ?? '';
    const mejor = mejorValor(res.solucion?.[f.clave]);
    const estado = cred >= 0.999 ? ['✔', 'ok', 'Correcto'] : cred <= 0.001 ? ['✖', 'mal', 'Incorrecto'] : ['◐', 'parcial', 'Parcialmente adecuado'];
    return { estado, nodos: [
      el('p', { class: 'res__estado' }, `${estado[0]} ${estado[2]}`),
      el('p', { class: 'res__titulo' }, f.titulo),
      el('p', { class: 'res__decision' }, `Decidiste: ${f.etiqueta(valor) ?? '—'}`),
      el('p', {}, texto),
      cred < 0.999 ? el('p', { class: 'res__mejor' }, `Lo más adecuado: ${f.etiqueta(mejor) ?? '—'}`) : null,
      cred < 0.999 ? el('p', { class: 'res__consecuencia' }, `Consecuencia: ${reto.consecuencia}`) : null
    ] };
  });
  const incidentes = res.feedback?._incidentes;
  paginas.push({ estado: ['★', 'resumen', 'Resumen'], nodos: [
    el('p', { class: 'res__estado' }, '★ Lo que debes recordar'),
    ...(incidentes?.length ? [el('ul', { class: 'res__incidentes' }, incidentes.map((x) => el('li', {}, `${x.texto} → lo soporta el ${x.soporta.toLowerCase()}.`)))] : []),
    el('p', { class: 'res__resumen' }, res.resumen)
  ] });

  let i = 0;
  const cuerpo = el('div', { class: 'res__cuerpo' });
  const tarjeta = el('div', { class: 'res__tarjeta' }, cuerpo);
  const relleno = el('i');
  const chips = paginas.map((p, k) => el('button', { type: 'button', class: `res__chip res__chip--${p.estado[1]}`, 'aria-label': `Ver ${k + 1}`, onClick: () => ir(k) }, p.estado[0]));
  const atras = el('button', { type: 'button', class: 'boton boton--fantasma res__atras', 'aria-label': 'Anterior', onClick: () => ir(i - 1) }, '◀');
  const adelante = el('button', { type: 'button', class: 'boton boton--primario res__adelante', onClick: () => { if (i === paginas.length - 1) onContinuar(); else ir(i + 1); } });
  const reajustar = vigilarAjuste(tarjeta, cuerpo);

  function ir(k) {
    reproducir('seleccion');
    i = Math.min(paginas.length - 1, Math.max(0, k));
    cuerpo.className = `res__cuerpo res__cuerpo--${paginas[i].estado[1]}`;
    cuerpo.replaceChildren(...paginas[i].nodos);
    chips.forEach((c, j) => c.classList.toggle('res__chip--actual', j === i));
    atras.disabled = i === 0;
    adelante.textContent = i === paginas.length - 1 ? textoContinuar : 'Siguiente ▶';
    reajustar();
  }

  const raiz = el('main', { class: `pantalla reto ${tema}` }, el('div', { class: 'reto__fijo' },
    el('div', { class: 'res' },
      el('div', { class: 'res__cab' }, el('strong', {}, `Resultado: ${res.puntos} de ${reto.puntos} puntos`), el('div', { class: 'res__barra' }, relleno)),
      el('div', { class: 'res__chips' }, chips), tarjeta,
      el('div', { class: 'res__nav' }, atras, adelante))));
  ir(0);
  setTimeout(() => { relleno.style.width = `${Math.round((res.credito || 0) * 100)}%`; }, 150);
  reproducir(res.credito >= 0.8 ? 'correcto' : res.credito < 0.5 ? 'incorrecto' : 'seleccion');
  return raiz;
}
