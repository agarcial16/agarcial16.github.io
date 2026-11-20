// Interiores de los edificios (versión Gemini Neon): salas detalladas con luz cálida y mobiliario en capas.
import { HERO } from './sprites.js';

const px = (g, color, x, y, w = 1, h = 1) => {
  g.fillStyle = color;
  g.fillRect(Math.round(x), Math.round(y), w, h);
};

// Anfitriones de cada edificio (mismas claves que HERO; la casa la guarda el gato).
export const HOSTS = {
  gremio: { ...HERO, h: '#c43b3b', t: '#3248c7', T: '#20308f', b: '#ffe066', p: '#292942' },
  academia: { ...HERO, h: '#e6e8f2', t: '#287a58', T: '#19543c', b: '#ffe066', p: '#1d4d3a' },
  taller: { ...HERO, h: '#3a2315', s: '#cc8f60', t: '#824b28', T: '#593218', b: '#403b54', p: '#332f47' },
  posada: { ...HERO, h: '#e3b040', t: '#7d3ca8', T: '#562478', b: '#f7f5f0', p: '#473659' },
};

const PALETTES = {
  casa: { wall: '#f0e2c2', dark: '#d8c298', trim: '#5c3b24', floorA: '#b8834b', floorB: '#a6723e', plank: '#7a4d26' },
  gremio: { wall: '#d6c198', dark: '#baa173', trim: '#4a3120', floorA: '#a87442', floorB: '#966435', plank: '#6b4220' },
  academia: { wall: '#c3d1b2', dark: '#a3b590', trim: '#473322', floorA: '#9e6e40', floorB: '#8c5f34', plank: '#633e1f' },
  taller: { wall: '#8f91a3', dark: '#6d7082', trim: '#383a47', floorA: '#5f6173', floorB: '#525466', plank: '#383a47' },
  posada: { wall: '#d1a071', dark: '#b38052', trim: '#4a2c1a', floorA: '#a8703e', floorB: '#946032', plank: '#663c1c' },
};

// Misma geometría y contrato que interior.js: pared de 48px con zócalo, suelo, puerta abajo al centro,
// callback drawSprites entre fondo y primer plano, y retorno { host, visitor, guests }.
export function drawInterior(g, id, W, H, time, drawSprites, opts = {}) {
  const cols = Math.min(11, Math.floor(W / 16)), rows = Math.min(8, Math.floor(H / 16));
  const rw = cols * 16, rh = rows * 16;
  const ox = Math.floor((W - rw) / 2), oy = Math.floor((H - rh) / 2);
  const pal = PALETTES[id] ?? PALETTES.casa;

  px(g, '#070812', 0, 0, W, H);

  // Pared del fondo (48px) con moldura superior, paneles y zócalo
  px(g, pal.wall, ox, oy, rw, 48);
  px(g, pal.dark, ox, oy, rw, 3);
  if (id === 'taller') {
    // Mampostería de piedra en el taller
    for (let y = oy + 6; y < oy + 42; y += 8) {
      px(g, pal.dark, ox, y, rw, 1);
      for (let x = ox + ((y / 8) % 2 ? 4 : 12); x < ox + rw; x += 16) px(g, pal.dark, x, y - 7, 1, 7);
    }
  } else {
    for (let x = ox + 8; x < ox + rw; x += 16) px(g, pal.dark, x, oy + 3, 1, 39);
  }
  // Zócalo inferior de madera/piedra con reborde iluminado
  px(g, pal.trim, ox, oy + 42, rw, 6);
  px(g, pal.dark, ox, oy + 42, rw, 1);
  px(g, '#1c1414', ox, oy + 47, rw, 1);

  // Suelo: baldosas en el taller, tablones con vetas en el resto
  if (id === 'taller') {
    for (let y = oy + 48; y < oy + rh; y += 10) {
      for (let x = ox; x < ox + rw; x += 12) {
        const alt = (Math.floor((x - ox) / 12) + Math.floor((y - oy) / 10)) % 2;
        px(g, alt ? pal.floorA : pal.floorB, x, y, Math.min(12, ox + rw - x), Math.min(10, oy + rh - y));
        px(g, pal.plank, x, y, Math.min(12, ox + rw - x), 1);
        px(g, pal.plank, x, y, 1, Math.min(10, oy + rh - y));
      }
    }
  } else {
    for (let y = oy + 48; y < oy + rh; y += 6) {
      const idx = Math.floor((y - (oy + 48)) / 6);
      const h = Math.min(6, oy + rh - y);
      px(g, idx % 2 ? pal.floorB : pal.floorA, ox, y, rw, h);
      px(g, pal.plank, ox, y + h - 1, rw, 1);
      for (let x = ox + (idx % 2 ? 4 : 15); x < ox + rw; x += 22) {
        px(g, pal.plank, x, y, 1, h);
        px(g, '#4a2b14', x + 2, y + 2, 1, 1);
      }
    }
  }
  // Sombra sutil de la pared sobre el suelo
  px(g, '#100c1c33', ox, oy + 48, rw, 2);

  // Puerta de salida abajo al centro con felpudo cálido
  const cx = ox + Math.floor(rw / 2);
  px(g, '#5c3b24', cx - 10, oy + rh - 7, 20, 4);
  px(g, '#a84a42', cx - 9, oy + rh - 6, 18, 2);
  px(g, '#161124', cx - 8, oy + rh - 4, 16, 4);
  px(g, '#ffe06644', cx - 6, oy + rh - 2, 12, 2);

  // Marco de la sala con bisel
  px(g, '#261812', ox - 3, oy - 3, rw + 6, 3);
  px(g, '#261812', ox - 3, oy + rh, rw + 6, 3);
  px(g, '#261812', ox - 3, oy, 3, rh);
  px(g, '#261812', ox + rw, oy, 3, rh);
  px(g, '#523420', ox - 2, oy - 2, rw + 4, 1);
  px(g, '#523420', ox - 2, oy - 2, 1, rh + 3);

  const flicker = Math.floor(time / 120) % 3;
  const room = { ox, oy, rw, rh, cx };
  const pos = {
    host: { x: cx - 8, y: oy + 52 },
    visitor: { x: cx - 8, y: oy + rh - 20 },
    guests: id === 'posada' ? [{ x: ox + 17, y: oy + 52 }, { x: ox + rw - 47, y: oy + 52 }] : [],
  };
  DECOR[id](g, room, flicker, time, opts);
  drawSprites?.(pos);
  FOREGROUND[id]?.(g, room, flicker);
  return pos;
}

