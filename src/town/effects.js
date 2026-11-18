// Animaciones de ambiente del pueblo. Todas reciben el tiempo en ms y la posición de la cámara.
import { TILE, W, H, BUILDINGS, ground, CHEST } from './map.js';
import { drawWater } from './art.js';

const WATER = [];
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ground[y][x] === 'water') WATER.push([x, y]);

const CHIMNEYS = BUILDINGS.filter((b) => b.chimney).map((b) => ({ x: (b.x + b.w) * TILE - 11, y: b.y * TILE - 6 }));

const BUTTERFLIES = [
  { cx: 6.5 * TILE, cy: 7 * TILE, rx: 34, ry: 12, a: 1700, b: 1100, color: '#ffffff' },
  { cx: 20.5 * TILE, cy: 9.5 * TILE, rx: 40, ry: 10, a: 2100, b: 1300, color: '#ffd866' },
  { cx: 12 * TILE, cy: 16.4 * TILE, rx: 60, ry: 6, a: 2600, b: 900, color: '#ff8a8a' },
];

const rect = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };

export function drawAmbient(g, time, camX, camY) {
  for (const [x, y] of WATER) drawWater(g, x * TILE - camX, y * TILE - camY, x, y, time);
  // Humo de chimenea: tres bocanadas que suben, crecen y se desvanecen.
  for (const c of CHIMNEYS) {
    for (let i = 0; i < 3; i++) {
      const p = (time / 2200 + i / 3) % 1;
      const size = 2 + Math.floor(p * 3);
      const sx = c.x + Math.sin(p * 5 + i) * 3 * p;
      const sy = c.y - p * 20;
      rect(g, `rgba(232, 232, 244, ${(0.75 * (1 - p)).toFixed(2)})`, sx - camX - size / 2, sy - camY - size / 2, size, size);
    }
  }
}

export function drawButterflies(g, time, camX, camY) {
  const open = Math.floor(time / 120) % 2;
  for (const f of BUTTERFLIES) {
    const x = f.cx + Math.sin(time / f.a * Math.PI * 2) * f.rx - camX;
    const y = f.cy + Math.sin(time / f.b * Math.PI * 2) * f.ry - camY;
    rect(g, '#1a1230', x, y, 1, 2);
    if (open) { rect(g, f.color, x - 2, y - 1, 2, 2); rect(g, f.color, x + 1, y - 1, 2, 2); }
    else { rect(g, f.color, x - 1, y - 1, 1, 2); rect(g, f.color, x + 1, y - 1, 1, 2); }
  }
}

// Polvo al pisar el camino.
export function drawPuffs(g, puffs, now, camX, camY) {
  for (let i = puffs.length - 1; i >= 0; i--) {
    const p = puffs[i], k = (now - p.t0) / 320;
    if (k >= 1) { puffs.splice(i, 1); continue; }
    const c = `rgba(240, 222, 180, ${(0.8 * (1 - k)).toFixed(2)})`;
    rect(g, c, p.x + 3 - k * 4 - camX, p.y + 13 - k * 3 - camY, 2, 2);
    rect(g, c, p.x + 11 + k * 4 - camX, p.y + 13 - k * 3 - camY, 2, 2);
  }
}

// Destellos al abrir el cofre.
export function drawSparkles(g, t0, now, camX, camY) {
  const k = (now - t0) / 1000;
  if (!t0 || k >= 1) return;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + k;
    const x = CHEST.x * TILE + 8 + Math.cos(a) * (4 + k * 10) - camX;
    const y = CHEST.y * TILE + 6 + Math.sin(a) * (3 + k * 6) - k * 10 - camY;
    const c = i % 2 ? '#ffd866' : '#ffffff';
    rect(g, c, x, y); if (Math.floor(now / 90 + i) % 2) { rect(g, c, x - 1, y); rect(g, c, x + 1, y); rect(g, c, x, y - 1); rect(g, c, x, y + 1); }
  }
}

