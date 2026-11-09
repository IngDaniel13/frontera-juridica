// Ajuste de texto sin scroll: si el texto no cabe en su contenedor, se reduce la letra poco a poco
// (nunca por debajo de 14 px). Se vuelve a calcular cuando cambia el tamaño del contenedor.
const MINIMO = 14;

export function ajustarTexto(contenedor, objetivo = contenedor, minimo = MINIMO) {
  if (!contenedor?.isConnected) return;
  objetivo.style.fontSize = '';
  let tam = parseFloat(getComputedStyle(objetivo).fontSize) || 16;
  while (contenedor.scrollHeight > contenedor.clientHeight + 1 && tam > minimo) {
    tam -= 1;
    objetivo.style.fontSize = `${tam}px`;
  }
}

// Programa el ajuste tras el siguiente pintado y lo repite si el contenedor cambia de tamaño.
export function vigilarAjuste(contenedor, objetivo = contenedor) {
  const correr = () => requestAnimationFrame(() => ajustarTexto(contenedor, objetivo));
  correr();
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(correr).observe(contenedor);
  return correr;
}