// Zzz de un viajero dormido con sombra oscura para leerse bien incluso en 4 tonos.
export function drawZzz(g, x, y, time) {
  for (let i = 0; i < 3; i++) {
    const k = (time / 1400 + i / 3) % 1;
    const zx = Math.round(x + i * 4 + Math.sin(k * Math.PI) * 2);
    const zy = Math.round(y - k * 13);
    const alpha = (0.9 * (1 - k)).toFixed(2);
    g.fillStyle = `rgba(18, 14, 32, ${alpha})`;
    g.fillRect(zx + 1, zy + 1, 3, 1);
    g.fillRect(zx + 2, zy + 2, 1, 1);
    g.fillRect(zx + 1, zy + 3, 3, 1);
    g.fillStyle = `rgba(244, 246, 255, ${alpha})`;
    g.fillRect(zx, zy, 3, 1);
    g.fillRect(zx + 1, zy + 1, 1, 1);
    g.fillRect(zx, zy + 2, 3, 1);
  }
}

const drawWindow = (g, x, y) => {
  px(g, '#291a12', x - 1, y - 1, 20, 18);
  px(g, '#694026', x, y, 18, 16);
  px(g, '#7cc0f5', x + 2, y + 2, 14, 12);
  px(g, '#b0e0ff', x + 2, y + 2, 14, 6);
  px(g, '#ffffff', x + 4, y + 4, 4, 2); // nubecita
  px(g, '#ffffff', x + 5, y + 3, 2, 1);
  // Cortinillas laterales
  px(g, '#c94949', x + 2, y + 2, 2, 12);
  px(g, '#c94949', x + 14, y + 2, 2, 12);
  px(g, '#52301c', x + 8, y + 2, 2, 12);
  px(g, '#52301c', x + 2, y + 7, 14, 1);
  px(g, '#a8835a', x - 1, y + 16, 20, 2);
};

