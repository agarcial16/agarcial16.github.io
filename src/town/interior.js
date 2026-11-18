// Interiores de los edificios: una sala por edificio, dibujada con primitivas pixel art.
import { HERO } from './art.js';

const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };

// Personaje que recibe en cada edificio (la casa no tiene: allí duerme un gato).
export const HOSTS = {
  gremio: { ...HERO, h: '#c0413b', t: '#3446c2', T: '#22318f', b: '#ffd866', p: '#2a2a40' },
  academia: { ...HERO, h: '#e8e8f0', t: '#2e7d5b', T: '#1f5a40', b: '#ffd866', p: '#1f5a40' },
  taller: { ...HERO, h: '#3b2414', s: '#c98a5a', t: '#7a4a2a', T: '#5a3a1a', b: '#3b3350', p: '#3b3350' },
  posada: { ...HERO, h: '#e0b040', t: '#7d3fa8', T: '#5e2a7d', b: '#ffffff', p: '#4a3a5a' },
};

const WALLS = {
  casa: ['#e9d9b6', '#d4c096'], gremio: ['#c9b48a', '#b39c6e'], academia: ['#b9c6a8', '#9fae8c'],
  taller: ['#8d8d9c', '#6d6d7c'], posada: ['#c99a6b', '#a77b4f'],
};

// Devuelve dónde están el anfitrión y el visitante. drawSprites se llama entre el
// decorado de fondo y el mobiliario en primer plano: así la barra tapa las piernas
// del anfitrión, que queda detrás como un camarero tras su mostrador.
export function drawInterior(g, id, W, H, time, drawSprites) {
  const cols = Math.min(11, Math.floor(W / 16)), rows = Math.min(8, Math.floor(H / 16));
  const rw = cols * 16, rh = rows * 16;
  const ox = Math.floor((W - rw) / 2), oy = Math.floor((H - rh) / 2);
  const [wall, wallDark] = WALLS[id];
  px(g, '#05060d', 0, 0, W, H);
  // Pared del fondo (3 casillas) con zócalo.
  px(g, wall, ox, oy, rw, 48);
  for (let x = ox + 7; x < ox + rw; x += 16) px(g, wallDark, x, oy, 1, 46);
  px(g, '#4a3a2a', ox, oy + 44, rw, 4);
  // Suelo de tablones.
  for (let y = oy + 48; y < oy + rh; y += 6) {
    px(g, (y / 6) % 2 ? '#a0703e' : '#b07e48', ox, y, rw, 6);
    for (let x = ox + ((y / 6) % 2 ? 0 : 11); x < ox + rw; x += 22) px(g, '#7a4a28', x, y, 1, 6);
  }
  // Puerta abierta abajo, por donde entra el visitante.
  const cx = ox + Math.floor(rw / 2);
  px(g, '#1a1230', cx - 8, oy + rh - 4, 16, 4);
  // Marco de la sala.
  px(g, '#2a1a10', ox - 3, oy - 3, rw + 6, 3); px(g, '#2a1a10', ox - 3, oy + rh, rw + 6, 3);
  px(g, '#2a1a10', ox - 3, oy, 3, rh); px(g, '#2a1a10', ox + rw, oy, 3, rh);

  const flicker = Math.floor(time / 120) % 3;
  const room = { ox, oy, rw, rh, cx };
  const pos = { host: { x: cx - 8, y: oy + 52 }, visitor: { x: cx - 8, y: oy + rh - 20 } };
  DECOR[id](g, room, flicker, time);
  drawSprites?.(pos);
  FOREGROUND[id]?.(g, room, flicker);
  return pos;
}

const window_ = (g, x, y) => {
  px(g, '#5a3a22', x, y, 18, 16); px(g, '#9fd3ff', x + 2, y + 2, 14, 12);
  px(g, '#d8efff', x + 3, y + 3, 4, 3); px(g, '#5a3a22', x + 8, y + 2, 1, 12); px(g, '#5a3a22', x + 2, y + 7, 14, 1);
};
const counter = (g, x, y, w, top = '#8a5a2b', front = '#6b4226') => {
  px(g, '#2a1a10', x - 1, y - 1, w + 2, 15); px(g, top, x, y, w, 4); px(g, front, x, y + 4, w, 9);
  for (let i = x + 6; i < x + w; i += 12) px(g, '#4a2a18', i, y + 5, 1, 7);
};

