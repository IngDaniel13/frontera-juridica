import Phaser from 'phaser';
import { ANCHO, ALTO } from './constantes.js';
import BootScene from './scenes/BootScene.js';
import NivelScene from './scenes/NivelScene.js';

// Configuración ligera: 30 FPS, sin físicas, escala que se adapta a cualquier pantalla.
export function crearJuego(parent) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: ANCHO,
    height: ALTO,
    backgroundColor: '#0f2a43',
    pixelArt: true,
    fps: { target: 30 },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [BootScene, NivelScene]
  });
}
