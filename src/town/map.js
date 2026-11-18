// Plano de Villa Portafolio. Cada edificio abre una sección del CV.
// Coordenadas en casillas de 16 px; la puerta está siempre en la fila inferior.
export const TILE = 16;
export const W = 26;
export const H = 18;

export const BUILDINGS = [
  { id: 'casa', panel: 'estado', name: 'Mi casa', hint: 'Quién soy', x: 2, y: 2, w: 5, h: 4, roof: '#c0413b', icon: 'heart' },
  { id: 'gremio', panel: 'misiones', name: 'Gremio de aventureros', hint: 'Experiencia y proyectos', x: 10, y: 1, w: 6, h: 5, roof: '#3446c2', icon: 'sword' },
  { id: 'academia', panel: 'historia', name: 'Academia', hint: 'Formación', x: 19, y: 2, w: 5, h: 4, roof: '#2e7d5b', icon: 'book' },
  { id: 'taller', panel: 'habilidades', name: 'Taller del herrero', hint: 'Habilidades', x: 3, y: 11, w: 5, h: 4, roof: '#8a5a2b', icon: 'hammer' },
  { id: 'posada', panel: 'posada', name: 'Posada', hint: 'Contacto y CV', x: 17, y: 11, w: 6, h: 4, roof: '#7d3fa8', icon: 'mug' },
].map((b) => ({ ...b, door: { x: b.x + Math.floor(b.w / 2), y: b.y + b.h - 1 } }));

export const START = { x: 13, y: 9, dir: 'up' };
export const NPC = { x: 15, y: 9, dir: 'left' };
export const SIGN = { x: 11, y: 7 };
export const CHEST = { x: 8, y: 4 };

// Suelo: grass, path, water o tree. Los edificios y objetos van aparte.
export const ground = (() => {
  const g = Array.from({ length: H }, () => Array(W).fill('grass'));
  const set = (x, y, t) => { g[y][x] = t; };
  for (let x = 1; x < W - 1; x++) { set(x, 8, 'path'); set(x, 15, 'path'); }
  for (let y = 8; y <= 15; y++) { set(9, y, 'path'); set(16, y, 'path'); }
  for (const b of BUILDINGS.filter((b) => b.y < 8)) for (let y = b.y + b.h; y < 8; y++) set(b.door.x, y, 'path');
  for (let y = 11; y <= 13; y++) for (let x = 11; x <= 14; x++) set(x, y, 'water');
  for (const [x, y] of [[8, 2], [17, 2], [18, 4], [24, 12], [1, 10], [13, 16], [6, 16], [24, 4]]) set(x, y, 'tree');
  for (let x = 0; x < W; x++) { set(x, 0, 'tree'); set(x, H - 1, 'tree'); }
  for (let y = 0; y < H; y++) { set(0, y, 'tree'); set(W - 1, y, 'tree'); }
  return g;
})();

export const buildingAt = (x, y) =>
  BUILDINGS.find((b) => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h);

// Qué hay en una casilla: null si se puede pisar.
export function cellAt(x, y) {
  if (x < 0 || y < 0 || x >= W || y >= H) return { kind: 'wall' };
  const b = buildingAt(x, y);
  if (b) return b.door.x === x && b.door.y === y ? { kind: 'door', building: b } : { kind: 'wall' };
  if (x === NPC.x && y === NPC.y) return { kind: 'npc' };
  if (x === SIGN.x && y === SIGN.y) return { kind: 'sign' };
  if (x === CHEST.x && y === CHEST.y) return { kind: 'chest' };
  const t = ground[y][x];
  return t === 'tree' || t === 'water' ? { kind: 'wall' } : null;
}