const DECOR = {
  casa(g, { ox, oy, rw, cx }) {
    window_(g, ox + 10, oy + 12); window_(g, ox + rw - 28, oy + 12);
    // Cama con gato dormido.
    px(g, '#5a3a22', ox + 8, oy + 52, 26, 30); px(g, '#ffffff', ox + 10, oy + 54, 22, 8);
    px(g, '#c0413b', ox + 10, oy + 62, 22, 18); px(g, '#e04848', ox + 10, oy + 62, 22, 2);
    px(g, '#3b3350', ox + 14, oy + 66, 10, 5); px(g, '#3b3350', ox + 22, oy + 64, 4, 4);
    px(g, '#3b3350', ox + 22, oy + 63, 1, 1); px(g, '#3b3350', ox + 25, oy + 63, 1, 1); px(g, '#3b3350', ox + 11, oy + 69, 5, 2);
    // Mesa con la ficha de personaje y una taza.
    px(g, '#2a1a10', cx - 15, oy + 55, 30, 12); px(g, '#8a5a2b', cx - 14, oy + 56, 28, 4); px(g, '#6b4226', cx - 14, oy + 60, 28, 6);
    px(g, '#f4e6c3', cx - 8, oy + 53, 10, 6); px(g, '#6b4226', cx - 6, oy + 55, 6, 1); px(g, '#6b4226', cx - 6, oy + 57, 4, 1);
    px(g, '#ffffff', cx + 5, oy + 52, 5, 5); px(g, '#6b4226', cx + 6, oy + 53, 3, 2);
    // Planta.
    px(g, '#8a4a36', ox + rw - 18, oy + 62, 10, 10); px(g, '#2f8a44', ox + rw - 20, oy + 52, 14, 10); px(g, '#57b45e', ox + rw - 16, oy + 54, 4, 3);
    // Alfombra.
    px(g, '#7d3fa8', cx - 20, oy + 84, 40, 14); px(g, '#ffd866', cx - 18, oy + 86, 36, 1); px(g, '#ffd866', cx - 18, oy + 95, 36, 1);
  },
  gremio(g, { ox, oy, rw, cx }) {
    // Tablón de misiones con papeles.
    px(g, '#5a3a22', cx - 26, oy + 8, 52, 30); px(g, '#c99a5b', cx - 24, oy + 10, 48, 26);
    [[-21, 13], [-9, 15], [3, 12], [14, 16], [-16, 24], [8, 25]].forEach(([dx, dy], i) => {
      px(g, i % 3 ? '#f4e6c3' : '#ffffff', cx + dx, oy + dy, 9, 8); px(g, '#e04848', cx + dx + 4, oy + dy, 1, 1);
      px(g, '#6b4226', cx + dx + 2, oy + dy + 3, 5, 1);
    });
    // Estandartes.
    for (const x of [ox + 8, ox + rw - 18]) { px(g, '#3446c2', x, oy + 6, 10, 24); px(g, '#ffd866', x + 3, oy + 14, 4, 4); px(g, '#3446c2', x + 2, oy + 30, 6, 3); }
  },
  academia(g, { ox, oy, rw, cx }) {
    // Estanterías con lomos de colores.
    const books = ['#c0413b', '#3446c2', '#2e7d5b', '#c98a12', '#7d3fa8', '#e9d9b6'];
    for (const x of [ox + 6, ox + rw - 46]) {
      px(g, '#4a2a18', x, oy + 4, 40, 44);
      for (let s = 0; s < 3; s++) {
        px(g, '#2a1a10', x + 2, oy + 6 + s * 14, 36, 12);
        for (let i = 0; i < 8; i++) px(g, books[(i + s * 3 + x) % books.length], x + 3 + i * 4, oy + 8 + s * 14 + (i % 3), 3, 10 - (i % 3));
      }
    }
    // Pizarra.
    px(g, '#5a3a22', cx - 18, oy + 8, 36, 24); px(g, '#2b4a3a', cx - 16, oy + 10, 32, 20);
    px(g, '#e8e8f0', cx - 12, oy + 14, 14, 1); px(g, '#e8e8f0', cx - 12, oy + 18, 20, 1); px(g, '#e8e8f0', cx - 12, oy + 22, 10, 1);
  },
  taller(g, { ox, oy, rw, cx }, flicker) {
    // Fragua con fuego.
    px(g, '#3a3a48', ox + 6, oy + 18, 34, 44); px(g, '#1a1a22', ox + 12, oy + 34, 22, 20);
    const fire = ['#ffd866', '#f0a722', '#e04848'];
    for (let i = 0; i < 5; i++) px(g, fire[(i + flicker) % 3], ox + 14 + i * 4, oy + 44 - ((i + flicker) % 3) * 3, 3, 10 + ((i + flicker) % 3) * 3);
    // Herramientas colgadas.
    px(g, '#6b4226', cx - 30, oy + 10, 60, 3);
    [[-24, 'hammer'], [-6, 'wrench'], [12, 'hammer']].forEach(([dx, kind]) => {
      px(g, '#6b4226', cx + dx + 3, oy + 13, 2, 14);
      if (kind === 'hammer') px(g, '#8d8d9c', cx + dx, oy + 13, 8, 5);
      else { px(g, '#8d8d9c', cx + dx + 1, oy + 25, 6, 4); px(g, '#8d8d9c', cx + dx + 2, oy + 12, 4, 3); }
    });
    // Yunque.
    px(g, '#2a2a33', cx + 14, oy + 70, 26, 6); px(g, '#3b3b48', cx + 18, oy + 76, 18, 4); px(g, '#2a2a33', cx + 22, oy + 80, 10, 8);
    // Barril con espadas.
    px(g, '#7a4a28', ox + rw - 20, oy + 56, 14, 18); px(g, '#3b2414', ox + rw - 20, oy + 60, 14, 2);
    px(g, '#c6c7d6', ox + rw - 17, oy + 44, 2, 12); px(g, '#c6c7d6', ox + rw - 11, oy + 46, 2, 10);
  },
  posada(g, { ox, oy, rw, cx }, flicker) {
    // Chimenea.
    px(g, '#6d6d7c', ox + 6, oy + 10, 30, 38); px(g, '#1a1230', ox + 12, oy + 26, 18, 20);
    const fire = ['#ffd866', '#f0a722', '#e04848'];
    for (let i = 0; i < 4; i++) px(g, fire[(i + flicker) % 3], ox + 14 + i * 4, oy + 38 - ((i + flicker) % 3) * 2, 3, 8 + ((i + flicker) % 3) * 2);
    // Estante con jarras.
    px(g, '#6b4226', cx - 20, oy + 22, 40, 3);
    for (let i = 0; i < 4; i++) { px(g, '#c98a12', cx - 16 + i * 9, oy + 14, 6, 8); px(g, '#ffffff', cx - 16 + i * 9, oy + 14, 6, 2); }
    // Barriles.
    for (const [x, y] of [[ox + rw - 22, oy + 30], [ox + rw - 22, oy + 50]]) { px(g, '#7a4a28', x, y, 16, 18); px(g, '#3b2414', x, y + 4, 16, 2); px(g, '#3b2414', x, y + 12, 16, 2); }
  },
};

// Mobiliario del primer plano: se dibuja después de los personajes para que la barra
// tape sus piernas y el anfitrión quede detrás, tras su mostrador.
const FOREGROUND = {
  gremio(g, { cx, oy }) {
    counter(g, cx - 34, oy + 66, 68);
    px(g, '#ffd866', cx + 18, oy + 62, 6, 4); // campanilla
  },
  academia(g, { cx, oy }) {
    counter(g, cx - 26, oy + 66, 52, '#5a3a22', '#4a2a18');
  },
  posada(g, { cx, oy }) {
    counter(g, cx - 30, oy + 66, 60);
    px(g, '#c98a12', cx - 20, oy + 61, 6, 6); px(g, '#ffffff', cx - 20, oy + 61, 6, 2);
  },
};
