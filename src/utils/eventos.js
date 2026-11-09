// Bus de eventos mínimo para comunicar la escena de Phaser con la interfaz.
const oyentes = new Map();
export const bus = {
  on(evento, fn) {
    if (!oyentes.has(evento)) oyentes.set(evento, new Set());
    oyentes.get(evento).add(fn);
    return () => oyentes.get(evento)?.delete(fn);
  },
  emit(evento, datos) {
    oyentes.get(evento)?.forEach((fn) => fn(datos));
  }
};
