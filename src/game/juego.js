// Puente entre la interfaz y Phaser. Phaser se carga solo al entrar al nivel 1 (la pantalla inicial es liviana).
let juego = null;
let preparado = null;

const contenedor = () => document.getElementById('juego');

async function asegurarJuego() {
  if (preparado) return preparado;
  preparado = (async () => {
    const { crearJuego } = await import('./config.js');
    juego = crearJuego('juego');
    await new Promise((resolver) => juego.events.once('texturas-listas', resolver));
  })();
  return preparado;
}

// extra: { completados: [indices], bloqueados: [indices] }
export async function mostrarNivel(nivelId, modo, extra = {}) {
  contenedor().classList.add('visible');          // primero visible, para que Phaser mida bien el tamaño
  await asegurarJuego();
  juego.loop.wake();
  juego.scale.refresh();
  juego.scene.stop('Nivel');
  juego.scene.start('Nivel', { nivelId, modo, completados: [], bloqueados: [], ...extra });
}

export const escenaNivel = () => (juego ? juego.scene.getScene('Nivel') : null);

export function ocultarJuego() {
  contenedor()?.classList.remove('visible');
  if (juego) {
    juego.scene.stop('Nivel');
    juego.loop.sleep();                           // sin consumo de CPU mientras se ven otras pantallas
  }
}
