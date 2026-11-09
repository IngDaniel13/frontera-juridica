import { ANCHO, ALTO } from '../constantes.js';

// Escenarios 2D de cada nivel, dibujados con formas simples (rápidos y livianos).
const PAPEL = 0xf3efe6, LATON = 0xd9a441, TINTA = 0x0f2a43;

const texto = (e, x, y, s, tam = 14, color = '#f3efe6') =>
  e.add.text(x, y, s, { fontFamily: 'monospace', fontSize: `${tam}px`, fontStyle: 'bold', color }).setOrigin(0.5).setDepth(1);

const suelo = (e, clave) => e.add.tileSprite(0, 0, ANCHO, ALTO, clave).setOrigin(0).setDepth(0);

function bandera(g, x, y, w, h, tipo) {
  g.fillStyle(0x444444).fillRect(x - 3, y - 4, 3, h + 30);
  if (tipo === 'co') {
    g.fillStyle(0xfcd116).fillRect(x, y, w, h / 2);
    g.fillStyle(0x003893).fillRect(x, y + h / 2, w, h / 4);
    g.fillStyle(0xce1126).fillRect(x, y + (h * 3) / 4, w, h / 4);
  } else {
    g.fillStyle(0x000000).fillRect(x, y, w, h / 3);
    g.fillStyle(0xdd0000).fillRect(x, y + h / 3, w, h / 3);
    g.fillStyle(0xffce00).fillRect(x, y + (2 * h) / 3, w, h / 3);
  }
}

function frontis(g, color, colorColumnas) {
  g.fillStyle(color).fillTriangle(240, 6, 60, 56, 420, 56).fillRect(60, 56, 360, 10);
  g.fillStyle(colorColumnas);
  [70, 150, 230, 310, 390].forEach((x) => g.fillRect(x, 66, 20, 34));
}

function camara(e) {
  suelo(e, 'baldosa_camara');
  const g = e.add.graphics().setDepth(1);
  g.fillStyle(0x1b3a57).fillRect(0, 0, ANCHO, 104);
  frontis(g, LATON, PAPEL);
  g.fillStyle(0x7a1f2b, 0.55).fillRect(206, 104, 68, ALTO - 104);   // alfombra central
  bandera(g, 24, 118, 30, 20, 'co');
  bandera(g, 426, 118, 30, 20, 'de');
  g.fillStyle(0x3f7d4e).fillCircle(20, 600, 14).fillCircle(460, 600, 14);
  texto(e, 240, 34, 'CCI', 22, '#0f2a43');
}

function ruta(e) {
  const g = e.add.graphics().setDepth(0);
  g.fillStyle(0x5f8f5a).fillRect(0, 0, ANCHO, 250);         // Alemania
  g.fillStyle(0x1f6fa5).fillRect(0, 250, ANCHO, 150);       // mar
  g.fillStyle(0x7aa45a).fillRect(0, 400, ANCHO, ALTO - 400); // Colombia
  g.fillStyle(0xd8c58b).fillRect(0, 240, ANCHO, 10).fillRect(0, 400, ANCHO, 10);
  g.fillStyle(0x9fd0ee);
  [272, 305, 340, 372].forEach((y, f) => { for (let x = 10 + (f % 2) * 20; x < ANCHO; x += 44) g.fillRect(x, y, 18, 3); });
  g.fillStyle(0x7a5230).fillRect(320, 232, 130, 16).fillRect(320, 402, 130, 16);   // muelles
  // Buque con contenedores
  g.fillStyle(0x2b2b3a).fillRect(230, 318, 150, 24).fillTriangle(380, 318, 408, 318, 380, 342);
  [0xc0392b, 0x2a9d8f, 0xd9a441, 0x3d6fb4].forEach((c, i) => { g.fillStyle(c).fillRect(240 + i * 34, 296, 30, 22); });
  g.setDepth(0.5);
  texto(e, 80, 116, 'ALEMANIA', 16);
  texto(e, 80, 618, 'COLOMBIA', 16);
  texto(e, 400, 262, 'Océano Atlántico', 11, '#cfe9f7');
}

function mesa(e) {
  suelo(e, 'baldosa_mesa');
  const g = e.add.graphics().setDepth(1);
  g.fillStyle(0x3a2a1c).fillRect(0, 0, ANCHO, 104);
  bandera(g, 120, 30, 60, 40, 'co');
  bandera(g, 300, 30, 60, 40, 'de');
  g.fillStyle(0x7a1f2b, 0.5).fillRect(70, 215, 340, 250);
  g.fillStyle(0x6b3f1d).fillRoundedRect(130, 255, 220, 140, 14);
  g.fillStyle(0x8a5a2b).fillRoundedRect(138, 263, 204, 124, 10);
  g.fillStyle(PAPEL).fillRect(165, 285, 36, 26).fillRect(279, 335, 36, 26);
  g.fillStyle(LATON).fillCircle(240, 325, 8);
  texto(e, 240, 380, 'MESA DE NEGOCIACIÓN', 10, '#f3efe6');
}

function mision(e) {
  suelo(e, 'baldosa_mision');
  const g = e.add.graphics().setDepth(1);
  g.fillStyle(0x3b4a57).fillRect(0, 0, ANCHO, 104);
  frontis(g, 0xb8c2cc, 0xe4e9ee);
  g.fillStyle(0x333a40).fillRect(0, 420, ANCHO, 40);                    // vía
  g.fillStyle(0xe6d27a);
  for (let x = 6; x < ANCHO; x += 40) g.fillRect(x, 438, 22, 3);
  g.fillStyle(0xc0392b).fillRect(200, 410, 60, 24).fillStyle(0xf3efe6).fillRect(260, 414, 24, 20);   // camión
  [0xc0392b, 0x2a9d8f, 0xd9a441].forEach((c, i) => { g.fillStyle(c).fillRect(4, 250 + i * 26, 54, 24); g.fillRect(422, 520 + (i % 2) * 26, 54, 24); });
  texto(e, 240, 34, 'TRIBUNALES', 18, '#0f2a43');
}

const FONDOS = { camara, ruta, mesa, mision };
export function dibujarFondo(escena, nivel) { FONDOS[nivel.fondo](escena); }
