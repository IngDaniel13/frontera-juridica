import Phaser from 'phaser';
import { crearTexturas } from '../systems/texturas.js';

// Genera los gráficos pixel art por código (sin archivos de imagen pesados) y avisa a la interfaz.
export default class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  create() {
    crearTexturas(this);
    this.game.events.emit('texturas-listas');
  }
}
