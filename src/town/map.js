// Plano de Villa Portafolio. Cada edificio abre una sección del CV.
// Coordenadas en casillas de 16 px; la puerta está siempre en la fila inferior.
export const TILE = 16;
export const W = 26;
export const H = 18;

export const BUILDINGS = [
  { id: 'casa', chimney: true, panel: 'estado', x: 2, y: 2, w: 5, h: 4, roof: '#c0413b', icon: 'heart' },
  { id: 'gremio', panel: 'misiones', x: 10, y: 1, w: 6, h: 5, roof: '#3446c2', icon: 'sword' },
  { id: 'academia', panel: 'historia', x: 19, y: 2, w: 5, h: 4, roof: '#2e7d5b', icon: 'book' },
  { id: 'taller', chimney: true, panel: 'habilidades', x: 3, y: 11, w: 5, h: 4, roof: '#8a5a2b', icon: 'hammer' },
  { id: 'posada', chimney: true, panel: 'posada', x: 17, y: 11, w: 6, h: 4, roof: '#7d3fa8', icon: 'mug' },
].map((b) => ({ ...b, door: { x: b.x + Math.floor(b.w / 2), y: b.y + b.h - 1 } }));

export const START = { x: 13, y: 9, dir: 'up' };
export const NPC = { x: 15, y: 9, dir: 'left' };

// Carteles: el de bienvenida y uno junto a cada edificio (a la derecha de su fila inferior).
// El texto está en i18n/strings.js.
export const SIGNS = [
  { x: 11, y: 7, welcome: true },
  { x: 10, y: 16, cave: true },
  ...BUILDINGS.map((b) => ({ x: b.x + b.w, y: b.y + b.h - 1, building: b.id })),
];

// Minijuego: el cofre está en una isla del estanque. Hay arbustos repartidos por el pueblo y
// solo uno esconde la palanca que tiende el puente hasta la isla.
export const POND = { x: 10, y: 10, w: 6, h: 5 };
export const ISLAND = [[12, 12]];
export const CHEST = { x: 13, y: 12 };
export const BRIDGE = [[12, 10], [12, 11]];
export const LEVER = { x: 24, y: 16 };

// Cueva de los bugs: entrada en el borde sur del bosque. Dentro esperan los combates.
export const CAVE = { x: 11, y: 17 };
export const BUSHES = [[1, 1], [18, 1], [7, 9], [20, 9], [1, 16], [LEVER.x, LEVER.y]];

// Estado del mundo que cambia durante la partida.
export const world = { bridge: false, leverFound: false, searched: new Set() };

// Suelo: grass, path, water o tree. Los edificios y objetos van aparte.
export const ground = (() => {
  const g = Array.from({ length: H }, () => Array(W).fill('grass'));
  const set = (x, y, t) => { g[y][x] = t; };
  for (let x = 1; x < W - 1; x++) { set(x, 8, 'path'); set(x, 15, 'path'); }
  for (let y = 8; y <= 15; y++) { set(9, y, 'path'); set(16, y, 'path'); }
  for (const b of BUILDINGS.filter((b) => b.y < 8)) for (let y = b.y + b.h; y < 8; y++) set(b.door.x, y, 'path');
  for (let y = POND.y; y < POND.y + POND.h; y++) for (let x = POND.x; x < POND.x + POND.w; x++) set(x, y, 'water');
  for (const [x, y] of [...ISLAND, [CHEST.x, CHEST.y]]) set(x, y, 'island');
  for (const [x, y] of [[8, 2], [17, 2], [18, 4], [24, 12], [1, 10], [13, 16], [6, 16], [24, 3]]) set(x, y, 'tree');
  for (let x = 0; x < W; x++) { set(x, 0, 'tree'); set(x, H - 1, 'tree'); }
  for (let y = 0; y < H; y++) { set(0, y, 'tree'); set(W - 1, y, 'tree'); }
  return g;
})();

export const isBridge = (x, y) => BRIDGE.some(([bx, by]) => bx === x && by === y);

export const buildingAt = (x, y) =>
  BUILDINGS.find((b) => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h);

// Qué hay en una casilla: null si se puede pisar.
export function cellAt(x, y) {
  if (x < 0 || y < 0 || x >= W || y >= H) return { kind: 'wall' };
  const b = buildingAt(x, y);
  if (b) return b.door.x === x && b.door.y === y ? { kind: 'door', building: b } : { kind: 'wall' };
  if (x === NPC.x && y === NPC.y) return { kind: 'npc' };
  const sign = SIGNS.find((s) => s.x === x && s.y === y);
  if (sign) return { kind: 'sign', sign };
  if (x === CHEST.x && y === CHEST.y) return { kind: 'chest' };
  if (x === CAVE.x && y === CAVE.y) return { kind: 'cave' };
  if (x === LEVER.x && y === LEVER.y && world.leverFound) return { kind: 'lever' };
  const bush = BUSHES.findIndex(([bx, by]) => bx === x && by === y);
  if (bush >= 0) return { kind: 'bush', index: bush, lever: x === LEVER.x && y === LEVER.y };
  const t = ground[y][x];
  if (t === 'water') return world.bridge && isBridge(x, y) ? null : { kind: 'wall' };
  return t === 'tree' ? { kind: 'wall' } : null;
}
