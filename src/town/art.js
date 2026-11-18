// Pixel art del pueblo, dibujado por código (sin imágenes externas).
import { TILE, W, H, BUILDINGS, ground, SIGN } from './map.js';

const rnd = (x, y, k) => (((x * 73856093) ^ (y * 19349663) ^ (k * 83492791)) >>> 0) % 1000 / 1000;

const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(x, y, w, h); };

function grass(g, ox, oy, tx, ty) {
  px(g, '#3f9b4b', ox, oy, TILE, TILE);
  for (let i = 0; i < 14; i++) {
    const x = Math.floor(rnd(tx, ty, i) * 15), y = Math.floor(rnd(tx, ty, i + 50) * 15);
    px(g, i % 3 ? '#358a40' : '#57b45e', ox + x, oy + y, 1, 2);
  }
  if (rnd(tx, ty, 99) < 0.1) {
    const fx = 3 + Math.floor(rnd(tx, ty, 7) * 9), fy = 3 + Math.floor(rnd(tx, ty, 8) * 9);
    const c = ['#ffd866', '#ff8a8a', '#ffffff'][Math.floor(rnd(tx, ty, 9) * 3)];
    px(g, c, ox + fx, oy + fy - 1); px(g, c, ox + fx - 1, oy + fy); px(g, c, ox + fx + 1, oy + fy); px(g, c, ox + fx, oy + fy + 1);
    px(g, '#f0a722', ox + fx, oy + fy);
  }
}

function path(g, ox, oy, tx, ty) {
  px(g, '#cfa96c', ox, oy, TILE, TILE);
  for (let i = 0; i < 10; i++) {
    const x = Math.floor(rnd(tx, ty, i) * 15), y = Math.floor(rnd(tx, ty, i + 20) * 15);
    px(g, i % 2 ? '#b8915a' : '#e0c08a', ox + x, oy + y, 2, 1);
  }
}

// Agua: con time > 0 las olas se desplazan (se redibuja en cada fotograma).
export function drawWater(g, ox, oy, tx, ty, time = 0) {
  px(g, '#2f6fd6', ox, oy, TILE, TILE);
  if (ground[ty - 1]?.[tx] !== 'water') px(g, '#1d4a9e', ox, oy, TILE, 3);
  for (let i = 0; i < 3; i++) {
    const x = Math.floor(rnd(tx, ty, i) * 10 + time / (500 + i * 170)) % 14, y = 5 + i * 4;
    px(g, '#6aa4ff', ox + x, oy + y, Math.min(5, 16 - x), 1);
    if (x > 11) px(g, '#6aa4ff', ox, oy + y, x - 11, 1);
  }
}

function tree(g, ox, oy) {
  px(g, '#00000033', ox + 3, oy + 13, 10, 2);
  px(g, '#6b4226', ox + 6, oy + 10, 4, 5);
  for (let y = 0; y < 12; y++) for (let x = 0; x < 16; x++) {
    const d = Math.hypot(x - 7.5, y - 6);
    if (d < 7) px(g, d > 5.8 ? '#123d1f' : (x + y) % 5 === 0 || (x < 7 && y < 6) ? '#2f8a44' : '#1f6b33', ox + x, oy + y);
  }
}

