// Sonido del pueblo. Efectos: packs CC0 de Kenney (public/audio). Música: melodía propia
// generada con Web Audio. Desactivado por defecto; la preferencia se guarda en el navegador.
const KEY = 'pueblo-sonido';
const FILES = ['step0', 'step1', 'step2', 'step3', 'door-open', 'door-close', 'chest', 'page', 'item', 'talk', 'select', 'on', 'lever', 'bridge', 'rustle'];
const VOLUME = { step: 0.55, select: 0.6, page: 0.95, talk: 0.6, item: 0.7, chest: 0.9, 'door-open': 0.9, 'door-close': 0.85, on: 0.5, lever: 1.4, bridge: 1.2, rustle: 1 };

const MUSIC_KEY = 'pueblo-musica';
let ctx = null, sfx = null, musicGain = null, buffers = {}, loading = null, enabled = false, musicOn = true, music = null, stepIndex = 0;

export function loadPreference() {
  try { return localStorage.getItem(KEY) === '1'; } catch { return false; }
}

export function loadMusicPreference() {
  try { return localStorage.getItem(MUSIC_KEY) !== '0'; } catch { return true; }
}

export function setMusic(on) {
  musicOn = on;
  try { localStorage.setItem(MUSIC_KEY, on ? '1' : '0'); } catch { /* sin almacenamiento */ }
  if (on && enabled) startMusic(); else stopMusic();
}

function ensureContext() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  sfx = ctx.createGain(); sfx.gain.value = 0.9; sfx.connect(ctx.destination);
  musicGain = ctx.createGain(); musicGain.gain.value = 0.035; musicGain.connect(ctx.destination);
  return ctx;
}

function loadAll() {
  if (loading) return loading;
  const base = import.meta.env.BASE_URL + 'audio/';
  loading = Promise.all(FILES.map(async (name) => {
    try {
      const res = await fetch(`${base}${name}.wav`);
      buffers[name] = await ctx.decodeAudioData(await res.arrayBuffer());
    } catch { /* sin ese sonido, el juego sigue */ }
  }));
  return loading;
}

// Debe llamarse desde un gesto del usuario (clic o tecla) para que el navegador permita el audio.
export async function setSound(on) {
  enabled = on;
  try { localStorage.setItem(KEY, on ? '1' : '0'); } catch { /* sin almacenamiento */ }
  if (!on) { stopMusic(); return; }
  if (!ensureContext()) return;
  if (ctx.state === 'suspended') await ctx.resume();
  await loadAll();
  musicOn = loadMusicPreference();
  if (musicOn) startMusic();
}

// Si el visitante ya tenía el sonido activado, arranca en su primera interacción.
export function resumeOnGesture() {
  if (!loadPreference()) return () => {};
  const go = () => { setSound(true); off(); };
  const off = () => { window.removeEventListener('keydown', go); window.removeEventListener('pointerdown', go); };
  window.addEventListener('keydown', go, { once: true });
  window.addEventListener('pointerdown', go, { once: true });
  return off;
}

// Pitidos 8-bit generados al vuelo: el del texto y el golpe contra un obstáculo.
const SYNTH = {
  blip: { type: 'square', from: 880, to: 880, dur: 0.035, vol: 0.09 },
  bump: { type: 'square', from: 140, to: 70, dur: 0.08, vol: 0.18 },
};

export function play(name) {
  if (!enabled || !ctx) return;
  const tone = SYNTH[name];
  if (tone) {
    const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = tone.type;
    o.frequency.setValueAtTime(tone.from * (name === 'blip' ? 0.97 + Math.random() * 0.06 : 1), t);
    o.frequency.linearRampToValueAtTime(tone.to, t + tone.dur);
    g.gain.setValueAtTime(tone.vol, t);
    g.gain.linearRampToValueAtTime(0, t + tone.dur);
    o.connect(g).connect(sfx);
    o.start(t); o.stop(t + tone.dur + 0.01);
    return;
  }
  const key = name === 'step' ? `step${stepIndex++ % 4}` : name;
  const buf = buffers[key];
  if (!buf) return;
  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  gain.gain.value = VOLUME[name] ?? 0.5;
  src.buffer = buf;
  if (name === 'step') src.playbackRate.value = 0.95 + Math.random() * 0.1;
  src.connect(gain).connect(sfx);
  src.start();
}

export function stopAll() { stopMusic(); enabled = false; }

