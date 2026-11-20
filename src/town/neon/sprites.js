// Personajes y criaturas (versión Gemini Neon), dibujados por código en 16×16.

const px = (g, color, x, y, w = 1, h = 1) => {
  if (!color) return;
  g.fillStyle = color;
  g.fillRect(x, y, w, h);
};

// Mezcla un color hex hacia blanco (t > 0) o negro (t < 0) para derivar luces y sombras
// manteniendo compatibilidad con paletas externas que solo definen las 9 claves de HERO.
function shade(hex, amount) {
  if (!hex || hex[0] !== '#' || hex.length !== 7) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const gr = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mix = (c) => Math.max(0, Math.min(255, Math.round(amount >= 0 ? c + (255 - c) * amount : c * (1 + amount))));
  return `#${[mix(r), mix(gr), mix(b)].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function enrichPalette(pal) {
  return {
    H: shade(pal.h, 0.28),
    d: shade(pal.h, -0.28),
    S: shade(pal.s, -0.18),
    u: shade(pal.t, 0.22),
    P: shade(pal.p, -0.24),
    w: '#f7f5f0',
    ...pal,
  };
}

// Paletas principales (9 claves estándar: contorno, pelo, piel, ojos, túnica, sombra túnica, cinturón, pantalón, botas).
export const HERO = {
  k: '#161226',
  h: '#663c24',
  s: '#f4c79c',
  e: '#161226',
  t: '#3662db',
  T: '#24419c',
  b: '#ffe066',
  p: '#383452',
  o: '#693c22',
};

export const VISITOR = {
  ...HERO,
  h: '#d9a438',
  t: '#2f9c60',
  T: '#1f6c42',
  b: '#e8b63a',
  p: '#40455e',
  o: '#5c3620',
};

// Ángel: pelo negro abundante con flequillo, gafas de pasta, bigote y perilla,
// camisa blanca con corbata negra y estola marrón.
export const ANGEL = {
  k: '#0e0c18',
  h: '#1f1e2b',
  H: '#50526e',
  d: '#12111a',
  s: '#e8b992',
  S: '#c7926c',
  e: '#12101e',
  g: '#22212e',
  L: '#d9eeff',
  B: '#2b201a',
  w: '#f7f7fb',
  W: '#cfd3e0',
  n: '#14141e',
  t: '#a35d2c',
  T: '#733e1b',
  a: '#2b2c3b',
  p: '#262636',
  P: '#171724',
  o: '#12121a',
};

// ---- Formas base 16×16 (9 filas cabeza + 5 cuerpo + 2 piernas) ----
const HEAD_DOWN = [
  '....kkkkkkkk....',
  '...khhHHHHhhk...',
  '..khhHhhhhHhhk..',
  '..khhhdhhhdhhk..',
  '..khdssssssdhk..',
  '..kssessssessk..',
  '..kssessssessk..',
  '...kSssssssSk...',
  '....kSssssSk....',
];

const HEAD_UP = [
  '....kkkkkkkk....',
  '...khhHHHHhhk...',
  '..khhHhhhhHhhk..',
  '..khhhhhhhhhhk..',
  '..khhhhhhhhhhk..',
  '..khhdhhhhdhhk..',
  '..khddhhhhddhk..',
  '...kddddddddk...',
  '....kddssddk....',
];

const HEAD_SIDE = [
  '....kkkkkkkk....',
  '...khhHHHHhhk...',
  '..khhHhhhhhhhk..',
  '..khhhhhhdhhhk..',
  '..kssshhhdhhhk..',
  '..ksesshhdhhhk..',
  '..ksessSshddhk..',
  '...kssssSkddk...',
  '....kSsssSkk....',
];

const BODY_FRONT = [
  '...kuuttttuuk...',
  '..kTttttttttTk..',
  '..ksTTttttTTsk..',
  '...kTbbbbbbTk...',
  '...kPppppppPk...',
];

const BODY_SIDE = [
  '....kuutttTk....',
  '....kttsstTk....',
  '....ktTssTTk....',
  '....kbbbbbbk....',
  '....kPppppPk....',
];

const LEGS_FRONT = [
  ['...kPppkkppPk...', '...kooo..oook...'],
  ['...kPppkkppk....', '..koook.kook....'],
  ['....kppkkppPk...', '....kook.koook..'],
];

const LEGS_SIDE = [
  ['....kPpkppk.....', '....kookook.....'],
  ['...kPpk..kppk...', '..kook....kook..'],
  ['....kPppppk.....', '....koooook.....'],
];

const BASE = {
  down: [HEAD_DOWN, BODY_FRONT],
  up: [HEAD_UP, BODY_FRONT],
  side: [HEAD_SIDE, BODY_SIDE],
};

export const ANGEL_SHAPE = {
  down: [
    [
      '....kkkkkkkk....',
      '...khhHHHHhhk...',
      '..khhHhhhhHhhk..',
      '..khhhddddhhhk..',
      '..kggggssggggk..',
      '..kgLeggggeLgk..',
      '..kggggssggggk..',
      '..kSssBBBBssSk..',
      '...kSsBBBBsSk...',
    ],
    [
      '...kttwnnwttk...',
      '..kattWnnWttak..',
      '..ksTtwnnwTtsk..',
      '...kTtwnnwTtk...',
      '...kPppppppPk...',
    ],
  ],
  up: [
    [
      '....kkkkkkkk....',
      '...khhHHHHhhk...',
      '..khhHhhhhHhhk..',
      '..khhhhhhhhhhk..',
      '..khhhhhhhhhhk..',
      '..khhdhhhhdhhk..',
      '..khddhhhhddhk..',
      '...kddddddddk...',
      '....kSssssSk....',
    ],
    [
      '...kttttttttk...',
      '..kattttttttak..',
      '..ksTTttttTTsk..',
      '...kTttttttTk...',
      '...kPppppppPk...',
    ],
  ],
  side: [
    [
      '....kkkkkkkk....',
      '...khhHHHHhhk...',
      '..khhHhhhhhhhk..',
      '..khhhhhhdhhhk..',
      '..kggggghdhhhk..',
      '..kLLegggshddk..',
      '..kggggsshddhk..',
      '..kBBBsssSkdk...',
      '...kBBBssSkk....',
    ],
    [
      '...knwttttTk....',
      '...knwtaatTk....',
      '...kWttssTTk....',
      '....kttTTttk....',
      '....kPppppPk....',
    ],
  ],
};

function spriteCanvas(rows, pal, flip) {
  const c = document.createElement('canvas');
  c.width = 16;
  c.height = 16;
  const g = c.getContext('2d');
  rows.forEach((row, y) => {
    const padded = row.padEnd(16, '.').slice(0, 16);
    for (let x = 0; x < 16; x++) {
      const ch = padded[x];
      if (ch !== '.') px(g, pal[ch], flip ? 15 - x : x, y);
    }
  });
  return c;
}

// Construye los 12 sprites (down/up/left/right × 3 frames: quieto, paso 1, paso 2).
export function buildSprites(pal, shape = BASE) {
  const ext = enrichPalette(pal);
  const out = {};
  for (const dir of ['down', 'up', 'left', 'right']) {
    const side = dir === 'left' || dir === 'right';
    const [head, body] = shape[side ? 'side' : dir];
    const legs = side ? LEGS_SIDE : LEGS_FRONT;
    out[dir] = legs.map((l) => spriteCanvas([...head, ...body, ...l].slice(0, 16), ext, dir === 'right'));
  }
  return out;
}

// Gato compañero 16×16: atigrado gris azulado, orejitas rosadas, patitas claras y ojos esmeralda.
const CAT = {
  k: '#161224',
  fur: '#5c627a',
  dark: '#3c4057',
  light: '#dde2ee',
  ear: '#e8999e',
  eye: '#7cf296',
  nose: '#f0a6ad',
};

export function drawCat(g, ox, oy, dir, step, time) {
  const bob = step ? -1 : 0;
  const y = oy + 2 + bob;
  const sway = Math.round(Math.sin(time / 340) * (step ? 1.5 : 1));
  const blink = !step && (time % 3200) < 150;
  const { k, fur, dark, light, ear, eye, nose } = CAT;

  if (dir === 'down') {
    // Cola curva asomando pegada al cuerpo
    px(g, k, ox + 11, y + 8, 3, 3);
    px(g, k, ox + 12, y + 6 + sway, 3, 4);
    px(g, fur, ox + 12, y + 8, 2, 2);
    px(g, fur, ox + 13, y + 7 + sway, 1, 2);
    px(g, light, ox + 13, y + 6 + sway, 1, 1);
    // Orejas puntiagudas con borde oscuro e interior rosado
    px(g, k, ox + 3, y, 3, 3); px(g, k, ox + 10, y, 3, 3);
    px(g, fur, ox + 4, y + 1, 2, 2); px(g, fur, ox + 10, y + 1, 2, 2);
    px(g, ear, ox + 4, y + 1, 1, 1); px(g, ear, ox + 11, y + 1, 1, 1);
    // Cabeza redondeada (sin esquinas cuadradas) con rayitas atigradas
    px(g, k, ox + 4, y + 1, 8, 1);
    px(g, k, ox + 3, y + 2, 10, 5);
    px(g, k, ox + 4, y + 7, 8, 1);
    px(g, fur, ox + 4, y + 2, 8, 5);
    px(g, dark, ox + 6, y + 2, 1, 2); px(g, dark, ox + 9, y + 2, 1, 2);
    // Ojazos esmeralda con pupila oscura (o parpadeo breve)
    if (blink) {
      px(g, k, ox + 5, y + 4, 2, 1); px(g, k, ox + 9, y + 4, 2, 1);
    } else {
      px(g, eye, ox + 5, y + 4, 2, 2); px(g, eye, ox + 9, y + 4, 2, 2);
      px(g, k, ox + 6, y + 4, 1, 2); px(g, k, ox + 9, y + 4, 1, 2);
      px(g, light, ox + 5, y + 4, 1, 1); px(g, light, ox + 10, y + 4, 1, 1);
    }
    // Hociquito claro y nariz rosa
    px(g, light, ox + 6, y + 6, 4, 1);
    px(g, nose, ox + 7, y + 6, 2, 1);
    // Cuerpo y pecho esponjoso
    px(g, k, ox + 4, y + 8, 8, 4);
    px(g, fur, ox + 5, y + 8, 6, 4);
    px(g, light, ox + 6, y + 8, 4, 3);
    // Patitas con calcetines claros
    const lStep = step === 1 ? -1 : 0;
    const rStep = step === 2 ? -1 : 0;
    px(g, k, ox + 4, y + 11 + lStep, 3, 2); px(g, light, ox + 5, y + 11 + lStep, 2, 1);
    px(g, k, ox + 9, y + 11 + rStep, 3, 2); px(g, light, ox + 9, y + 11 + rStep, 2, 1);
  } else if (dir === 'up') {
    // Orejas
    px(g, k, ox + 3, y, 3, 3); px(g, k, ox + 10, y, 3, 3);
    px(g, fur, ox + 4, y + 1, 2, 2); px(g, fur, ox + 10, y + 1, 2, 2);
    // Cabeza trasera redondeada
    px(g, k, ox + 4, y + 1, 8, 1);
    px(g, k, ox + 3, y + 2, 10, 5);
    px(g, k, ox + 4, y + 7, 8, 1);
    px(g, fur, ox + 4, y + 2, 8, 5);
    px(g, dark, ox + 5, y + 3, 6, 1); px(g, dark, ox + 6, y + 5, 4, 1);
    // Cuerpo atigrado
    px(g, k, ox + 4, y + 8, 8, 4);
    px(g, fur, ox + 5, y + 8, 6, 4);
    px(g, dark, ox + 6, y + 9, 4, 1);
    // Patitas
    const lStep = step === 1 ? -1 : 0;
    const rStep = step === 2 ? -1 : 0;
    px(g, k, ox + 4, y + 11 + lStep, 3, 2); px(g, light, ox + 5, y + 11 + lStep, 2, 1);
    px(g, k, ox + 9, y + 11 + rStep, 3, 2); px(g, light, ox + 9, y + 11 + rStep, 2, 1);
    // Cola erguida ondulando
    px(g, k, ox + 7 + sway, y + 4, 3, 5);
    px(g, fur, ox + 8 + sway, y + 5, 1, 4);
    px(g, light, ox + 8 + sway, y + 4, 1, 1);
  } else {
    const left = dir === 'left';
    const hx = left ? ox + 2 : ox + 8;
    const bx = left ? ox + 5 : ox + 4;
    const tx = left ? ox + 11 : ox + 3;
    // Cola alta conectada al lomo con punta blanca
    px(g, k, tx, y + 5, 3, 3);
    px(g, k, tx + (left ? 1 : -1), y + 2 + sway, 2, 5);
    px(g, fur, tx + (left ? 1 : 0), y + 5, 1, 2);
    px(g, fur, tx + (left ? 1 : 0), y + 3 + sway, 1, 3);
    px(g, light, tx + (left ? 1 : 0), y + 2 + sway, 1, 1);
    // Cuerpo lateral atigrado
    px(g, k, bx, y + 6, 7, 6);
    px(g, fur, bx + 1, y + 7, 5, 4);
    px(g, dark, bx + 2, y + 7, 1, 2); px(g, dark, bx + 4, y + 7, 1, 2);
    px(g, light, bx + 1, y + 10, 5, 1);
    // Patitas trotando
    const p1 = step === 1 ? -1 : 0;
    const p2 = step === 2 ? -1 : 0;
    px(g, k, bx, y + 11 + p1, 3, 2); px(g, light, bx + 1, y + 11 + p1, 1, 1);
    px(g, k, bx + 4, y + 11 + p2, 3, 2); px(g, light, bx + 5, y + 11 + p2, 1, 1);
    // Cabeza lateral redondeada y orejas
    px(g, k, hx, y + 1, 2, 2); px(g, k, hx + 4, y + 1, 2, 2);
    px(g, ear, hx + (left ? 1 : 0), y + 1, 1, 1); px(g, fur, hx + (left ? 4 : 5), y + 1, 1, 1);
    px(g, k, hx, y + 2, 6, 1);
    px(g, k, hx - 1, y + 3, 8, 4);
    px(g, k, hx, y + 7, 6, 1);
    px(g, fur, hx, y + 3, 6, 4);
    // Ojo verde brillante + hocico
    const ex = left ? hx + 1 : hx + 4;
    if (blink) {
      px(g, k, ex, y + 5, 1, 1);
    } else {
      px(g, eye, ex, y + 4, 2, 2);
      px(g, k, left ? ex : ex + 1, y + 4, 1, 2);
    }
    px(g, light, left ? hx : hx + 5, y + 6, 1, 1);
    px(g, nose, left ? hx : hx + 5, y + 5, 1, 1);
  }
}

// Bicho 16×16 para los combates de la cueva (solo claves k h w b B compatibles con ENEMIES).
export const BUG_SPRITE = [
  '...kk......kk...',
  '....kk....kk....',
  '...kkkkkkkkkk...',
  '..khhhhhhhhhhk..',
  '..khkwkhhkwkhk..',
  '..khkwkhhkwkhk..',
  '.kkkkkkkkkkkkkk.',
  'k.kbbbbkkbbbbk.k',
  '.kkbBBbkkbBBbkk.',
  '..kbbbbkkbbbbk..',
  'k.kbbBbkkbBbbk.k',
  '.kkbbbbkkbbbbkk.',
  '..kbBbbkkbbBbk..',
  'k..kbbbkkbbbk..k',
  '.k..kkkkkkkk..k.',
  '..k..........k..',
];
