// Genera por código todos los gráficos (pixel art ligero). No hay imágenes externas que descargar.
function dibujar(escena, clave, ancho, alto, fn) {
  const g = escena.make.graphics({ x: 0, y: 0, add: false });
  fn(g);
  g.generateTexture(clave, ancho, alto);
  g.destroy();
}

function pixeles(escena, clave, filas, paleta, t = 2) {
  const ancho = Math.max(...filas.map((f) => f.length));
  dibujar(escena, clave, ancho * t, filas.length * t, (g) => {
    filas.forEach((fila, y) => [...fila].forEach((c, x) => {
      if (paleta[c] === undefined) return;
      g.fillStyle(paleta[c], 1);
      g.fillRect(x * t, y * t, t, t);
    }));
  });
}

function baldosa(escena, clave, c1, c2) {
  dibujar(escena, clave, 32, 32, (g) => {
    g.fillStyle(c1).fillRect(0, 0, 32, 32);
    g.fillStyle(c2).fillRect(0, 0, 16, 16).fillRect(16, 16, 16, 16);
  });
}

const JURISTA = [
  '....dddd....',
  '...dddddd...',
  '...ssssss...',
  '...sesses...',
  '...ssssss...',
  '..nnnrrnnn..',
  '.nnnnrrnnnn.',
  '.nnnnrrnnnn.',
  '.snnnnnnnns.',
  '..nnnnnnnnbb',
  '..nnnnnnnnbb',
  '..ppp..pppbb',
  '..ppp..ppp..',
  '..ppp..ppp..',
  '.kkkk..kkkk.'
];

export function crearTexturas(escena) {
  pixeles(escena, 'jugador', JURISTA, {
    d: 0x2b1b12, s: 0xe0ac84, e: 0x1a1a1a, n: 0x264a73, r: 0xc0392b, p: 0x2a2a35, k: 0x111111, b: 0x8b5a2b
  }, 2);
  dibujar(escena, 'sombra', 28, 10, (g) => { g.fillStyle(0x000000, 0.3).fillEllipse(14, 5, 24, 8); });
  dibujar(escena, 'punto', 36, 36, (g) => { g.fillStyle(0xf3efe6).fillCircle(18, 18, 17); g.fillStyle(0xd9a441).fillCircle(18, 18, 14); });
  dibujar(escena, 'punto_reto', 36, 36, (g) => { g.fillStyle(0xf3efe6).fillCircle(18, 18, 17); g.fillStyle(0x2a9d8f).fillCircle(18, 18, 14); });
  dibujar(escena, 'punto_bloq', 36, 36, (g) => { g.fillStyle(0xf3efe6).fillCircle(18, 18, 17); g.fillStyle(0x6b7785).fillCircle(18, 18, 14); });
  pixeles(escena, 'guia', JURISTA, { d: 0x8a8a8a, s: 0xc98f6b, e: 0x1a1a1a, n: 0x7a1f2b, r: 0xd9a441, p: 0x3a3a3a, k: 0x111111, b: 0xf3efe6 }, 2);
  dibujar(escena, 'punto_ok', 36, 36, (g) => { g.fillStyle(0xf3efe6).fillCircle(18, 18, 17); g.fillStyle(0x2e9e5b).fillCircle(18, 18, 14); });
  baldosa(escena, 'baldosa_camara', 0xd9d2c0, 0xcbc3ad);
  baldosa(escena, 'baldosa_mesa', 0x4a2f1b, 0x42291a);
  baldosa(escena, 'baldosa_mision', 0x71828f, 0x677985);
}