// ---- Música: tres bucles propios de 8 compases en corcheas (0 = silencio) ----
const THEMES = {
  // Día: Do – Lam – Fa – Sol, onda cuadrada alegre.
  day: {
    tempo: 112, lead: 'square', leadVol: 0.5, bass: 'triangle', bassVol: 0.9, bassEvery: 2,
    notes: [
      72, 76, 79, 76, 74, 76, 72, 0, 69, 72, 76, 72, 71, 72, 69, 0,
      65, 69, 72, 77, 76, 74, 72, 0, 71, 74, 79, 77, 76, 74, 71, 0,
      76, 0, 79, 0, 77, 76, 74, 72, 72, 0, 76, 0, 74, 72, 71, 69,
      69, 72, 77, 76, 74, 72, 69, 72, 71, 0, 74, 0, 79, 77, 74, 71,
    ],
    roots: [48, 45, 41, 43, 48, 45, 41, 43],
  },
  // Noche: nana en La menor, lenta y con onda triangular suave.
  night: {
    tempo: 76, lead: 'triangle', leadVol: 0.85, bass: 'sine', bassVol: 0.7, bassEvery: 4,
    notes: [
      69, 0, 72, 0, 76, 0, 72, 0, 65, 0, 69, 0, 72, 0, 77, 76,
      72, 0, 76, 0, 79, 0, 76, 0, 71, 0, 74, 0, 79, 0, 0, 0,
      76, 0, 0, 74, 72, 0, 69, 0, 72, 0, 0, 69, 65, 0, 69, 72,
      76, 0, 74, 0, 72, 0, 67, 0, 68, 0, 71, 0, 76, 0, 0, 0,
    ],
    roots: [45, 41, 48, 43, 45, 41, 48, 40],
  },
  // Combate: Mi menor rápido, arpegios y bajo en cada corchea.
  battle: {
    tempo: 152, lead: 'square', leadVol: 0.42, bass: 'triangle', bassVol: 1, bassEvery: 1,
    notes: [
      76, 79, 83, 79, 76, 79, 83, 88, 76, 79, 84, 79, 76, 79, 84, 88,
      78, 81, 86, 81, 78, 81, 86, 90, 83, 0, 83, 82, 83, 0, 75, 78,
      88, 0, 86, 0, 83, 0, 79, 81, 84, 0, 83, 0, 79, 0, 76, 79,
      81, 0, 79, 0, 78, 0, 74, 78, 75, 78, 81, 83, 87, 0, 0, 0,
    ],
    roots: [40, 36, 38, 35, 40, 36, 38, 35],
  },
};
const freq = (m) => 440 * 2 ** ((m - 69) / 12);
let theme = 'day';

// Cambia de tema (día, noche o combate); si la música está sonando, enlaza con el nuevo.
export function setTheme(name) {
  if (name === theme || !THEMES[name]) return;
  theme = name;
  if (music) { stopMusic(); startMusic(); }
}

function note(type, midi, at, dur, vol, dest = musicGain) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.value = freq(midi);
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(vol, at + 0.01);
  g.gain.setValueAtTime(vol, at + dur * 0.7);
  g.gain.linearRampToValueAtTime(0, at + dur);
  o.connect(g).connect(dest);
  o.start(at); o.stop(at + dur + 0.02);
}

function startMusic() {
  if (music || !ctx) return;
  const th = THEMES[theme];
  const eighth = 60 / th.tempo / 2;
  let step = 0, next = ctx.currentTime + 0.1;
  const tick = () => {
    while (next < ctx.currentTime + 0.3) {
      const i = step % th.notes.length;
      if (th.notes[i]) note(th.lead, th.notes[i], next, eighth * 0.9, th.leadVol);
      if (i % th.bassEvery === 0) {
        const root = th.roots[Math.floor(i / 8)];
        const fifth = th.bassEvery === 1 ? (i % 2 ? 12 : 0) : (i % (th.bassEvery * 2) ? 7 : 0);
        note(th.bass, root + fifth, next, eighth * th.bassEvery * 0.9, th.bassVol);
      }
      next += eighth; step++;
    }
  };
  tick();
  music = setInterval(tick, 100);
}

function stopMusic() {
  if (music) { clearInterval(music); music = null; }
}

// En segundo plano el navegador frena los temporizadores: se para la música y se reanuda al volver.
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopMusic();
    else if (enabled && musicOn) startMusic();
  });
}

// Melodías cortas propias: objetivo del diario cumplido y partida completada.
const JINGLES = {
  quest: [[88, 0.08], [93, 0.16]],
  fanfare: [[72, 0.12], [76, 0.12], [79, 0.12], [84, 0.3], [79, 0.12], [84, 0.5]],
};

export function jingle(name) {
  if (!enabled || !ctx) return;
  let at = ctx.currentTime + 0.02;
  for (const [midi, dur] of JINGLES[name]) {
    note('square', midi, at, dur * 0.95, 0.12, sfx);
    if (name === 'fanfare') note('triangle', midi - 24, at, dur * 0.95, 0.35, sfx);
    at += dur;
  }
}
