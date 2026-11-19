import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { TILE, W, H, BUILDINGS, START, NPC, CHEST, LEVER, BRIDGE, BUSHES, world, cellAt, ground } from './map.js';
import { drawMap, drawChest, drawBridge, drawLever, drawBush, buildSprites, windowRects, ANGEL, ANGEL_SHAPE, VISITOR, drawCat } from './art.js';
import {
  drawAmbient, drawButterflies, drawFireflies, drawPuffs, drawSparkles, drawBubble, drawOpenDoor, drawGlint,
  dayPhase, drawDaylight, drawWindowLights, isRaining, drawRain,
} from './effects.js';
import { play, jingle, setTheme, setSound, setMusic, loadPreference, loadMusicPreference, resumeOnGesture, stopAll, setRain } from './sound.js';
import { OBJECTIVES, loadJournal, saveJournal, isComplete, loadWorld, saveWorld } from './journal.js';
import { useI18n, LangToggle } from '../i18n/index.jsx';
import { ENEMIES } from './battle/data.js';

// El combate se descarga solo al entrar en la cueva.
const Battle = lazy(() => import('./battle/Battle.jsx'));
const Interior = lazy(() => import('./Interior.jsx'));
const CAVE_KEY = 'pueblo-cueva';
const loadCave = () => { try { return JSON.parse(localStorage.getItem(CAVE_KEY) ?? '[]'); } catch { return []; } };
import { track } from '../lib/analytics.js';
import { feedKonami, isRetro, quantize } from '../lib/gameboy.js';

const STEP_MS = 150;
const BRIDGE_MS = 450;
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const KEYS = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right',
};
const ACTION_KEYS = new Set(['Enter', ' ', 'z', 'Z', 'e', 'E']);
const LIGHTS = BUILDINGS.flatMap(windowRects);

// El indicador muestra la tecla que se usa: Enter con teclado, A con la cruceta táctil.
const touchFirst = () => window.matchMedia?.('(pointer: coarse)').matches;
const isWideConsole = () => window.innerWidth >= 1000 && !window.matchMedia('(pointer: coarse)').matches;
const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const ENTER_MS = { open: 140, fade: 260, done: 520 };
const FADE_IN_MS = 380;

// Escala entera para que los píxeles se vean nítidos; en pantallas estrechas la cámara sigue al visitante.
function useViewport(ref) {
  const [vp, setVp] = useState({ scale: 2, w: W * TILE, h: H * TILE });
  useEffect(() => {
    const fit = () => {
      // Descuenta la carcasa de la consola: horizontal en escritorio, vertical en móvil.
      const wide = isWideConsole();
      const avail = (ref.current?.clientWidth ?? window.innerWidth) - (wide ? 32 + 376 : 16 + 20 + 16);
      const availH = window.innerHeight - (wide ? 225 : 390);
      const scale = Math.max(2, Math.min(4, Math.floor(avail / (W * TILE)), Math.floor(availH / (H * TILE))));
      setVp({
        scale,
        w: Math.min(W * TILE, Math.floor(avail / scale)),
        h: Math.min(H * TILE, Math.max(10 * TILE, Math.floor(availH / scale))),
      });
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (ref.current) ro.observe(ref.current);
    window.addEventListener('resize', fit);
    return () => { ro.disconnect(); window.removeEventListener('resize', fit); };
  }, [ref]);
  return vp;
}

// Cierra con Esc y devuelve el foco al elemento anterior al cerrar.
function useModalKeys(onClose, focusRef) {
  useEffect(() => {
    const prev = document.activeElement;
    focusRef.current?.focus();
    const key = (e) => { if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); onClose(); } };
    window.addEventListener('keydown', key, true);
    return () => { window.removeEventListener('keydown', key, true); prev?.focus?.(); };
  }, [onClose, focusRef]);
}