const ICONS = {
  heart: ['#e04848', ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...']],
  sword: ['#5d6b85', ['......#', '.....#.', '....#..', '#..#...', '.##....', '.##....', '#..#...']],
  book: ['#2e7d5b', ['###.###', '#.#.#.#', '###.###', '###.###', '###.###']],
  hammer: ['#5d6b85', ['#####', '#####', '..#..', '..#..', '..#..', '..#..']],
  mug: ['#c98a12', ['####..', '####.#', '####.#', '#####.', '####..']],
};

function building(g, b) {
  const x0 = b.x * TILE, y0 = b.y * TILE, w = b.w * TILE, h = b.h * TILE;
  const roofH = (b.h - 2) * TILE, wallY = y0 + roofH;
  // Muros
  px(g, '#e9d9b6', x0, wallY, w, h - roofH);
  for (let x = x0 + 7; x < x0 + w; x += 8) px(g, '#d4c096', x, wallY, 1, h - roofH);
  px(g, '#9a8f86', x0, y0 + h - 3, w, 3);
  px(g, '#4a3a2a', x0, wallY, 1, h - roofH); px(g, '#4a3a2a', x0 + w - 1, wallY, 1, h - roofH);
  // Tejado
  px(g, b.roof, x0 - 1, y0, w + 2, roofH);
  for (let y = y0 + 4; y < y0 + roofH; y += 4) {
    px(g, '#00000040', x0 - 1, y, w + 2, 1);
    for (let x = x0 + ((y / 4) % 2 ? 3 : 7); x < x0 + w; x += 8) px(g, '#00000030', x, y - 3, 1, 3);
  }
  px(g, '#ffffff30', x0 - 1, y0, w + 2, 2);
  px(g, '#1a1230', x0 - 1, y0 + roofH - 2, w + 2, 2);
  if (b.chimney) {
    const cx = x0 + w - 14;
    px(g, '#4a2a20', cx - 1, y0 - 5, 8, 3);
    px(g, '#8a4a36', cx, y0 - 2, 6, 9);
    px(g, '#6e382a', cx, y0 + 2, 6, 1);
  }
  // Ventanas
  const wy = wallY + 6;
  for (const wx of [x0 + 5, x0 + w - 17]) {
    if (Math.abs(wx + 6 - (b.door.x * TILE + 8)) < 14) continue;
    px(g, '#5a3a22', wx, wy, 12, 10);
    px(g, '#9fd3ff', wx + 1, wy + 1, 10, 8);
    px(g, '#d8efff', wx + 2, wy + 2, 3, 2);
    px(g, '#5a3a22', wx + 6, wy + 1, 1, 8); px(g, '#5a3a22', wx + 1, wy + 5, 10, 1);
  }
  // Puerta
  const dx = b.door.x * TILE, dy = b.door.y * TILE;
  px(g, '#3b2414', dx + 2, dy + 1, 12, 15);
  px(g, '#7a4a28', dx + 3, dy + 2, 10, 14);
  px(g, '#6b4226', dx + 7, dy + 2, 2, 14);
  px(g, '#ffd866', dx + 10, dy + 9, 2, 2);
  // Emblema sobre la puerta
  const [color, rows] = ICONS[b.icon];
  const ex = dx + 1, ey = dy - 12;
  px(g, '#3b2414', ex, ey, 14, 11);
  px(g, '#f4e6c3', ex + 1, ey + 1, 12, 9);
  const iw = rows[0].length, ih = rows.length;
  rows.forEach((row, y) => [...row].forEach((c, x) => c === '#' && px(g, color, ex + 7 - Math.ceil(iw / 2) + x, ey + 5 - Math.floor(ih / 2) + y)));
}

function sign(g, ox, oy) {
  px(g, '#00000033', ox + 3, oy + 13, 10, 2);
  px(g, '#6b4226', ox + 7, oy + 8, 2, 7);
  px(g, '#3b2414', ox + 1, oy + 1, 14, 9);
  px(g, '#c99a5b', ox + 2, oy + 2, 12, 7);
  for (const y of [4, 6]) px(g, '#6b4226', ox + 4, oy + y, 8, 1);
}

// Capa estática con todo el mapa.
export function drawMap() {
  const c = document.createElement('canvas');
  c.width = W * TILE; c.height = H * TILE;
  const g = c.getContext('2d');
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const ox = x * TILE, oy = y * TILE, t = ground[y][x];
    if (t === 'water') drawWater(g, ox, oy, x, y);
    else if (t === 'path') path(g, ox, oy, x, y);
    else grass(g, ox, oy, x, y);
    if (t === 'tree') tree(g, ox, oy);
  }
  BUILDINGS.forEach((b) => building(g, b));
  sign(g, SIGN.x * TILE, SIGN.y * TILE);
  return c;
}

