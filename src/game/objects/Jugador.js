import Phaser from 'phaser';
import { ANCHO, ALTO, LIMITE_SUPERIOR } from '../constantes.js';

// Personaje principal: un jurista con maletín.
export default class Jugador extends Phaser.GameObjects.Container {
  constructor(escena, x, y) {
    super(escena, x, y);
    this.sombra = escena.add.image(0, 16, 'sombra');
    this.cuerpo = escena.add.image(0, 0, 'jugador');
    this.add([this.sombra, this.cuerpo]);
    this.setDepth(5);
    this.fase = 0;
    escena.add.existing(this);
  }

  mover(dx, dy, delta) {
    if (dx || dy) {
      this.x = Phaser.Math.Clamp(this.x + dx, 16, ANCHO - 16);
      this.y = Phaser.Math.Clamp(this.y + dy, LIMITE_SUPERIOR, ALTO - 16);
      this.fase += delta * 0.02;
      this.cuerpo.y = Math.round(Math.sin(this.fase) * 2);   // pequeño balanceo al caminar
      if (dx) this.cuerpo.setFlipX(dx < 0);
    } else {
      this.cuerpo.y = 0;
    }
  }
}