const drawCounter = (g, x, y, w, top = '#9c6736', front = '#6e4324') => {
  px(g, '#1f130d', x - 1, y - 1, w + 2, 16);
  px(g, top, x, y, w, 4);
  px(g, '#c99357', x + 1, y, w - 2, 1);
  px(g, front, x, y + 4, w, 10);
  px(g, '#472916', x, y + 4, w, 1);
  for (let i = x + 6; i < x + w - 4; i += 12) {
    px(g, '#472916', i, y + 6, 8, 6);
    px(g, '#5c371e', i + 1, y + 7, 6, 4);
  }
};

const drawTable = (g, x, y, w) => {
  px(g, '#1f130d', x - 1, y - 1, w + 2, 13);
  px(g, '#9c6736', x, y, w, 4);
  px(g, '#c99357', x + 1, y, w - 2, 1);
  px(g, '#6e4324', x, y + 4, w, 7);
  px(g, '#472916', x, y + 4, w, 1);
  for (let i = x + 5; i < x + w - 2; i += 10) px(g, '#472916', i, y + 5, 1, 5);
};

const drawMug = (g, x, y) => {
  px(g, '#241610', x - 1, y - 1, 8, 8);
  px(g, '#d49022', x, y + 1, 5, 5);
  px(g, '#ffe066', x + 1, y + 2, 1, 3);
  px(g, '#ffffff', x, y, 5, 2);
  px(g, '#f0f0f5', x + 1, y + 2, 2, 1); // espuma rebosando
  px(g, '#d49022', x + 5, y + 2, 1, 3); // asa
};

