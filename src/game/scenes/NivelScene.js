import Phaser from 'phaser';
import { nivelPorId } from '../../levels/index.js';
import { dibujarFondo } from '../systems/fondos.js';
import Jugador from '../objects/Jugador.js';
import PuntoDesafio from '../objects/PuntoDesafio.js';
import { bus } from '../../utils/eventos.js';
import { ANCHO, ALTO, LIMITE_SUPERIOR, VELOCIDAD, RADIO_DESAFIO } from '../constantes.js';

// Escena de exploración (nivel 1). Los puntos pueden ser fichas de descubrimiento o retos bloqueados hasta cumplir un objetivo.
export default class NivelScene extends Phaser.Scene {
  constructor() { super('Nivel'); }

  init(datos) {
    this.nivel = nivelPorId(datos.nivelId);
    this.completados = new Set(datos.completados || []);
    this.bloqueadosIniciales = new Set(datos.bloqueados || []);
    this.bloqueado = false;
    this.destino = null;
  }

  create() {
    dibujarFondo(this, this.nivel);
    this.jugador = new Jugador(this, this.nivel.inicio.x, this.nivel.inicio.y);
    this.puntos = this.nivel.puntos.map((p, i) => {
      const estado = this.completados.has(i) ? 'hecho' : this.bloqueadosIniciales.has(i) ? 'bloqueado' : 'normal';
      return new PuntoDesafio(this, p, i, estado);
    });
    this.marca = this.add.circle(0, 0, 6, 0xd9a441, 0.85).setVisible(false).setDepth(1);

    this.input.on('pointerdown', (p) => {
      if (this.bloqueado) return;
      this.destino = {
        x: Phaser.Math.Clamp(p.worldX, 16, ANCHO - 16),
        y: Phaser.Math.Clamp(p.worldY, LIMITE_SUPERIOR, ALTO - 16)
      };
      this.marca.setPosition(this.destino.x, this.destino.y).setVisible(true);
    });
    this.teclas = this.input.keyboard.addKeys({ arriba: 'UP', abajo: 'DOWN', izq: 'LEFT', der: 'RIGHT', w: 'W', a: 'A', s: 'S', d: 'D' });
  }

  update(_tiempo, delta) {
    if (this.bloqueado) { this.jugador.mover(0, 0, delta); return; }
    const k = this.teclas;
    let vx = 0, vy = 0;
    if (k.izq.isDown || k.a.isDown) vx -= 1;
    if (k.der.isDown || k.d.isDown) vx += 1;
    if (k.arriba.isDown || k.w.isDown) vy -= 1;
    if (k.abajo.isDown || k.s.isDown) vy += 1;

    const paso = (VELOCIDAD * delta) / 1000;
    if (vx || vy) {
      this.detenerDestino();
      const n = Math.hypot(vx, vy);
      this.jugador.mover((vx / n) * paso, (vy / n) * paso, delta);
    } else if (this.destino) {
      const dx = this.destino.x - this.jugador.x;
      const dy = this.destino.y - this.jugador.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= paso) { this.jugador.mover(dx, dy, delta); this.detenerDestino(); }
      else this.jugador.mover((dx / dist) * paso, (dy / dist) * paso, delta);
    } else {
      this.jugador.mover(0, 0, delta);
    }

    for (const punto of this.puntos) {
      if (punto.hecho) continue;
      const cerca = Phaser.Math.Distance.Between(this.jugador.x, this.jugador.y, punto.x, punto.y) < RADIO_DESAFIO;
      if (!cerca) { punto.avisado = false; continue; }
      if (punto.bloqueadoPunto) {
        if (!punto.avisado) { punto.avisado = true; bus.emit('punto-bloqueado', { indice: punto.indice }); }
        continue;
      }
      this.bloqueado = true;
      this.detenerDestino();
      bus.emit('punto-alcanzado', { indice: punto.indice });
      break;
    }
  }

  detenerDestino() { this.destino = null; this.marca?.setVisible(false); }
  bloquear(valor) { this.bloqueado = valor; if (valor) this.detenerDestino(); }
  marcarCompletado(indice) { this.puntos[indice]?.completar(); }
  desbloquear(indice) { if (indice !== undefined) this.puntos[indice]?.desbloquear(); }
}
