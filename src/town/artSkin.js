// Selector de skin para sprites y mapa del pueblo: lee ?sprites= una sola vez al importar.
// El arte por defecto es el de Gemini Neon; el clásico de Opus queda en ?sprites=opus.
import * as opus from './art.js';
import { BUG_SPRITE as OPUS_BUG_SPRITE } from './battle/data.js';
import * as neon from './neon/mapart.js';

const isOpus = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('sprites') === 'opus';
const activo = isOpus ? { ...opus, BUG_SPRITE: OPUS_BUG_SPRITE } : neon;

export const {
  drawMap,
  drawWater,
  drawChest,
  drawBridge,
  drawLever,
  drawBush,
  drawCave,
  buildSprites,
  windowRects,
  HERO,
  VISITOR,
  ANGEL,
  ANGEL_SHAPE,
  drawCat,
  BUG_SPRITE,
} = activo;