const DECOR = {
  casa(g, { ox, oy, rw, cx }, _flicker, time, { catGone } = {}) {
    drawWindow(g, ox + 10, oy + 12);
    drawWindow(g, ox + rw - 28, oy + 12);
    // Pequeño cuadro enmarcado en el centro de la pared
    px(g, '#4a2e1a', cx - 10, oy + 12, 20, 14);
    px(g, '#7cc0f5', cx - 8, oy + 14, 16, 10);
    px(g, '#398241', cx - 8, oy + 20, 16, 4);
    px(g, '#ffe066', cx + 3, oy + 15, 3, 3);

    // Cama con cabecero tallado, almohada y colcha acolchada
    px(g, '#241610', ox + 7, oy + 49, 28, 34);
    px(g, '#694026', ox + 8, oy + 50, 26, 5);
    px(g, '#8c5835', ox + 9, oy + 50, 24, 2);
    px(g, '#f7f5f0', ox + 10, oy + 55, 22, 8);
    px(g, '#d8d4e0', ox + 11, oy + 61, 20, 2);
    px(g, '#c93e3e', ox + 10, oy + 63, 22, 18);
    px(g, '#e86868', ox + 10, oy + 63, 22, 2);
    px(g, '#f0e2c2', ox + 10, oy + 65, 22, 1);
    px(g, '#962828', ox + 10, oy + 78, 22, 3);

    if (!catGone) {
      // Gatito gris acurrucado respirando suavemente sobre la manta
      const breath = Math.floor(time / 700) % 2;
      px(g, '#161224', ox + 12, oy + 66 - breath, 15, 7 + breath);
      px(g, '#5c627a', ox + 13, oy + 67 - breath, 11, 5 + breath);
      px(g, '#3c4057', ox + 15, oy + 68 - breath, 2, 2);
      px(g, '#3c4057', ox + 19, oy + 68 - breath, 2, 2);
      px(g, '#5c627a', ox + 22, oy + 65, 4, 4); // cabeza
      px(g, '#161224', ox + 22, oy + 64, 1, 1); px(g, '#161224', ox + 25, oy + 64, 1, 1); // orejas
      px(g, '#dde2ee', ox + 13, oy + 71, 4, 1); // cola enroscada
    } else {
      // Manta deshecha tras marcharse el gato
      px(g, '#962828', ox + 13, oy + 67, 13, 3);
      px(g, '#e86868', ox + 15, oy + 66, 9, 1);
      px(g, '#962828', ox + 20, oy + 71, 10, 3);
    }

    // Mesita con ficha de personaje, pluma y taza humeante
    px(g, '#241610', cx - 16, oy + 54, 32, 13);
    px(g, '#9c6736', cx - 15, oy + 55, 30, 4);
    px(g, '#6e4324', cx - 15, oy + 59, 30, 7);
    px(g, '#f7ebd0', cx - 10, oy + 52, 11, 7);
    px(g, '#734526', cx - 8, oy + 54, 7, 1);
    px(g, '#734526', cx - 8, oy + 56, 5, 1);
    px(g, '#ffffff', cx + 5, oy + 51, 5, 6);
    px(g, '#5c3620', cx + 6, oy + 52, 3, 2);
    // Vaporcito del café
    const steam = Math.floor(time / 400) % 2;
    px(g, '#ffffff99', cx + 6 + steam, oy + 48, 1, 2);
    px(g, '#ffffff66', cx + 8 - steam, oy + 46, 1, 2);

    // Maceta con planta frondosa
    px(g, '#241610', ox + rw - 20, oy + 62, 12, 11);
    px(g, '#a3523b', ox + rw - 19, oy + 63, 10, 9);
    px(g, '#c96c50', ox + rw - 19, oy + 63, 10, 2);
    px(g, '#1a4f2b', ox + rw - 22, oy + 52, 16, 11);
    px(g, '#398241', ox + rw - 21, oy + 53, 14, 8);
    px(g, '#6fc267', ox + rw - 19, oy + 54, 5, 4);
    px(g, '#6fc267', ox + rw - 13, oy + 56, 4, 3);

    // Alfombra tejida con flecos y motivo central
    px(g, '#562678', cx - 22, oy + 83, 44, 16);
    px(g, '#7d3ca8', cx - 20, oy + 85, 40, 12);
    px(g, '#ffe066', cx - 18, oy + 86, 36, 1);
    px(g, '#ffe066', cx - 18, oy + 95, 36, 1);
    px(g, '#ffe066', cx - 4, oy + 89, 8, 4);
    px(g, '#c94949', cx - 2, oy + 90, 4, 2);
    for (let y = oy + 85; y < oy + 97; y += 2) {
      px(g, '#f0e2c2', cx - 24, y, 2, 1);
      px(g, '#f0e2c2', cx + 22, y, 2, 1);
    }
  },

  gremio(g, { ox, oy, rw, cx }) {
    // Tablón de misiones de corcho con notas, chinchetas y sello rojo
    px(g, '#261812', cx - 28, oy + 7, 56, 32);
    px(g, '#694026', cx - 27, oy + 8, 54, 30);
    px(g, '#c9985a', cx - 24, oy + 11, 48, 24);
    [[-21, 13], [-9, 14], [3, 12], [14, 15], [-16, 24], [6, 24]].forEach(([dx, dy], i) => {
      px(g, '#4a3120', cx + dx + 1, oy + dy + 1, 9, 8);
      px(g, i % 3 ? '#f7ebd0' : '#ffffff', cx + dx, oy + dy, 9, 8);
      px(g, i % 2 ? '#e04248' : '#ffe066', cx + dx + 4, oy + dy, 1, 1);
      px(g, '#6e4324', cx + dx + 2, oy + dy + 3, 5, 1);
      px(g, '#8c663b', cx + dx + 2, oy + dy + 5, 4, 1);
    });
    // Estandartes nobles con barra dorada y emblema
    for (const x of [ox + 8, ox + rw - 20]) {
      px(g, '#ffe066', x - 1, oy + 5, 14, 2);
      px(g, '#1c266e', x, oy + 7, 12, 24);
      px(g, '#3248c7', x + 1, oy + 7, 10, 22);
      px(g, '#ffe066', x + 4, oy + 13, 4, 6);
      px(g, '#ffffff', x + 5, oy + 14, 2, 4);
      px(g, '#3248c7', x + 2, oy + 29, 8, 3);
      px(g, '#ffe066', x + 4, oy + 32, 4, 2);
    }
  },

  academia(g, { ox, oy, rw, cx }) {
    const books = ['#c93e3e', '#3248c7', '#287a58', '#d49022', '#7d3ca8', '#e8d8b0', '#4ca1c9'];
    for (const x of [ox + 6, ox + rw - 46]) {
      px(g, '#261812', x - 1, oy + 3, 42, 45);
      px(g, '#5c371e', x, oy + 4, 40, 44);
      px(g, '#7a4d26', x, oy + 4, 40, 2);
      for (let s = 0; s < 3; s++) {
        px(g, '#261610', x + 2, oy + 7 + s * 13, 36, 11);
        for (let i = 0; i < 8; i++) {
          const bh = 9 - (i % 3);
          const col = books[(i + s * 3 + x) % books.length];
          px(g, col, x + 3 + i * 4, oy + 18 + s * 13 - bh, 3, bh);
          px(g, '#ffffff55', x + 3 + i * 4, oy + 18 + s * 13 - bh, 1, bh);
        }
      }
    }
    // Pizarra verde con marco, bandeja de tizas y diagrama
    px(g, '#261812', cx - 19, oy + 7, 38, 26);
    px(g, '#694026', cx - 18, oy + 8, 36, 24);
    px(g, '#224234', cx - 16, oy + 10, 32, 20);
    px(g, '#eef2f5', cx - 13, oy + 13, 12, 1);
    px(g, '#eef2f5', cx - 13, oy + 17, 18, 1);
    px(g, '#ffe066', cx - 13, oy + 21, 9, 1);
    px(g, '#8cc8ff', cx + 4, oy + 13, 8, 6); // esquema gráfico
    px(g, '#224234', cx + 5, oy + 14, 6, 4);
    // Tiza y borrador
    px(g, '#ffffff', cx - 10, oy + 30, 4, 1);
    px(g, '#c94949', cx + 6, oy + 29, 5, 2);
  },

  taller(g, { ox, oy, rw, cx }, flicker) {
    // Halo cálido suave de la fragua sobre el suelo de piedra
    px(g, 'rgba(255, 140, 40, 0.08)', ox + 4, oy + 58, 40, 14);
    px(g, 'rgba(255, 155, 50, 0.12)', ox + 10, oy + 60, 28, 9);
    // Fragua de piedra con campana y brasas
    px(g, '#242530', ox + 5, oy + 14, 36, 48);
    px(g, '#4a4c5e', ox + 6, oy + 15, 34, 46);
    px(g, '#676980', ox + 6, oy + 15, 34, 3);
    px(g, '#16141f', ox + 11, oy + 32, 24, 22);
    px(g, '#8a221c', ox + 13, oy + 49, 20, 4); // carbones encendidos
    const fire = ['#fff29c', '#ffb038', '#e64935'];
    for (let i = 0; i < 5; i++) {
      const h = 10 + ((i + flicker) % 3) * 4;
      px(g, fire[(i + flicker) % 3], ox + 13 + i * 4, oy + 52 - h, 3, h);
    }

    // Estante de herramientas colgadas
    px(g, '#261812', cx - 31, oy + 9, 62, 5);
    px(g, '#7a4d26', cx - 30, oy + 10, 60, 3);
    [[-24, 'hammer'], [-6, 'tongs'], [12, 'hammer']].forEach(([dx, kind]) => {
      px(g, '#261812', cx + dx + 2, oy + 13, 4, 15);
      px(g, '#7a4d26', cx + dx + 3, oy + 13, 2, 14);
      if (kind === 'hammer') {
        px(g, '#363847', cx + dx - 1, oy + 12, 10, 6);
        px(g, '#a4a8bd', cx + dx, oy + 13, 8, 4);
        px(g, '#dce0f0', cx + dx + 1, oy + 13, 6, 1);
      } else {
        px(g, '#242530', cx + dx, oy + 23, 8, 6);
        px(g, '#a4a8bd', cx + dx + 1, oy + 24, 6, 4);
        px(g, '#242530', cx + dx + 1, oy + 11, 6, 5);
        px(g, '#a4a8bd', cx + dx + 2, oy + 12, 4, 3);
      }
    });

    // Yunque sobre tocón de madera (protagonista del minijuego de la forja)
    px(g, '#5c371e', cx + 19, oy + 80, 16, 10);
    px(g, '#3a2212', cx + 19, oy + 88, 16, 2);
    px(g, '#181822', cx + 11, oy + 69, 30, 7);
    px(g, '#4b4e63', cx + 13, oy + 70, 26, 5);
    px(g, '#969ab3', cx + 15, oy + 70, 22, 2); // mesa pulida del yunque
    px(g, '#363847', cx + 18, oy + 75, 16, 4);
    px(g, '#242530', cx + 21, oy + 79, 10, 4);

    // Barril con espadas forjadas
    px(g, '#261812', ox + rw - 21, oy + 55, 16, 20);
    px(g, '#7a4d26', ox + rw - 20, oy + 56, 14, 18);
    px(g, '#3a2212', ox + rw - 20, oy + 60, 14, 2);
    px(g, '#3a2212', ox + rw - 20, oy + 68, 14, 2);
    // Hojas metálicas con guardas doradas
    px(g, '#dce0f0', ox + rw - 17, oy + 43, 2, 13);
    px(g, '#ffe066', ox + rw - 19, oy + 46, 6, 1);
    px(g, '#c2c7db', ox + rw - 11, oy + 45, 2, 11);
    px(g, '#ffe066', ox + rw - 13, oy + 48, 6, 1);
  },

  posada(g, { ox, oy, rw, cx }, flicker) {
    // Resplandor cálido suave de la chimenea
    px(g, 'rgba(255, 170, 70, 0.08)', ox + 6, oy + 46, 34, 12);
    px(g, 'rgba(255, 185, 80, 0.11)', ox + 10, oy + 47, 24, 7);
    // Chimenea de piedra con repisa de madera
    px(g, '#282836', ox + 5, oy + 9, 32, 39);
    px(g, '#72758a', ox + 6, oy + 10, 30, 37);
    px(g, '#9598ad', ox + 6, oy + 10, 30, 2);
    px(g, '#5c371e', ox + 4, oy + 20, 34, 4); // repisa
    px(g, '#ffe066', ox + 19, oy + 15, 4, 5); // vela en la repisa
    px(g, '#161124', ox + 11, oy + 26, 20, 20);
    const fire = ['#fff29c', '#ffb038', '#e64935'];
    for (let i = 0; i < 4; i++) {
      const h = 8 + ((i + flicker) % 3) * 3;
      px(g, fire[(i + flicker) % 3], ox + 13 + i * 4, oy + 44 - h, 3, h);
    }

    // Estante de jarras espumosas y botellas
    px(g, '#261812', cx - 22, oy + 22, 44, 4);
    px(g, '#7a4d26', cx - 21, oy + 23, 42, 2);
    for (let i = 0; i < 4; i++) drawMug(g, cx - 17 + i * 10, oy + 16);

    // Barriles de roble a la derecha
    for (const [x, y] of [[ox + rw - 23, oy + 28], [ox + rw - 23, oy + 49]]) {
      px(g, '#261812', x - 1, y - 1, 18, 20);
      px(g, '#8a542e', x, y, 16, 18);
      px(g, '#a86b3e', x + 2, y, 4, 18);
      px(g, '#363847', x, y + 4, 16, 2);
      px(g, '#363847', x, y + 12, 16, 2);
      px(g, '#ffe066', x + 7, y + 8, 2, 2); // espita de latón
    }
  },
};

