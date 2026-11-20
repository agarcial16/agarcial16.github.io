// Modo developer: se activa (y desactiva) escribiendo DEV con el teclado.
// Toda la web pasa a una estética de terminal: fósforo verde, tipografía
// monoespaciada, scanlines y diálogos con cursor parpadeante. Igual que el
// modo Game Boy, queda guardado en el navegador y solo hay uno activo.
import { track } from './visitas.js';

const KEY = 'modo-developer';

// Paleta de fósforo verde, de más oscuro a más claro.
export const DEV_PALETTE = [[1, 8, 1], [7, 64, 26], [40, 204, 96], [150, 255, 178]];

export const isDev = () => document.documentElement.classList.contains('developer');

function toast(text) {
  const el = document.createElement('p');
  el.className = 'gb-toast';
  el.setAttribute('role', 'status');
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

// Falso arranque de terminal al activar el modo.
function boot() {
  const en = document.documentElement.lang === 'en';
  const lines = en
    ? ['> loading modules......... OK', '> mounting village........ OK', '> compiling CV............ OK', '> DEVELOPER mode enabled']
    : ['> cargando módulos....... OK', '> montando la villa...... OK', '> compilando el CV....... OK', '> modo DEVELOPER activado'];
  const el = document.createElement('div');
  el.className = 'dev-boot';
  el.setAttribute('role', 'status');
  lines.forEach((line, i) => {
    const p = document.createElement('p');
    p.textContent = line;
    p.style.animationDelay = `${i * 0.3}s`;
    el.appendChild(p);
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), lines.length * 300 + 2100);
}

function apply(on) {
  document.documentElement.classList.toggle('developer', on);
  try { localStorage.setItem(KEY, on ? '1' : '0'); } catch { /* sin almacenamiento */ }
  // Solo una estética retro a la vez: el modo developer retira el de Game Boy.
  if (on) {
    document.documentElement.classList.remove('gameboy');
    try { localStorage.setItem('modo-gameboy', '0'); } catch { /* sin almacenamiento */ }
  }
}

// Se vigila lo último tecleado: cualquier «dev» escrito en la web activa o desactiva.
let typed = '';

export function initDevMode() {
  try { if (localStorage.getItem(KEY) === '1') document.documentElement.classList.add('developer'); } catch { /* sin almacenamiento */ }
  window.addEventListener('keydown', (e) => {
    if (e.repeat || e.target.closest?.('input, textarea')) return;
    const k = e.key.length === 1 ? e.key.toLowerCase() : '';
    if (!/^[a-z]$/.test(k)) return;
    typed = (typed + k).slice(-3);
    if (typed !== 'dev') return;
    typed = '';
    const on = !isDev();
    apply(on);
    if (on) { boot(); track('modo-developer'); }
    else toast(document.documentElement.lang === 'en' ? 'Back to the pixel UI' : 'De vuelta a los píxeles');
  });
}
