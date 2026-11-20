// Arte del mapa del pueblo (versión Gemini Neon).
// Paleta retro rica (~22 colores) calibrada para mantener contraste nítido tras la cuantización de 4 tonos.
import { TILE, W, H, BUILDINGS, ground, SIGNS, BRIDGE, CAVE } from '../map.js';
export * from './sprites.js';

const rnd = (x, y, k) => (((x * 73856093) ^ (y * 19349663) ^ (k * 83492791)) >>> 0) % 1000 / 1000;
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(x, y, w, h); };

function shade(hex, amount) {
  const r = parseInt(hex.slice(1, 3), 16);
  const gr = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mix = (c) => Math.max(0, Math.min(255, Math.round(amount >= 0 ? c + (255 - c) * amount : c * (1 + amount))));
  return `#${[mix(r), mix(gr), mix(b)].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

const isBridgeTile = (tx, ty) => BRIDGE.some(([bx, by]) => bx === tx && by === ty);

// Césped con mechones de dos tonos, textura orgánica y florecillas silvestres.
function grass(g, ox, oy, tx, ty) {
  px(g, '#4ca152', ox, oy, TILE, TILE);
  for (let i = 0; i < 6; i++) {
    const x = Math.floor(rnd(tx, ty, i) * 14) + 1;
    const y = Math.floor(rnd(tx, ty, i + 30) * 13) + 1;
    px(g, '#398241', ox + x, oy + y, 1, 2);
    px(g, '#6fc267', ox + x + 1, oy + y, 1, 1);
  }
  if (rnd(tx, ty, 83) < 0.14) {
    const fx = 3 + Math.floor(rnd(tx, ty, 7) * 9);
    const fy = 3 + Math.floor(rnd(tx, ty, 8) * 9);
    const petal = ['#fff0a8', '#ff8f99', '#ffffff'][Math.floor(rnd(tx, ty, 9) * 3)];
    px(g, '#235e30', ox + fx, oy + fy + 2, 1, 1);
    px(g, petal, ox + fx, oy + fy - 1);
    px(g, petal, ox + fx - 1, oy + fy);
    px(g, petal, ox + fx + 1, oy + fy);
    px(g, petal, ox + fx, oy + fy + 1);
    px(g, '#f5b027', ox + fx, oy + fy);
  }
}

// Camino de grava y adoquines luminosos (Tono 3 en modo Game Boy) con bordillo contra el césped.
function path(g, ox, oy, tx, ty) {
  px(g, '#e4cb99', ox, oy, TILE, TILE);
  // Pequeños adoquines sutiles para dar ritmo al caminar
  for (let i = 0; i < 5; i++) {
    const x = 1 + Math.floor(rnd(tx, ty, i + 10) * 12);
    const y = 1 + Math.floor(rnd(tx, ty, i + 40) * 12);
    px(g, '#d2b47c', ox + x, oy + y, 3, 2);
    px(g, '#f2dfb8', ox + x, oy + y, 2, 1);
  }
  for (let i = 0; i < 4; i++) {
    const x = 2 + Math.floor(rnd(tx, ty, i + 70) * 12);
    const y = 2 + Math.floor(rnd(tx, ty, i + 90) * 12);
    px(g, '#b38d58', ox + x, oy + y, 1, 1);
  }
  // Bordes orgánicos donde el camino limita con césped o árbol
  const isPath = (x, y) => ground[y]?.[x] === 'path';
  const top = !isPath(tx, ty - 1);
  const bot = !isPath(tx, ty + 1);
  const lft = !isPath(tx - 1, ty);
  const rgt = !isPath(tx + 1, ty);
  if (top) {
    px(g, '#8c663b', ox, oy, TILE, 1);
    for (let x = 1; x < 15; x += 4) px(g, '#398241', ox + x + (tx % 2), oy, 2, 1);
  }
  if (bot) {
    px(g, '#9e7848', ox, oy + 15, TILE, 1);
    for (let x = 2; x < 15; x += 5) px(g, '#4ca152', ox + x, oy + 15, 2, 1);
  }
  if (lft) px(g, '#8c663b', ox, oy, 1, TILE);
  if (rgt) px(g, '#9e7848', ox + 15, oy, 1, TILE);
}

// Agua animada del estanque: profundidad bajo la orilla norte, brillos ondulantes y nenúfares en esquinas tranquilas.
export function drawWater(g, ox, oy, tx, ty, time = 0) {
  px(g, '#2e72c9', ox, oy, TILE, TILE);
  const upDry = ground[ty - 1]?.[tx] !== 'water';
  const downDry = ground[ty + 1]?.[tx] !== 'water';
  const leftDry = ground[ty]?.[tx - 1] !== 'water';
  const rightDry = ground[ty]?.[tx + 1] !== 'water';

  if (upDry) {
    px(g, '#183e7a', ox, oy, TILE, 2);
    px(g, '#21549e', ox, oy + 2, TILE, 2);
    px(g, '#7cc2f7', ox + 2, oy + 2, 4, 1);
    px(g, '#7cc2f7', ox + 10, oy + 2, 4, 1);
  }
  if (downDry) px(g, '#4e96e8', ox, oy + 15, TILE, 1);
  if (leftDry) px(g, '#1f4f94', ox, oy, 1, TILE);
  if (rightDry) px(g, '#1f4f94', ox + 15, oy, 1, TILE);

  // Destellos y olas horizontales
  for (let i = 0; i < 3; i++) {
    const speed = 460 + i * 160;
    const x = Math.floor(rnd(tx, ty, i + 3) * 12 + time / speed) % 15;
    const y = 5 + i * 4;
    const len = i === 1 ? 4 : 3;
    const col = i === 1 ? '#a8e0ff' : '#66aef2';
    px(g, col, ox + x, oy + y, Math.min(len, 16 - x), 1);
    if (x + len > 16) px(g, col, ox, oy + y, x + len - 16, 1);
  }

  // Nenúfar tranquilo en algunas casillas sin puente ni borde norte
  if (!upDry && !isBridgeTile(tx, ty) && rnd(tx, ty, 61) < 0.24) {
    const nx = 4 + Math.floor(rnd(tx, ty, 62) * 6);
    const ny = 5 + Math.floor(rnd(tx, ty, 63) * 5);
    const bob = Math.round(Math.sin(time / 700 + tx + ty) * 0.6);
    px(g, '#183e7a', ox + nx, oy + ny + 4 + bob, 5, 1);
    px(g, '#2a7d43', ox + nx, oy + ny + bob, 5, 4);
    px(g, '#52b862', ox + nx + 1, oy + ny + bob, 3, 2);
    px(g, '#2e72c9', ox + nx + 4, oy + ny + 1 + bob, 1, 1); // muesca del nenúfar
    if (rnd(tx, ty, 64) < 0.5) px(g, '#ff9eb5', ox + nx + 1, oy + ny + 1 + bob, 2, 1);
  }
}

// Árbol frondoso en capas con tronco texturizado y luz cálida desde arriba-izquierda.
function tree(g, ox, oy, tx, ty) {
  px(g, '#17382255', ox + 2, oy + 13, 12, 3);
  // Tronco con raíces y corteza
  px(g, '#241514', ox + 5, oy + 10, 6, 5);
  px(g, '#663c24', ox + 6, oy + 10, 4, 5);
  px(g, '#8c5838', ox + 6, oy + 11, 1, 3);
  px(g, '#241514', ox + 4, oy + 14, 1, 1);
  px(g, '#241514', ox + 11, oy + 14, 1, 1);

  // Copa de 3 lóbulos superpuestos con ligero desplazamiento determinista
  const jitter = rnd(tx, ty, 19) > 0.5 ? 0 : 1;
  const lobes = [
    [5, 7, 4.6],
    [10.5, 7.2, 4.5],
    [7.5 + (jitter ? 0.3 : -0.3), 4.6, 5.1],
  ];
  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 16; x++) {
      let best = 99;
      for (const [cx, cy, r] of lobes) {
        const d = Math.hypot(x - cx, y - cy) / r;
        if (d < best) best = d;
      }
      if (best > 1) continue;
      let col = '#266b3a';
      if (best > 0.84) col = '#11301d';
      else if (y >= 9) col = '#1a4f2b';
      else if (x < 9 && y < 6 && best < 0.72) col = (x + y) % 3 === 0 ? '#79cc68' : '#459e4c';
      else if ((x * 3 + y * 5 + tx) % 9 === 0 && y < 8) col = '#459e4c';
      px(g, col, ox + x, oy + y);
    }
  }
  // Pequeños frutos/flores en algún árbol suelto para romper la monotonía del bosque
  if (rnd(tx, ty, 41) < 0.22) {
    px(g, '#ffd866', ox + 5 + jitter, oy + 6);
    px(g, '#ffd866', ox + 10, oy + 8);
  }
}

// Emblemas de 2 colores sobre la puerta de cada edificio.
const ICONS = {
  heart: {
    '#': '#d93848', '+': '#ff8590',
    rows: ['.##.##.', '#+##+##', '#######', '.#####.', '..###..', '...#...'],
  },
  sword: {
    '#': '#364463', '+': '#8da3c7', 'g': '#9e6814',
    rows: ['.....+#', '....+#.', '...+#..', 'g.+#...', '.gg....', '.gg....', 'g..g...'],
  },
  book: {
    '#': '#246e50', '+': '#59b885', 'p': '#fff3d6',
    rows: ['###.###', '#p#.#p#', '#+#.#+#', '###.###', '###.###'],
  },
  hammer: {
    '#': '#3b4a66', '+': '#9ab0cc', 'w': '#734526',
    rows: ['+++++', '#####', '..w..', '..w..', '..w..', '..w..'],
  },
  mug: {
    '#': '#7d4a14', '+': '#d49022', 'f': '#ffffff',
    rows: ['ffff..', '#++#.#', '#++#.#', '####.#', '####..'],
  },
};

function building(g, b) {
  const x0 = b.x * TILE, y0 = b.y * TILE, w = b.w * TILE, h = b.h * TILE;
  const roofH = (b.h - 2) * TILE, wallY = y0 + roofH;
  const roofDark = shade(b.roof, -0.35);
  const roofDeep = shade(b.roof, -0.55);
  const roofLight = shade(b.roof, 0.25);

  // Sombra proyectada en el suelo bajo el edificio
  px(g, '#12182444', x0 + 1, y0 + h - 1, w, 2);

  // Muros de estuco cálido (taller más pétreo)
  const wallBase = b.id === 'taller' ? '#d4cec4' : '#f0e2c2';
  const wallMid = b.id === 'taller' ? '#b8b1a7' : '#dec99e';
  px(g, wallBase, x0, wallY, w, h - roofH);
  // Entramado vertical y textura sutil de fachada
  for (let x = x0 + 8; x < x0 + w - 4; x += 8) px(g, wallMid, x, wallY + 2, 1, h - roofH - 6);
  // Sombra del alero sobre el muro
  px(g, '#3a2b2266', x0, wallY, w, 2);
  // Zócalo de piedra con sillares alternos
  px(g, '#7e7d8c', x0, y0 + h - 5, w, 5);
  px(g, '#9f9eae', x0 + 1, y0 + h - 5, w - 2, 1);
  for (let x = x0 + 4; x < x0 + w - 2; x += 7) px(g, '#555466', x, y0 + h - 4, 1, 3);
  px(g, '#2e2524', x0, y0 + h - 1, w, 1);
  // Vigas esquineras de madera oscura
  px(g, '#4a3122', x0, wallY, 2, h - roofH - 1);
  px(g, '#6b472e', x0 + 1, wallY, 1, h - roofH - 5);
  px(g, '#4a3122', x0 + w - 2, wallY, 2, h - roofH - 1);
  px(g, '#261816', x0, wallY, 1, h - roofH);
  px(g, '#261816', x0 + w - 1, wallY, 1, h - roofH);

  // Hiedra decorativa en la esquina izquierda de la academia
  if (b.id === 'academia') {
    for (let i = 0; i < 6; i++) {
      px(g, i % 2 ? '#266b3a' : '#459e4c', x0 + 1 + (i % 2), wallY + 2 + i * 4, 3, 3);
    }
  }

  // Tejado con tejas imbricadas, cumbrera iluminada y alero remarcado
  px(g, '#1a1426', x0 - 1, y0 + 1, w + 2, roofH - 1);
  px(g, '#1a1426', x0, y0, w, 1);
  px(g, b.roof, x0, y0 + 1, w, roofH - 3);
  px(g, roofLight, x0 + 1, y0 + 1, w - 2, 2);
  // Filas de tejas con relieve y sombreado alterno
  for (let row = 0; row * 4 + 4 < roofH - 2; row++) {
    const ty = y0 + 4 + row * 4;
    px(g, roofDark, x0, ty, w, 1);
    const offset = row % 2 ? 3 : 6;
    for (let x = x0 + offset; x < x0 + w - 1; x += 6) {
      px(g, roofDeep, x, ty - 2, 1, 2);
      px(g, roofLight, x + 1, ty - 3, 2, 1);
    }
  }
  // Alero inferior con goterón oscuro
  px(g, roofDeep, x0 - 1, y0 + roofH - 3, w + 2, 1);
  px(g, '#1a1426', x0 - 1, y0 + roofH - 2, w + 2, 2);

  // Chimenea alineada con CHIMNEYS de effects.js (centro en x0 + w - 11, tope y0 - 5)
  if (b.chimney) {
    const cx = x0 + w - 14;
    px(g, '#24181a', cx - 1, y0 - 5, 8, 3);
    px(g, '#5c3429', cx, y0 - 4, 6, 1);
    px(g, '#24181a', cx - 1, y0 - 2, 8, 10);
    px(g, '#8f4b38', cx, y0 - 2, 6, 9);
    px(g, '#b56850', cx, y0 - 2, 2, 8);
    px(g, '#5c3429', cx, y0 + 1, 6, 1);
    px(g, '#5c3429', cx, y0 + 4, 6, 1);
    px(g, '#5c3429', cx + 3, y0 - 1, 1, 2);
    px(g, '#5c3429', cx + 2, y0 + 2, 1, 2);
  }

  // Ventanas (misma posición de cristal 10×8 que windowRects para drawWindowLights)
  const wy = wallY + 6;
  for (const wx of [x0 + 5, x0 + w - 17]) {
    if (Math.abs(wx + 6 - (b.door.x * TILE + 8)) < 14) continue;
    // Marco tallado + alféizar
    px(g, '#2e1d14', wx - 1, wy - 1, 14, 12);
    px(g, '#664026', wx, wy, 12, 10);
    // Cristal con cielo degradado y brillo diagonal
    px(g, '#70b7f0', wx + 1, wy + 1, 10, 8);
    px(g, '#a3d9ff', wx + 1, wy + 1, 10, 4);
    px(g, '#e8f7ff', wx + 2, wy + 2, 3, 2);
    px(g, '#e8f7ff', wx + 3, wy + 4, 1, 1);
    // Cruceta en +6 y +5 (coincide con r.x + 5 y r.y + 4 de drawWindowLights)
    px(g, '#4f301c', wx + 6, wy + 1, 1, 8);
    px(g, '#4f301c', wx + 1, wy + 5, 10, 1);
    // Alféizar saliente
    px(g, '#a89f96', wx - 1, wy + 10, 14, 2);
    px(g, '#4a4548', wx - 1, wy + 11, 14, 1);
    // Maceta de flores en la casa
    if (b.id === 'casa') {
      px(g, '#398241', wx + 2, wy + 8, 8, 2);
      px(g, '#ff7888', wx + 3, wy + 8, 2, 1);
      px(g, '#ffe066', wx + 7, wy + 8, 2, 1);
    }
  }

  // Puerta con dintel, tablones, picaporte dorado y umbral de piedra
  const dx = b.door.x * TILE, dy = b.door.y * TILE;
  px(g, '#241610', dx + 1, dy, 14, 16);
  px(g, '#52321e', dx + 2, dy + 1, 12, 15);
  px(g, '#8a542e', dx + 3, dy + 2, 10, 13);
  px(g, '#a86b3e', dx + 4, dy + 3, 3, 11);
  px(g, '#663c20', dx + 7, dy + 2, 1, 13);
  px(g, '#52321e', dx + 3, dy + 6, 10, 1);
  px(g, '#52321e', dx + 3, dy + 12, 10, 1);
  px(g, '#ffe066', dx + 10, dy + 8, 2, 2);
  px(g, '#c48b1c', dx + 10, dy + 10, 2, 1);
  // Escalón/umbral inferior
  px(g, '#aba6b0', dx + 2, dy + 15, 12, 1);

  // Farol cálido junto a la puerta de la posada
  if (b.id === 'posada') {
    px(g, '#261816', dx - 4, dy + 2, 4, 6);
    px(g, '#ffe066', dx - 3, dy + 3, 2, 4);
    px(g, '#ffffff', dx - 3, dy + 3, 1, 2);
  }

  // Emblema enmarcado sobre la puerta
  const icon = ICONS[b.icon];
  const ex = dx + 1, ey = dy - 12;
  px(g, '#241610', ex, ey, 14, 11);
  px(g, '#8a5a32', ex + 1, ey + 1, 12, 9);
  px(g, '#f7ebd0', ex + 2, ey + 2, 10, 7);
  // Remaches dorados en las esquinas del letrero del gremio
  if (b.id === 'gremio') {
    px(g, '#ffe066', ex + 1, ey + 1); px(g, '#ffe066', ex + 12, ey + 1);
    px(g, '#ffe066', ex + 1, ey + 9); px(g, '#ffe066', ex + 12, ey + 9);
  }
  const iw = icon.rows[0].length, ih = icon.rows.length;
  icon.rows.forEach((row, ry) => {
    for (let rx = 0; rx < iw; rx++) {
      const col = icon[row[rx]];
      if (col) px(g, col, ex + 7 - Math.ceil(iw / 2) + rx, ey + 5 - Math.floor(ih / 2) + ry);
    }
  });
}

// Cartel de madera con bisel, clavos y texto grabado.
function sign(g, ox, oy, s) {
  px(g, '#12182444', ox + 3, oy + 13, 10, 2);
  px(g, '#291a12', ox + 6, oy + 9, 4, 6);
  px(g, '#734526', ox + 7, oy + 9, 2, 5);
  px(g, '#291a12', ox + 1, oy + 1, 14, 9);
  px(g, '#d6a463', ox + 2, oy + 2, 12, 7);
  px(g, '#edd098', ox + 2, oy + 2, 12, 1);
  px(g, '#a87640', ox + 2, oy + 8, 12, 1);
  // Líneas de texto y clavos
  px(g, '#52321e', ox + 4, oy + 4, 8, 1);
  px(g, '#52321e', ox + 4, oy + 6, 6, 1);
  if (s?.cave) px(g, '#d93848', ox + 11, oy + 6, 1, 1);
  if (s?.welcome) px(g, '#ffe066', ox + 7, oy + 1, 2, 1);
}

// Orilla arenosa y borde húmedo alrededor de la isla central del estanque.
function shore(g, ox, oy, tx, ty) {
  const wet = (x, y) => ground[y]?.[x] === 'water';
  if (wet(tx, ty - 1)) {
    px(g, '#183e7a', ox, oy, TILE, 1);
    px(g, '#e4cb99', ox, oy + 1, TILE, 2);
    px(g, '#c7a46b', ox, oy + 3, TILE, 1);
  }
  if (wet(tx, ty + 1)) {
    px(g, '#e4cb99', ox, oy + 12, TILE, 2);
    px(g, '#b8925a', ox, oy + 14, TILE, 1);
    px(g, '#7cc2f7', ox, oy + 15, TILE, 1);
  }
  if (wet(tx - 1, ty)) {
    px(g, '#c7a46b', ox, oy, 1, TILE);
    px(g, '#e4cb99', ox + 1, oy, 2, TILE);
  }
  if (wet(tx + 1, ty)) {
    px(g, '#e4cb99', ox + 13, oy, 2, TILE);
    px(g, '#c7a46b', ox + 15, oy, 1, TILE);
  }
}

// Puente de tablones con pilotes y barandilla lateral que se tiende progresivamente.
export function drawBridge(g, progress, camX, camY) {
  BRIDGE.forEach(([x, y], i) => {
    const planks = Math.max(0, Math.min(5, Math.floor((progress - i) * 5)));
    if (!planks) return;
    const ox = x * TILE - camX, oy = y * TILE - camY;
    const span = planks * 3 + 1;
    // Sombra sobre el agua
    px(g, '#12294d88', ox + 1, oy + span, 14, 2);
    // Barandillas / largueros
    px(g, '#291a12', ox + 1, oy, 2, span);
    px(g, '#291a12', ox + 13, oy, 2, span);
    px(g, '#754829', ox + 1, oy, 1, span);
    px(g, '#754829', ox + 14, oy, 1, span);
    // Tablones alternos con clavos
    for (let p = 0; p < planks; p++) {
      const py = oy + p * 3 + 1;
      px(g, '#291a12', ox + 2, py, 12, 3);
      px(g, p % 2 ? '#b37d44' : '#c99357', ox + 3, py, 10, 2);
      px(g, '#e0b377', ox + 3, py, 10, 1);
      px(g, '#4a2e1a', ox + 4, py + 1);
      px(g, '#4a2e1a', ox + 11, py + 1);
    }
    // Postes en los extremos
    px(g, '#4a2e1a', ox + 1, oy, 2, 2);
    px(g, '#4a2e1a', ox + 13, oy, 2, 2);
  });
}

// Palanca oculta: pedestal de piedra biselado, brazo articulado y pomo rojo brillante.
export function drawLever(g, ox, oy, on) {
  px(g, '#12182444', ox + 2, oy + 13, 12, 2);
  px(g, '#242233', ox + 2, oy + 9, 12, 5);
  px(g, '#72758a', ox + 3, oy + 10, 10, 3);
  px(g, '#9fa3b8', ox + 3, oy + 10, 10, 1);
  px(g, '#1a1826', ox + 5, oy + 11, 6, 1);
  // Indicador luminoso en la base cuando ya se accionó
  px(g, on ? '#7cf296' : '#d93848', ox + 7, oy + 12, 2, 1);

  const dir = on ? 1 : -1;
  for (let i = 0; i < 6; i++) {
    const sx = ox + 7 + Math.round(dir * i * 0.65);
    const sy = oy + 9 - i;
    px(g, '#241610', sx - 1, sy, 4, 1);
    px(g, '#9e6b40', sx, sy, 2, 1);
  }
  const kx = ox + 5 + Math.round(dir * 4);
  px(g, '#241610', kx, oy + 1, 6, 4);
  px(g, '#e04248', kx + 1, oy + 2, 4, 2);
  px(g, '#ff9aa0', kx + 1, oy + 2, 2, 1);
}

// Capa estática prerenderizada del mapa completo.
export function drawMap() {
  const c = document.createElement('canvas');
  c.width = W * TILE;
  c.height = H * TILE;
  const g = c.getContext('2d');
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const ox = x * TILE, oy = y * TILE, t = ground[y][x];
      if (t === 'water') drawWater(g, ox, oy, x, y, 0);
      else if (t === 'path') path(g, ox, oy, x, y);
      else grass(g, ox, oy, x, y);
      if (t === 'tree') tree(g, ox, oy, x, y);
      if (t === 'island') shore(g, ox, oy, x, y);
    }
  }
  BUILDINGS.forEach((b) => building(g, b));
  SIGNS.forEach((s) => sign(g, s.x * TILE, s.y * TILE, s));
  drawCave(g, CAVE.x * TILE, CAVE.y * TILE);
  return c;
}

// Cofre del tesoro: madera caoba con herrajes dorados y tapa abatida al abrirse.
export function drawChest(g, ox, oy, open) {
  px(g, '#12182444', ox + 1, oy + 13, 14, 2);
  if (open) {
    // Tapa abierta detrás
    px(g, '#241610', ox + 2, oy + 1, 12, 6);
    px(g, '#8c4e24', ox + 3, oy + 2, 10, 3);
    px(g, '#ffe066', ox + 3, oy + 2, 10, 1);
    px(g, '#161124', ox + 3, oy + 5, 10, 2);
    // Cuerpo inferior con destello interior dorado
    px(g, '#241610', ox + 2, oy + 6, 12, 9);
    px(g, '#a8602c', ox + 3, oy + 7, 10, 7);
    px(g, '#ffe066', ox + 4, oy + 7, 8, 1);
    px(g, '#c98b1e', ox + 3, oy + 10, 10, 1);
    px(g, '#ffe066', ox + 3, oy + 7, 1, 7);
    px(g, '#ffe066', ox + 12, oy + 7, 1, 7);
  } else {
    px(g, '#241610', ox + 2, oy + 4, 12, 11);
    px(g, '#b86d35', ox + 3, oy + 5, 10, 4);
    px(g, '#d98f4e', ox + 4, oy + 5, 8, 1);
    px(g, '#8c4e24', ox + 3, oy + 9, 10, 5);
    // Bandas doradas y cerradura
    px(g, '#ffe066', ox + 3, oy + 5, 1, 9);
    px(g, '#ffe066', ox + 12, oy + 5, 1, 9);
    px(g, '#c98b1e', ox + 3, oy + 8, 10, 2);
    px(g, '#241610', ox + 6, oy + 7, 4, 4);
    px(g, '#ffe066', ox + 7, oy + 8, 2, 2);
    px(g, '#fff7cc', ox + 7, oy + 8, 1, 1);
  }
}

// Arbusto interactivo con lóbulos frondosos y bayas rojas brillantes.
export function drawBush(g, ox, oy, shake = 0) {
  px(g, '#12182444', ox + 2, oy + 13, 12, 2);
  const lobes = [
    [4.5, 5.5, 4.1],
    [11, 5.5, 4.1],
    [7.8, 3.6, 4.4],
  ];
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 16; x++) {
      let best = 99;
      for (const [cx, cy, r] of lobes) {
        const d = Math.hypot(x - cx, y - cy) / r;
        if (d < best) best = d;
      }
      if (best > 1) continue;
      let col = '#2a7a3e';
      if (best > 0.8) col = '#12331f';
      else if (y >= 7) col = '#1d592e';
      else if (y < 4 && best < 0.72) col = '#67bf62';
      else if ((x + y) % 4 === 0 && y < 6) col = '#47a14e';
      px(g, col, ox + x + shake, oy + 5 + y);
    }
  }
  // Bayas con puntito de brillo
  for (const [bx, by] of [[4, 9], [8, 7], [11, 10]]) {
    px(g, '#e03e4a', ox + bx + shake, oy + by, 2, 2);
    px(g, '#ffc2c7', ox + bx + shake, oy + by, 1, 1);
  }
}

// Cristal de cada ventana (misma geometría que building) para el encendido nocturno.
export function windowRects(b) {
  const x0 = b.x * TILE, w = b.w * TILE;
  const wy = b.y * TILE + (b.h - 2) * TILE + 6;
  return [x0 + 5, x0 + w - 17]
    .filter((wx) => Math.abs(wx + 6 - (b.door.x * TILE + 8)) >= 14)
    .map((wx) => ({ x: wx + 1, y: wy + 1, w: 10, h: 8 }));
}

// Entrada de la cueva de los bugs: roca escarpada con musgo, estalactitas y ojos en la penumbra.
export function drawCave(g, ox, oy) {
  px(g, '#4ca152', ox, oy, TILE, TILE);
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const d = Math.hypot((x - 7.5) / 1.05, y - 15);
      if (d < 15.2) {
        let col = '#696c82';
        if (d > 13.8) col = '#2b2b3b';
        else if (y < 5 && (x + y) % 3 !== 0) col = '#3c7a45'; // musgo superior
        else if (x < 7 && y < 11 && (x + y) % 4 === 0) col = '#9a9eb5'; // faceta iluminada
        else if (x > 10 && y > 6) col = '#4c4e63';
        px(g, col, ox + x, oy + y);
      }
    }
  }
  // Boca oscura con marco pétreo y estalactitas
  for (let y = 4; y < 16; y++) {
    for (let x = 3; x < 13; x++) {
      const d = Math.hypot(x - 7.5, y - 15);
      if (d < 9.6) px(g, d > 8.4 ? '#221c38' : y < 8 ? '#151026' : '#090714', ox + x, oy + y);
    }
  }
  // Pequeñas estalactitas arriba
  px(g, '#4c4e63', ox + 5, oy + 6, 1, 2);
  px(g, '#4c4e63', ox + 10, oy + 6, 1, 2);
  // Ojos dorados acechando en el interior
  px(g, '#ffe066', ox + 5, oy + 10, 2, 1);
  px(g, '#ffe066', ox + 9, oy + 10, 2, 1);
  px(g, '#ffffff', ox + 5, oy + 10, 1, 1);
  px(g, '#ffffff', ox + 9, oy + 10, 1, 1);
}
