import Phaser from 'phaser';

// Punto interactivo del escenario. Estados: normal (pendiente), bloqueado (aún no disponible) y hecho.
// Tipos: «ficha» (descubrimiento, signo «!») y «reto» (signo «★»). Puede mostrar un personaje (sprite).
export default class PuntoDesafio extends Phaser.GameObjects.Container {
  constructor(escena, definicion, indice, estado) {
    super(escena, definicion.x, definicion.y);
    this.indice = indice;
    this.definicion = definicion;
    this.hecho = estado === 'hecho';
    this.bloqueadoPunto = estado === 'bloqueado';
    this.avisado = false;

    this.icono = escena.add.image(0, 0, 'punto');
    this.signo = escena.add.text(0, 0, '', { fontFamily: 'monospace', fontSize: '20px', fontStyle: 'bold', color: '#0f2a43' }).setOrigin(0.5);
    this.etiqueta = escena.add.text(0, 22, definicion.etiqueta, {
      fontFamily: 'monospace', fontSize: '12px', color: '#f3efe6', align: 'center',
      backgroundColor: 'rgba(15,42,67,0.88)', padding: { x: 4, y: 2 }, wordWrap: { width: 140 }
    }).setOrigin(0.5, 0);
    this.add([this.icono, this.signo, this.etiqueta]);
    if (definicion.sprite) { this.personaje = escena.add.image(-26, -6, definicion.sprite); this.addAt(this.personaje, 0); }
    this.setDepth(2);
    escena.add.existing(this);
    this.pintar();
  }

  pintar() {
    this.pulso?.stop();
    this.icono.setScale(1);
    if (this.hecho) { this.icono.setTexture('punto_ok'); this.signo.setText('✓').setColor('#ffffff'); this.etiqueta.setAlpha(0.7); return; }
    if (this.bloqueadoPunto) { this.icono.setTexture('punto_bloq'); this.signo.setText('🔒').setColor('#ffffff'); this.etiqueta.setAlpha(0.7); return; }
    const esReto = this.definicion.tipo === 'reto';
    this.icono.setTexture(esReto ? 'punto_reto' : 'punto');
    this.signo.setText(esReto ? '★' : '!').setColor('#0f2a43');
    this.etiqueta.setAlpha(1);
    // Único movimiento no provocado por el jugador: un pulso suave que señala lo pendiente.
    this.pulso = this.scene.tweens.add({ targets: this.icono, scale: 1.12, yoyo: true, repeat: -1, duration: 750 });
  }

  completar() { this.hecho = true; this.bloqueadoPunto = false; this.pintar(); }
  desbloquear() { if (this.hecho) return; this.bloqueadoPunto = false; this.pintar(); }
}