// Globo con «!» sobre un personaje.
export function drawBubble(g, x, y, time) {
  const by = y - 13 - (Math.floor(time / 320) % 2);
  rect(g, '#1a1230', x + 4, by, 9, 10);
  rect(g, '#ffffff', x + 5, by + 1, 7, 8);
  rect(g, '#ffffff', x + 7, by + 10, 2, 1);
  rect(g, '#e04848', x + 8, by + 2, 1, 4);
  rect(g, '#e04848', x + 8, by + 7, 1, 1);
}

// Puerta abierta (hueco oscuro) mientras se entra o se sale.
export function drawOpenDoor(g, b, camX, camY) {
  const dx = b.door.x * TILE - camX, dy = b.door.y * TILE - camY;
  rect(g, '#1a1230', dx + 3, dy + 2, 10, 14);
  rect(g, '#7a4a28', dx + 3, dy + 2, 2, 14);
}

// Brillo intermitente sobre el cofre cerrado: la pista visual de que hay algo en el estanque.
export function drawGlint(g, time, x, y) {
  const k = (time % 2400) / 2400;
  if (k > 0.3) return;
  const r = k < 0.15 ? 1 + Math.floor(k / 0.05) : 3 - Math.floor((k - 0.15) / 0.05);
  const cx = x + 11, cy = y + 6;
  rect(g, '#ffffff', cx, cy);
  for (let i = 1; i <= r; i++) {
    const c = i === r ? '#ffd866' : '#ffffff';
    rect(g, c, cx - i, cy); rect(g, c, cx + i, cy); rect(g, c, cx, cy - i); rect(g, c, cx, cy + i);
  }
}

// Luciérnagas: de noche sustituyen a las mariposas.
const FIREFLIES = Array.from({ length: 9 }, (_, i) => ({
  cx: (2 + ((i * 7) % 22)) * TILE, cy: (3 + ((i * 5) % 13)) * TILE, r: 10 + (i % 3) * 6, a: 3000 + i * 410, b: 2300 + i * 270, p: i * 0.7,
}));

export function drawFireflies(g, time, camX, camY) {
  for (const f of FIREFLIES) {
    const on = Math.sin(time / 600 + f.p * 3) > -0.2;
    if (!on) continue;
    const x = f.cx + Math.sin(time / f.a * Math.PI * 2 + f.p) * f.r - camX;
    const y = f.cy + Math.cos(time / f.b * Math.PI * 2 + f.p) * f.r * 0.6 - camY;
    rect(g, 'rgba(200, 255, 140, 0.35)', x - 1, y - 1, 3, 3);
    rect(g, '#eaffa0', x, y);
  }
}

// Momento del día según la hora local del visitante (?hora=22 en la URL para probarlo).
export function dayPhase(date = new Date()) {
  const forced = Number(new URLSearchParams(window.location.search).get('hora'));
  const h = Number.isInteger(forced) && forced >= 0 && forced < 24 && new URLSearchParams(window.location.search).has('hora') ? forced : date.getHours();
  if (h >= 21 || h < 6) return 'night';
  if (h >= 19) return 'dusk';
  if (h < 8) return 'dawn';
  return 'day';
}

const TINTS = {
  night: [['rgba(10, 16, 64, 0.55)']],
  dusk: [['rgba(255, 120, 60, 0.16)'], ['rgba(50, 30, 110, 0.18)']],
  dawn: [['rgba(255, 180, 130, 0.14)']],
  day: [],
};

export function drawDaylight(g, phase, w, h) {
  for (const [c] of TINTS[phase]) { g.fillStyle = c; g.fillRect(0, 0, w, h); }
}

export function drawWindowLights(g, rects, camX, camY, time) {
  const flicker = 0.85 + Math.sin(time / 900) * 0.05;
  for (const r of rects) {
    rect(g, `rgba(255, 216, 102, ${(0.18 * flicker).toFixed(2)})`, r.x - 3 - camX, r.y - 3 - camY, r.w + 6, r.h + 6);
    rect(g, `rgba(255, 224, 130, ${flicker.toFixed(2)})`, r.x - camX, r.y - camY, r.w, r.h);
    rect(g, '#5a3a22', r.x + 5 - camX, r.y - camY, 1, r.h);
    rect(g, '#5a3a22', r.x - camX, r.y + 4 - camY, r.w, 1);
  }
}