export function drawChest(g, ox, oy, open) {
  px(g, '#00000033', ox + 2, oy + 13, 12, 2);
  px(g, '#3b2414', ox + 2, oy + 5, 12, 10);
  px(g, '#a0612e', ox + 3, oy + 6, 10, 8);
  px(g, '#ffd866', ox + 3, oy + 9, 10, 1);
  if (open) {
    px(g, '#3b2414', ox + 2, oy + 1, 12, 5);
    px(g, '#1a1230', ox + 3, oy + 4, 10, 2);
    px(g, '#7a4a28', ox + 3, oy + 2, 10, 2);
  } else {
    px(g, '#ffd866', ox + 7, oy + 8, 2, 3);
  }
}

// ---- Personajes: 16×16, abajo / arriba / lado (la derecha es el lado en espejo) ----
const HEAD_DOWN = ['................', '.....kkkkkk.....', '....khhhhhhk....', '...khhhhhhhhk...', '...khhhhhhhhk...', '...khhsssshhk...', '...ksessssesk...', '...kssssssssk...', '....kssssssk....'];
const HEAD_UP = ['................', '.....kkkkkk.....', '....khhhhhhk....', '...khhhhhhhhk...', '...khhhhhhhhk...', '...khhhhhhhhk...', '...khhhhhhhhk...', '...khhhhhhhhk...', '....khhhhhhk....'];
const BODY_FRONT = ['...kttttttttk...', '..ksttttttttsk..', '..ksTbbbbbbTsk..', '...kTttttttTk...', '...kppppppppk...'];
const LEGS_FRONT = [
  ['...kpppkkpppk...', '...kooo..oook...'],
  ['...kpppkkppk....', '..koook.kook....'],
  ['....kppkkpppk...', '....kook.koook..'],
];
const HEAD_SIDE = ['................', '.....kkkkkk.....', '....khhhhhhk....', '...khhhhhhhhk...', '...khhhhhhhhk...', '...kshhhhhhhk...', '...kesshhhhhk...', '...ksssshhhk....', '....kssssk......'];
const BODY_SIDE = ['....kttttttk....', '....ktsstttk....', '....kbbbbbbk....', '....kttttttk....', '....kppppppk....'];
const LEGS_SIDE = [
  ['....kppkppk.....', '....kookook.....'],
  ['...kppk..kppk...', '..kook....kook..'],
  ['....kpppppk.....', '....koooook.....'],
];

export const HERO = { k: '#1a1230', h: '#5a3a22', s: '#f2c49b', e: '#1a1230', t: '#3a5bd9', T: '#2a3f9e', b: '#ffd866', p: '#3b3350', o: '#6b4226' };
// El jugador es el visitante; Ángel es el NPC que lo recibe.
export const VISITOR = { ...HERO, h: '#e0b040', t: '#3a9b5b', T: '#2a6e40', b: '#c98a12', p: '#4a4a5e' };

function spriteCanvas(rows, pal, flip) {
  const c = document.createElement('canvas'); c.width = 16; c.height = 16;
  const g = c.getContext('2d');
  rows.forEach((row, y) => [...row.padEnd(16, '.').slice(0, 16)].forEach((ch, x) => {
    if (ch !== '.') px(g, pal[ch], flip ? 15 - x : x, y);
  }));
  return c;
}

// sprites[dir][frame]: frame 0 quieto, 1 y 2 pasos.
export function buildSprites(pal) {
  const out = {};
  for (const dir of ['down', 'up', 'left', 'right']) {
    const side = dir === 'left' || dir === 'right';
    const head = side ? HEAD_SIDE : dir === 'up' ? HEAD_UP : HEAD_DOWN;
    const body = side ? BODY_SIDE : BODY_FRONT;
    const legs = side ? LEGS_SIDE : LEGS_FRONT;
    out[dir] = legs.map((l) => spriteCanvas([...head, ...body, ...l].slice(0, 16), pal, dir === 'right'));
  }
  return out;
}
