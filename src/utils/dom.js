import { reproducir } from './sonido.js';

// Crea un elemento del DOM. Los textos se insertan como texto (nunca como HTML) para evitar inyecciones.
export function el(etiqueta, props = {}, ...hijos) {
  const nodo = document.createElement(etiqueta);
  for (const [k, v] of Object.entries(props || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') nodo.className = v;
    else if (k.startsWith('on') && typeof v === 'function') nodo.addEventListener(k.slice(2).toLowerCase(), v);
    else nodo.setAttribute(k, v === true ? '' : v);
  }
  for (const h of hijos.flat()) {
    if (h === null || h === undefined || h === false) continue;
    nodo.append(h.nodeType ? h : document.createTextNode(String(h)));
  }
  return nodo;
}

export const $ = (selector, raiz = document) => raiz.querySelector(selector);

export function boton(texto, variante, onClick, props = {}) {
  return el('button', {
    type: 'button',
    class: `boton boton--${variante}`,
    onClick: (e) => { reproducir('seleccion'); onClick?.(e); },
    ...props
  }, texto);
}

let temporizadorAviso;
export function mostrarAviso(texto, tipo = 'info', ms = 4000) {
  const nodo = document.getElementById('aviso');
  if (!nodo) return;
  nodo.textContent = texto;
  nodo.className = `aviso aviso--${tipo}`;
  nodo.hidden = false;
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => { nodo.hidden = true; }, ms);
}

export const formatoPuntos = (n) => Number(n || 0).toLocaleString('es-CO');