export default function Town({ places, onMenu }) {
  const { t, cv, lang } = useI18n();
  const T = t.town;
  const profile = cv.profile;
  const tRef = useRef(T);
  tRef.current = T;
  const name = (b) => T.buildings[b.id].name;

  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const vp = useViewport(wrapRef);
  const [prompt, setPrompt] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [place, setPlace] = useState(null);
  const [sound, setSoundState] = useState(loadPreference);
  const [musicOn, setMusicState] = useState(loadMusicPreference);
  const [touch, setTouch] = useState(touchFirst);
  const [journal, setJournal] = useState(loadJournal);
  const [showJournal, setShowJournal] = useState(false);
  const [toast, setToast] = useState(null);
  const [ending, setEnding] = useState(false);
  const [battle, setBattle] = useState(null);
  const [interior, setInterior] = useState(null);
  const [defeated, setDefeated] = useState(loadCave);
  const defeatedRef = useRef(defeated);
  defeatedRef.current = defeated;
  const journalRef = useRef(journal);
  journalRef.current = journal;
  const phaseRef = useRef(dayPhase());
  const rainingRef = useRef(isRaining());

  useEffect(() => {
    const key = () => setTouch(false);
    const pointer = (e) => setTouch(e.pointerType === 'touch');
    window.addEventListener('keydown', key);
    window.addEventListener('pointerdown', pointer);
    // La luz cambia con la hora del visitante; se revisa cada minuto.
    // La música también: de noche suena la nana. Y la lluvia de madrugada.
    const syncTheme = () => { if (!document.querySelector('.battle')) setTheme(phaseRef.current === 'night' ? 'night' : 'day'); };
    syncTheme();
    setRain(rainingRef.current);
    const clock = setInterval(() => {
      phaseRef.current = dayPhase();
      syncTheme();
      const raining = isRaining();
      if (raining !== rainingRef.current) { rainingRef.current = raining; setRain(raining); }
    }, 60_000);
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('pointerdown', pointer); clearInterval(clock); };
  }, []);

  useEffect(() => {
    // El puente y el cofre abierto se recuerdan entre visitas, igual que el diario.
    const saved = loadWorld();
    world.bridge = saved.bridge; world.leverFound = saved.bridge; world.searched = new Set();
    game.current.leverT0 = saved.bridge ? 1 : 0;
    game.current.chestOpen = journalRef.current.done.includes('cv');
    // El gato de Mi casa acompaña al visitante si ya lo adoptó.
    game.current.cat = journalRef.current.done.includes('gato')
      ? { x: START.x - 1, y: START.y, dir: 'down', from: null, t: 0 }
      : null;
    const off = resumeOnGesture();
    return () => { off(); stopAll(); };
  }, []);

  const toggleSound = () => {
    const on = !sound;
    setSoundState(on);
    setSound(on).then(() => on && play('on'));
  };
  const toggleMusic = () => { const on = !musicOn; setMusicState(on); setMusic(on); };

  // ---- Diario de misiones ----
  const complete = useCallback((id) => {
    setJournal((j) => {
      if (j.done.includes(id)) return j;
      const next = { ...j, done: [...j.done, id] };
      saveJournal(next);
      return next;
    });
  }, []);

  const prevDone = useRef(journal.done);
  const pendingEnding = useRef(false);
  useEffect(() => {
    const added = journal.done.filter((id) => !prevDone.current.includes(id));
    prevDone.current = journal.done;
    if (!added.length) return;
    jingle('quest');
    setToast(added[added.length - 1]);
    // Si el visitante acaba de adoptar al gato, este aparece a su lado.
    if (added.includes('gato') && !game.current.cat) {
      const s = game.current;
      const spot = [[0, 1], [1, 0], [-1, 0], [0, -1]].find(([dx, dy]) => !cellAt(s.x + dx, s.y + dy));
      if (spot) game.current.cat = { x: s.x + spot[0], y: s.y + spot[1], dir: 'down', from: null, t: 0 };
    }
    if (isComplete(journal) && !journal.ended) pendingEnding.current = true;
  }, [journal]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  // El final aparece al cerrar el cofre o el edificio que completa el diario.
  useEffect(() => {
    if (!pendingEnding.current || dialog || place) return;
    pendingEnding.current = false;
    const next = { ...journalRef.current, ended: true };
    saveJournal(next);
    setJournal(next);
    setEnding(true);
    jingle('fanfare');
    track('partida-completada');
    // La medalla cuenta los extras: el gato adoptado, el arma forjada y la cueva limpia.
    if (journalRef.current.done.includes('gato') && journalRef.current.done.includes('forja') && defeatedRef.current.length === ENEMIES.length) track('medalla-exploracion');
  }, [dialog, place, journal]);

  const resetJournal = () => {
    const fresh = { done: [], ended: false };
    // Empezar de nuevo también esconde la palanca, retira el puente, cierra el cofre
    // y devuelve el gato a su cama.
    saveWorld({ bridge: false });
    world.bridge = false; world.leverFound = false;
    Object.assign(game.current, { leverT0: 0, chestOpen: false, chestT0: 0, rustle: null, cat: null });
    // Si estaba en el puente o en la isla, vuelve a la plaza para no quedarse en el agua.
    const s = game.current;
    if (['water', 'island'].includes(ground[s.y]?.[s.x])) Object.assign(s, { x: START.x, y: START.y, dir: START.dir, from: null });
    prevDone.current = [];
    saveJournal(fresh);
    setJournal(fresh);
  };

  const objectiveLabel = (id) => (id === 'cv' ? T.journal.cv : id === 'cave' ? T.battle.extra : id === 'gato' ? T.journal.cat : id === 'forja' ? T.journal.forge : T.journal.visit(T.buildings[id].name));

  const game = useRef({
    x: START.x, y: START.y, dir: START.dir, from: null, t: 0, step: 0,
    held: [], tap: null, paused: false, chestOpen: false, chestT0: 0, talked: false, puffs: [], leverT0: 0,
    anim: reduceMotion() ? null : { kind: 'fadein', t0: performance.now() },
  });
  game.current.paused = Boolean(dialog || place || showJournal || ending || battle || interior);

  const openPlace = useCallback((b) => { setPlace(b); complete(b.id); }, [complete]);

  // Entrar en un edificio: la puerta se abre, el visitante entra y la pantalla funde a negro.
  // Desde los atajos (o con movimiento reducido) se entra directamente.
  const enter = useCallback((b, { instant = false } = {}) => {
    const s = game.current;
    s.held = []; s.tap = null;
    if (instant || reduceMotion()) {
      s.from = null;
      s.anim = { kind: 'enter', b, t0: 0, done: true };
      play('page');
      openPlace(b);
    } else {
      s.anim = { kind: 'enter', b, t0: performance.now() };
      play('door-open');
    }
  }, [openPlace]);

  const leave = useCallback(() => {
    const s = game.current;
    const b = s.anim?.b;
    if (b) { s.x = b.door.x; s.y = b.door.y + 1; s.dir = 'down'; s.from = null; }
    // El gato espera junto a la puerta: se le coloca en la primera casilla pisable vecina.
    if (s.cat && b) {
      Object.assign(s.cat, { from: null, t: 0, dir: 'down' });
      const spot = [[0, 1], [1, 0], [-1, 0], [0, -1]].find(([dx, dy]) => !cellAt(s.x + dx, s.y + dy));
      if (spot) { s.cat.x = s.x + spot[0]; s.cat.y = s.y + spot[1]; }
    }
    s.anim = reduceMotion() ? null : { kind: 'fadein', b, t0: performance.now() };
    if (b) play('door-close');
    setPlace(null);
  }, []);

  const startBattle = useCallback(() => {
    const s = game.current;
    s.held = []; s.tap = null;
    const next = ENEMIES.find((e) => !defeatedRef.current.includes(e.id));
    if (!next) { setDialog({ speaker: tRef.current.battle.title, lines: [tRef.current.battle.cleared] }); return; }
    setTheme('battle');
    setBattle(next);
  }, []);

  const endBattle = useCallback((result) => {
    const foe = battle;
    setBattle(null);
    setTheme(phaseRef.current === 'night' ? 'night' : 'day');
    if (result !== 'win' || !foe) return;
    track(`combate-${foe.id}`);
    setDefeated((d) => {
      const next = d.includes(foe.id) ? d : [...d, foe.id];
      try { localStorage.setItem(CAVE_KEY, JSON.stringify(next)); } catch { /* sin almacenamiento */ }
      if (next.length === ENEMIES.length) setToast('cave');
      return next;
    });
  }, [battle]);

  const interact = useCallback(() => {
    const s = game.current;
    const tx = tRef.current;
    if (s.paused || s.from || s.anim?.kind === 'enter') return;
    const [dx, dy] = DIRS[s.dir];
    const cell = cellAt(s.x + dx, s.y + dy);
    s.held = [];
    if (cell?.kind === 'door') enter(cell.building);
    else if (cell?.kind === 'cave') startBattle();
    else if (cell?.kind === 'npc') {
      s.talked = true;
      play('talk');
      const lines = isComplete(journalRef.current) ? tx.hostDone : s.leverT0 ? tx.hostAfter : tx.host;
      setDialog({ speaker: profile.name.split(' ')[0], lines });
    } else if (cell?.kind === 'sign') {
      play('page');
      const { sign } = cell;
      setDialog(sign.welcome
        ? { speaker: tx.name, lines: tx.welcomeSign }
        : sign.cave ? { speaker: tx.battle.sign[0], lines: [tx.battle.sign[1]] }
        : { speaker: tx.buildings[sign.building].name, lines: [tx.buildings[sign.building].sign] });
    } else if (cell?.kind === 'bush') {
      play('rustle');
      s.rustle = { index: cell.index, t0: performance.now() };
      if (cell.lever) { world.leverFound = true; setDialog({ speaker: tx.bush, lines: tx.leverFound }); }
      else {
        world.searched.add(cell.index);
        setDialog({ speaker: tx.bush, lines: tx.bushLines[cell.index % tx.bushLines.length] });
      }
    } else if (cell?.kind === 'lever') {
      if (s.leverT0) return setDialog({ speaker: tx.lever, lines: tx.leverDone });
      s.leverT0 = performance.now();
      saveWorld({ bridge: true });
      play('lever'); setTimeout(() => play('bridge'), 350);
      setDialog({ speaker: tx.lever, lines: tx.leverLines });
    } else if (cell?.kind === 'chest') {
      if (!s.chestOpen) { s.chestOpen = true; s.chestT0 = performance.now(); play('chest'); setTimeout(() => play('item'), 180); }
      complete('cv');
      setDialog({ speaker: tx.chest, lines: tx.chestLines, action: { label: t.downloadCvPdf, href: profile.cvPdf } });
    }
  }, [enter, complete, startBattle, profile, t]);

  // Bucle de juego: movimiento casilla a casilla con interpolación y animaciones de ambiente.
  useEffect(() => {
    const canvas = canvasRef.current;
    const g = canvas.getContext('2d');
    const map = drawMap();
    const visitor = buildSprites(VISITOR);
    const host = buildSprites(ANGEL, ANGEL_SHAPE);
    const still = reduceMotion();
    let raf, last = performance.now(), lastPrompt = undefined;

    const frame = (now) => {
      const s = game.current;
      const dt = Math.min(50, now - last); last = now;
      const anim = s.anim;
      let fade = 0;

      if (anim?.kind === 'enter' && !anim.done) {
        const k = now - anim.t0;
        if (k >= ENTER_MS.open && !anim.walked) {
          anim.walked = true;
          s.dir = 'up'; s.from = { x: s.x, y: s.y }; s.y -= 1; s.t = 0;
        }
        fade = Math.min(1, Math.max(0, (k - ENTER_MS.fade) / (ENTER_MS.done - ENTER_MS.fade)));
        if (k >= ENTER_MS.done) { anim.done = true; setInterior(anim.b); complete(anim.b.id); }
      } else if (anim?.kind === 'enter') {
        fade = 1;
      } else if (anim?.kind === 'fadein') {
        const k = (now - anim.t0) / FADE_IN_MS;
        fade = Math.max(0, 1 - k);
        if (k >= 1.4) s.anim = null;
      }

      if (s.from) {
        s.t += dt / STEP_MS;
        if (s.t >= 1) {
          // El gato pisará la casilla que deja libre el visitante.
          if (s.cat) {
            const c = s.cat;
            const dx = s.from.x - c.x, dy = s.from.y - c.y;
            c.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
            c.from = { x: c.x, y: c.y }; c.x = s.from.x; c.y = s.from.y; c.t = 0;
          }
          s.from = null; s.t = 0; s.step++;
          play('step');
          if (!still && ground[s.y]?.[s.x] === 'path') s.puffs.push({ x: s.x * TILE, y: s.y * TILE, t0: now });
        }
      }
      if (s.cat?.from) {
        s.cat.t += dt / STEP_MS;
        if (s.cat.t >= 1) { s.cat.from = null; s.cat.t = 0; }
      }
      const want = s.held[s.held.length - 1] ?? s.tap;
      if (!s.from && !s.paused && s.anim?.kind !== 'enter' && want) {
        s.tap = null;
        s.dir = want;
        const [dx, dy] = DIRS[s.dir];
        const cell = cellAt(s.x + dx, s.y + dy);
        if (cell?.kind === 'door') enter(cell.building);
        else if (cell?.kind === 'cave') startBattle();
        else if (!cell) { s.from = { x: s.x, y: s.y }; s.x += dx; s.y += dy; s.t = 0; }
        else if (now - (s.bumpAt ?? 0) > 280) { s.bumpAt = now; play('bump'); }
      }

      const fx = s.from ? s.from.x + (s.x - s.from.x) * s.t : s.x;
      const fy = s.from ? s.from.y + (s.y - s.from.y) * s.t : s.y;
      const camX = Math.round(Math.max(0, Math.min(W * TILE - canvas.width, fx * TILE + 8 - canvas.width / 2)));
      const camY = Math.round(Math.max(0, Math.min(H * TILE - canvas.height, fy * TILE + 8 - canvas.height / 2)));
      const time = still ? 0 : now;
      const phase = phaseRef.current;

      g.clearRect(0, 0, canvas.width, canvas.height);
      g.drawImage(map, -camX, -camY);
      if (!still) drawAmbient(g, time, camX, camY);
      const doorB = anim?.b && (anim.kind === 'enter' || now - anim.t0 < FADE_IN_MS * 0.8) ? anim.b : null;
      if (doorB && (anim.kind === 'fadein' || now - anim.t0 >= ENTER_MS.open * 0.5 || anim.done)) drawOpenDoor(g, doorB, camX, camY);
      // Puente: se tiende tablón a tablón al tirar de la palanca y se puede pisar al terminar.
      const bridge = !s.leverT0 ? 0 : still ? BRIDGE.length : Math.min(BRIDGE.length, Math.max(0, (now - s.leverT0 - 400) / BRIDGE_MS));
      if (bridge >= BRIDGE.length) world.bridge = true;
      drawBridge(g, bridge, camX, camY);
      if (world.leverFound) drawLever(g, LEVER.x * TILE - camX, LEVER.y * TILE - camY, Boolean(s.leverT0));
      BUSHES.forEach(([bx, by], i) => {
        const isLever = bx === LEVER.x && by === LEVER.y;
        const k = s.rustle?.index === i ? (now - s.rustle.t0) / 400 : 1;
        const shake = k < 1 && !still ? Math.round(Math.sin(k * Math.PI * 6) * 2 * (1 - k)) : 0;
        // El arbusto de la palanca se aparta a un lado al descubrirla.
        if (isLever && world.leverFound) { if (k < 1) drawBush(g, bx * TILE - camX + Math.round(k * 10), by * TILE - camY, 0); return; }
        drawBush(g, bx * TILE - camX, by * TILE - camY, shake);
      });
      drawChest(g, CHEST.x * TILE - camX, CHEST.y * TILE - camY, s.chestOpen);
      if (!s.chestOpen && !still) drawGlint(g, time, CHEST.x * TILE - camX, CHEST.y * TILE - camY);
      drawPuffs(g, s.puffs, now, camX, camY);

      const shadow = (x, y) => { g.fillStyle = '#00000040'; g.fillRect(x + 3, y + 14, 10, 2); };
      const near = Math.abs(s.x - NPC.x) + Math.abs(s.y - NPC.y);
      const hostDir = near === 1
        ? Object.keys(DIRS).find((d) => DIRS[d][0] === s.x - NPC.x && DIRS[d][1] === s.y - NPC.y)
        : still ? NPC.dir : ['left', 'down', 'right', 'down'][Math.floor(time / 2400) % 4];
      const hostX = NPC.x * TILE - camX, hostY = NPC.y * TILE - camY;
      const actors = [
        {
          y: NPC.y,
          draw: () => {
            shadow(hostX, hostY);
            g.drawImage(host[hostDir][0], hostX, hostY - 2 - (Math.floor(time / 520) % 2));
            if (!s.talked && near <= 3 && !s.paused) drawBubble(g, hostX, hostY - 2, time);
          },
        },
        {
          y: fy,
          draw: () => {
            if (anim?.kind === 'enter' && anim.done) return;
            const hx = Math.round(fx * TILE) - camX, hy = Math.round(fy * TILE) - camY;
            const f = s.from ? (s.t < 0.5 ? 1 + (s.step % 2) : 0) : 0;
            shadow(hx, hy);
            g.drawImage(visitor[s.dir][f], hx, hy - 2 - (f ? 1 : 0));
          },
        },
      ];
      if (s.cat) {
        const catX = s.cat.from ? s.cat.from.x + (s.cat.x - s.cat.from.x) * s.cat.t : s.cat.x;
        const catY = s.cat.from ? s.cat.from.y + (s.cat.y - s.cat.from.y) * s.cat.t : s.cat.y;
        const bx = Math.round(catX * TILE) - camX, by = Math.round(catY * TILE) - camY;
        actors.push({
          y: catY,
          draw: () => {
            shadow(bx, by);
            drawCat(g, bx, by, s.cat.dir, s.cat.from ? 1 + (s.step % 2) : 0, time);
          },
        });
      }
      actors.sort((a, b) => a.y - b.y).forEach((a) => a.draw());
      const raining = rainingRef.current;
      if (!still && phase !== 'night' && !raining) drawButterflies(g, time, camX, camY);

      // Luz del día: tinte según la hora, ventanas encendidas al anochecer y luciérnagas de noche.
      drawDaylight(g, phase, canvas.width, canvas.height);
      if (phase === 'night' || phase === 'dusk') drawWindowLights(g, LIGHTS, camX, camY, time);
      if (phase === 'night' && !still) drawFireflies(g, time, camX, camY);
      // Lluvia de madrugada: cielo más gris y gotas por toda la pantalla.
      if (raining) {
        g.fillStyle = 'rgba(24, 34, 66, 0.16)';
        g.fillRect(0, 0, canvas.width, canvas.height);
        if (!still) drawRain(g, time, canvas.width, canvas.height);
      }
      drawSparkles(g, s.chestT0, now, camX, camY);

      if (fade > 0) { g.fillStyle = `rgba(5, 8, 38, ${fade.toFixed(3)})`; g.fillRect(0, 0, canvas.width, canvas.height); }
      if (isRetro()) quantize(g, canvas.width, canvas.height);

      // Indicación contextual (solo cambia el estado de React cuando cambia el texto).
      let p = null;
      if (!s.from && !s.paused && s.anim?.kind !== 'enter') {
        const [dx, dy] = DIRS[s.dir];
        const cell = cellAt(s.x + dx, s.y + dy);
        const P = tRef.current.prompts;
        if (cell && P[cell.kind]) p = cell.kind === 'door' ? `${P.door}: ${tRef.current.buildings[cell.building.id].name}` : P[cell.kind];
      }
      if (p !== lastPrompt) { lastPrompt = p; setPrompt(p); }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [vp, enter, complete, startBattle]);

  // Teclado
  useEffect(() => {
    const down = (e) => {
      if (e.target.closest?.('input, textarea, select')) return;
      const s = game.current;
      if (s.paused) return;
      const dir = KEYS[e.key];
      if (dir) {
        e.preventDefault();
        if (!s.held.includes(dir)) s.held.push(dir);
        if (!e.repeat) s.tap = dir; // una pulsación corta cuenta aunque se suelte antes del siguiente fotograma
      } else if (ACTION_KEYS.has(e.key) && !e.repeat && !e.target.closest?.('a, button')) {
        e.preventDefault();
        interact();
      } else if ((e.key === 'j' || e.key === 'J') && !e.repeat) {
        s.held = [];
        setShowJournal(true);
      } else if (e.key === 'Escape') {
        onMenu();
      }
    };
    const up = (e) => {
      const dir = KEYS[e.key];
      if (dir) game.current.held = game.current.held.filter((d) => d !== dir);
    };
    const blur = () => { game.current.held = []; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, [interact, onMenu]);

  // Botones de la consola: cruceta, A (acción), B (atrás), SELECT (diario) y START (menú).
  const press = (dir) => (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    feedKonami(dir);
    if (battle || interior) { window.dispatchEvent(new CustomEvent('battle-input', { detail: dir })); return; }
    game.current.held = [dir];
    game.current.tap = dir;
  };
  const pressA = () => {
    feedKonami('a');
    if (battle || interior) return window.dispatchEvent(new CustomEvent('battle-input', { detail: 'a' }));
    if (dialog) return;
    interact();
  };
  const pressB = () => {
    feedKonami('b');
    if (battle || interior) window.dispatchEvent(new CustomEvent('battle-input', { detail: 'b' }));
    else if (dialog) setDialog(null);
    else if (showJournal) setShowJournal(false);
    else if (ending) setEnding(false);
  };
  const release = () => { game.current.held = []; };

  const Panel = place && places[place.panel]?.Panel;
  // El gato es un extra: no cuenta para el total de objetivos del diario.
  const doneCount = journal.done.filter((id) => OBJECTIVES.includes(id)).length;
  const closeDialog = useCallback(() => setDialog(null), []);
  const closeJournal = useCallback(() => setShowJournal(false), []);
  const closeEnding = useCallback(() => setEnding(false), []);

  return (
    <div className="town" ref={wrapRef}>
      <div className="stars" aria-hidden="true" />
      <header className="town-bar" style={{ width: vp.w * vp.scale }}>
        <h1 className="town-title">{T.name}</h1>
        <div className="town-actions">
          <button type="button" className={`btn ${isComplete(journal) ? 'btn-done' : ''}`} onClick={() => setShowJournal(true)}>
            {T.journal.button} {doneCount}/{OBJECTIVES.length}
          </button>
          <button type="button" className="btn" aria-pressed={sound} onClick={toggleSound}>{T.sound}: {sound ? T.on : T.off}</button>
          {sound && <button type="button" className="btn" aria-pressed={musicOn} onClick={toggleMusic}>{T.music}: {musicOn ? T.on : T.off}</button>}
          <LangToggle />
          <button type="button" className="btn" onClick={onMenu}>{T.menu} <span className="muted small">(Esc)</span></button>
        </div>
      </header>

      <div className="console">
        <div className="console-screen">
          <p className="console-label" aria-hidden="true"><span className="console-led" /> {T.name}</p>
          <div className="town-frame">
            <canvas
              ref={canvasRef}
              className="town-canvas"
              width={vp.w}
              height={vp.h}
              style={{ width: vp.w * vp.scale, height: vp.h * vp.scale }}
              role="img"
              aria-label={T.canvas}
            />
            {toast && (
              <p className="town-toast" role="status">
                <span className="hl">{T.journal.done}</span> {objectiveLabel(toast)}
              </p>
            )}
            {prompt && !dialog && !place && !showJournal && !ending && !battle && !interior && (
              <button type="button" className="town-prompt" onClick={interact}>
                <span className="town-key">{touch ? 'A' : 'Enter'}</span> {prompt}
              </button>
            )}
            {dialog && <TownDialog {...dialog} T={T} onClose={closeDialog} />}
            {interior && (
              <Suspense fallback={null}>
                <Interior
                  building={interior} T={T} width={vp.w} height={vp.h} scale={vp.scale}
                  catGone={journal.done.includes('gato')}
                  onPetCat={() => { complete('gato'); track('gato-adoptado'); }}
                  forged={journal.done.includes('forja')}
                  onForgeDone={() => { complete('forja'); track('forja-completada'); }}
                  onView={() => { setInterior(null); setPlace(interior); }}
                  onExit={() => { setInterior(null); leave(); }}
                />
              </Suspense>
            )}
            {battle && (
              <Suspense fallback={null}>
                <Battle key={battle.id} enemy={battle} lang={lang} T={T} width={vp.w} height={vp.h} scale={vp.scale} forged={journal.done.includes('forja')} onEnd={endBattle} />
              </Suspense>
            )}
          </div>
        </div>

        <div className="console-dpad" aria-hidden="true">
          {['up', 'left', 'right', 'down'].map((d) => (
            <button key={d} type="button" tabIndex={-1} className={`pad pad-${d}`} onPointerDown={press(d)} onPointerUp={release} onPointerCancel={release} onContextMenu={(e) => e.preventDefault()}>
              {{ up: '▲', down: '▼', left: '◀', right: '▶' }[d]}
            </button>
          ))}
          <span className="pad-center" />
        </div>
        <div className="console-ab" aria-hidden="true">
          <button type="button" tabIndex={-1} className="pad-round pad-b" onClick={pressB}>B</button>
          <button type="button" tabIndex={-1} className="pad-round pad-a" onClick={pressA}>A</button>
        </div>
        <div className="console-meta" aria-hidden="true">
          <button type="button" tabIndex={-1} className="pad-pill" onClick={() => setShowJournal(true)}><span />SELECT</button>
          <button type="button" tabIndex={-1} className="pad-pill" onClick={onMenu}><span />START</button>
        </div>
      </div>

      <p className="town-help muted small">{T.help} <a href="https://kenney.nl" target="_blank" rel="noreferrer">Kenney</a> (CC0)</p>
      <nav className="town-shortcuts" aria-label={T.shortcuts}>
        <span className="muted small">{T.shortcutsLabel}</span>
        {BUILDINGS.map((b) => (
          <button key={b.id} type="button" className="btn btn-small" onClick={() => enter(b, { instant: true })}>{name(b)}</button>
        ))}
      </nav>

      {Panel && <PlaceSheet title={name(place)} hint={T.buildings[place.id].hint} exit={T.exit} Panel={Panel} onClose={leave} />}
      {showJournal && (
        <Journal
          T={T} journal={journal} label={objectiveLabel} cave={defeated.length}
          cat={journal.done.includes('gato')} forge={journal.done.includes('forja')}
          onReset={resetJournal} onClose={closeJournal}
        />
      )}
      {ending && (
        <Ending
          T={T} t={t} profile={profile} onClose={closeEnding}
          medal={journal.done.includes('gato') && journal.done.includes('forja') && defeated.length === ENEMIES.length}
        />
      )}
    </div>
  );
}

function TownDialog({ speaker, lines, action, T, onClose }) {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(() => (reduceMotion() ? Infinity : 0));
  const line = lines[i];
  const typing = shown < line.length;
  const last = i === lines.length - 1;
  const next = useCallback(() => {
    if (typing) return setShown(Infinity);
    if (last) return onClose();
    play('select');
    setI((n) => n + 1);
    setShown(reduceMotion() ? Infinity : 0);
  }, [typing, last, onClose]);

  useEffect(() => {
    if (!typing) return;
    const timer = setTimeout(() => { if (shown % 3 === 0 && line[shown] !== ' ') play('blip'); setShown((n) => n + 1); }, 18);
    return () => clearTimeout(timer);
  }, [typing, shown, line]);
  const ref = useRef(null);
  useEffect(() => ref.current?.focus(), []);

  useEffect(() => {
    const key = (e) => {
      if (e.repeat) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); onClose(); }
      else if (ACTION_KEYS.has(e.key) && !e.target.closest?.('a')) { e.preventDefault(); next(); }
    };
    window.addEventListener('keydown', key, true);
    return () => window.removeEventListener('keydown', key, true);
  }, [next, onClose]);

  return (
    <div className="win town-dialog" role="dialog" aria-label={speaker}>
      <span className="dialog-speaker">{speaker}</span>
      <p className="town-dialog-text">
        <span className="sr-only" aria-live="polite">{line}</span>
        <span aria-hidden="true">{line.slice(0, shown)}<span className="dialog-ghost">{line.slice(shown)}</span></span>
      </p>
      <div className="town-dialog-actions">
        {last && !typing && action && <a className="btn btn-primary" href={action.href} download onClick={onClose}>{action.label}</a>}
        <button ref={ref} type="button" className="btn" onClick={next}>{typing ? T.skip : last ? T.close : T.next}</button>
      </div>
    </div>
  );
}

function PlaceSheet({ title, hint, exit, Panel, onClose }) {
  const closeRef = useRef(null);
  useModalKeys(onClose, closeRef);
  return (
    <div className="town-sheet" role="dialog" aria-modal="true" aria-labelledby="place-title">
      <div className="town-sheet-inner">
        <header className="win town-sheet-head">
          <div>
            <h2 id="place-title" className="win-title">{title}</h2>
            <p className="muted small">{hint}</p>
          </div>
          <button ref={closeRef} type="button" className="btn" onClick={onClose}>{exit}</button>
        </header>
        <div className="panel-enter"><Panel /></div>
      </div>
    </div>
  );
}

function Journal({ T, journal, label, cave, cat, forge, onReset, onClose }) {
  const closeRef = useRef(null);
  useModalKeys(onClose, closeRef);
  const J = T.journal;
  return (
    <div className="town-modal" role="dialog" aria-modal="true" aria-labelledby="journal-title">
      <div className="win town-modal-box">
        <h2 id="journal-title" className="win-title">
          {J.title} · {journal.done.filter((id) => OBJECTIVES.includes(id)).length}/{OBJECTIVES.length}
          {isComplete(journal) && <span className="badge is-done journal-badge">✔ {J.complete}</span>}
        </h2>
        <ul className="journal">
          {OBJECTIVES.map((id) => {
            const done = journal.done.includes(id);
            return (
              <li key={id} className={done ? 'is-done' : ''}>
                <span className="journal-mark" aria-hidden="true">{done ? '✔' : '◇'}</span>
                <span>{label(id)}</span>
                <span className="sr-only">{done ? '✔' : ''}</span>
              </li>
            );
          })}
          <li className={`journal-extra ${cat ? 'is-done' : ''}`}>
            <span className="journal-mark" aria-hidden="true">🐾</span>
            <span>{J.catExtra}</span>
          </li>
          <li className={`journal-extra ${forge ? 'is-done' : ''}`}>
            <span className="journal-mark" aria-hidden="true">⚒</span>
            <span>{J.forgeExtra}</span>
          </li>
          <li className={`journal-extra ${cave === ENEMIES.length ? 'is-done' : ''}`}>
            <span className="journal-mark" aria-hidden="true">★</span>
            <span>{T.battle.extra} ({cave}/{ENEMIES.length})</span>
          </li>
        </ul>
        <div className="town-dialog-actions">
          {journal.done.length > 0 && <button type="button" className="btn" onClick={onReset}>{J.reset}</button>}
          <button ref={closeRef} type="button" className="btn btn-primary" onClick={onClose}>{T.close}</button>
        </div>
      </div>
    </div>
  );
}

function Ending({ T, t, profile, medal, onClose }) {
  const firstRef = useRef(null);
  useModalKeys(onClose, firstRef);
  const E = T.ending;
  return (
    <div className="town-modal" role="dialog" aria-modal="true" aria-labelledby="ending-title">
      <div className="win town-modal-box ending">
        <p className="ending-stars" aria-hidden="true">★ ★ ★</p>
        <h2 id="ending-title" className="ending-title">{E.title}</h2>
        <p>{E.text}</p>
        {medal && <p className="hl">🏅 {E.medal}</p>}
        <p className="hl">{E.cta}</p>
        <p className="links ending-links">
          <a ref={firstRef} className="btn btn-primary" href={`mailto:${profile.email}`}>✉ {E.email}</a>
          <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a className="btn" href={profile.cvPdf} download>{t.downloadCvPdf}</a>
          <button type="button" className="btn" onClick={onClose}>{E.keep}</button>
        </p>
      </div>
    </div>
  );
}
