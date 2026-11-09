// Validación del alias del jugador (mismas reglas que la base de datos: 2 a 16 caracteres).
export function validarApodo(texto) {
  const valor = String(texto || '').replace(/\s+/g, ' ').trim();
  if (valor.length < 2 || valor.length > 16) {
    return { ok: false, valor, mensaje: 'Escribe un alias de 2 a 16 caracteres.' };
  }
  return { ok: true, valor, mensaje: '' };
}