const FOREGROUND = {
  gremio(g, { cx, oy }) {
    drawCounter(g, cx - 34, oy + 66, 68);
    // Libro de registros a la izquierda y campanilla dorada a la derecha
    px(g, '#f7ebd0', cx - 24, oy + 62, 12, 5);
    px(g, '#8a542e', cx - 18, oy + 62, 1, 5);
    px(g, '#241610', cx + 17, oy + 61, 8, 6);
    px(g, '#ffe066', cx + 18, oy + 62, 6, 4);
    px(g, '#ffffff', cx + 19, oy + 62, 2, 1);
  },
  academia(g, { cx, oy }) {
    drawCounter(g, cx - 26, oy + 66, 52, '#694026', '#4a2c18');
    // Libro abierto y tintero sobre el pupitre
    px(g, '#f7ebd0', cx - 14, oy + 62, 12, 5);
    px(g, '#241610', cx + 12, oy + 62, 4, 4);
    px(g, '#3248c7', cx + 13, oy + 63, 2, 2);
  },
  posada(g, { ox, oy, cx, rw }, flicker) {
    drawCounter(g, cx - 30, oy + 66, 60);
    drawMug(g, cx - 20, oy + 60);
    // Vela parpadeante sobre la barra
    px(g, '#f7f5f0', cx + 16, oy + 61, 3, 5);
    px(g, flicker % 2 ? '#ffe066' : '#ffb038', cx + 17, oy + 59, 1, 2);
    // Mesas laterales de los viajeros (tapan sus piernas)
    drawTable(g, ox + 8, oy + 66, 34);
    drawTable(g, ox + rw - 55, oy + 66, 32);
    drawMug(g, ox + 20, oy + 60);
    drawMug(g, ox + rw - 45, oy + 60);
  },
};
