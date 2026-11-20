// Selector de skin para los interiores: lee ?sprites= una sola vez al importar.
// Por defecto, el arte interior de Gemini Neon; el clásico de Opus queda en ?sprites=opus.
import * as opus from './interior.js';
import * as neon from './neon/interiors.js';

const isOpus = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('sprites') === 'opus';
const activo = isOpus ? opus : neon;

export const { drawInterior, drawZzz, HOSTS } = activo;
