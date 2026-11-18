// Modo Game Boy: se activa (y desactiva) con el código Konami ↑↑↓↓←→←→ B A.
// La interfaz cambia a la paleta de 4 verdes y el pueblo se reduce a esos 4 tonos.
import { track } from './analytics.js';

const KEY = 'modo-gameboy';
const CODE = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];
const FROM_KEY = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', b: 'b', B: 'b', a: 'a', A: 'a' };

// Paleta DMG, de más oscuro a más claro.
export const GB_PALETTE = [[15, 56, 15], [48, 98, 48], [139, 172, 15], [155, 188, 15]];

let progress = 0;
const listeners = new Set();

export const isGameBoy = () => document.documentElement.classList.contains('gameboy');

function apply(on) {
  document.documentElement.classList.toggle('gameboy', on);
  try { localStorage.setItem(KEY, on ? '1' : '0'); } catch { /* sin almacenamiento */ }
  listeners.forEach((fn) => fn(on));
}

export function onGameBoyChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

function toast(text) {
  const el = document.createElement('p');
  el.className = 'gb-toast';
  el.setAttribute('role', 'status');
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

// Avanza en el código con una tecla o un botón de la consola ('up', 'b', 'a'…).
export function feedKonami(input) {
  progress = input === CODE[progress] ? progress + 1 : input === CODE[0] ? 1 : 0;
  if (progress < CODE.length) return;
  progress = 0;
  const on = !isGameBoy();
  apply(on);
  const en = document.documentElement.lang === 'en';
  toast(on ? (en ? 'Game Boy mode on!' : '¡Modo Game Boy activado!') : (en ? 'Back to color' : 'De vuelta al color'));
  if (on) track('gameboy');
}

export function initGameBoy() {
  try { if (localStorage.getItem(KEY) === '1') document.documentElement.classList.add('gameboy'); } catch { /* sin almacenamiento */ }
  window.addEventListener('keydown', (e) => {
    if (e.repeat || e.target.closest?.('input, textarea')) return;
    const input = FROM_KEY[e.key];
    if (input) feedKonami(input); else progress = 0;
  });
}

// Reduce una imagen de canvas a los 4 verdes según su luminosidad.
export function quantize(ctx, w, h) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const l = 0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2];
    const c = GB_PALETTE[l < 60 ? 0 : l < 115 ? 1 : l < 175 ? 2 : 3];
    d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2];
  }
  ctx.putImageData(img, 0, 0);
}
