import { useCallback, useEffect, useRef, useState } from 'react';
import { TILE, W, H, BUILDINGS, START, NPC, CHEST, cellAt, ground } from './map.js';
import { drawMap, drawChest, buildSprites, HERO, VISITOR } from './art.js';
import { drawAmbient, drawButterflies, drawPuffs, drawSparkles, drawBubble, drawOpenDoor } from './effects.js';
import { profile } from '../data/cv.js';

const STEP_MS = 150;
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const KEYS = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right',
};
const ACTION_KEYS = new Set(['Enter', ' ', 'z', 'Z', 'e', 'E']);

const HOST_LINES = [
  ...profile.intro,
  'Cada edificio del pueblo guarda una parte de mi historia: entra por la puerta para verla.',
  'Si tienes prisa, pulsa Esc o «Menú» y lo verás todo en la vista rápida.',
];
const SIGN_LINES = [
  'Villa Portafolio',
  BUILDINGS.map((b) => `${b.name}: ${b.hint.toLowerCase()}`).join(' · '),
];
const CHEST_LINES = ['¡Has encontrado un pergamino!', 'Es el CV de Ángel en PDF. ¿Te lo llevas?'];

const PROMPTS = { door: 'Entrar', npc: 'Hablar', sign: 'Leer', chest: 'Abrir' };

// Escala entera para que los píxeles se vean nítidos; en pantallas estrechas la cámara sigue al héroe.
function useViewport(ref) {
  const [vp, setVp] = useState({ scale: 2, w: W * TILE, h: H * TILE });
  useEffect(() => {
    const fit = () => {
      // Descuenta el relleno de la página y el marco de la ventana.
      const avail = (ref.current?.clientWidth ?? window.innerWidth) - 56;
      const touch = window.matchMedia('(pointer: coarse), (max-width: 760px)').matches;
      const availH = window.innerHeight - (touch ? 340 : 200);
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

const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const ENTER_MS = { open: 140, fade: 260, done: 520 };
const FADE_IN_MS = 380;

export default function Town({ places, onMenu }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const vp = useViewport(wrapRef);
  const [prompt, setPrompt] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [place, setPlace] = useState(null);

  const game = useRef({
    x: START.x, y: START.y, dir: START.dir, from: null, t: 0, step: 0,
    held: [], tap: null, paused: false, chestOpen: false, chestT0: 0, talked: false, puffs: [],
    anim: reduceMotion() ? null : { kind: 'fadein', t0: performance.now() },
  });
  game.current.paused = Boolean(dialog || place);

  // Entrar en un edificio: la puerta se abre, el visitante entra y la pantalla funde a negro.
  // Desde los atajos (o con movimiento reducido) se entra directamente.
  const enter = useCallback((b, { instant = false } = {}) => {
    const s = game.current;
    s.held = []; s.tap = null;
    if (instant || reduceMotion()) {
      s.from = null;
      s.anim = { kind: 'enter', b, t0: 0, done: true };
      setPlace(b);
    } else {
      s.anim = { kind: 'enter', b, t0: performance.now() };
    }
  }, []);

  const leave = useCallback(() => {
    const s = game.current;
    const b = s.anim?.b;
    if (b) { s.x = b.door.x; s.y = b.door.y + 1; s.dir = 'down'; s.from = null; }
    s.anim = reduceMotion() ? null : { kind: 'fadein', b, t0: performance.now() };
    setPlace(null);
  }, []);

  const interact = useCallback(() => {
    const s = game.current;
    if (s.paused || s.from || s.anim?.kind === 'enter') return;
    const [dx, dy] = DIRS[s.dir];
    const cell = cellAt(s.x + dx, s.y + dy);
    s.held = [];
    if (cell?.kind === 'door') enter(cell.building);
    else if (cell?.kind === 'npc') { s.talked = true; setDialog({ speaker: profile.name.split(' ')[0], lines: HOST_LINES }); }
    else if (cell?.kind === 'sign') setDialog({ speaker: 'Cartel', lines: SIGN_LINES });
    else if (cell?.kind === 'chest') {
      if (!s.chestOpen) { s.chestOpen = true; s.chestT0 = performance.now(); }
      setDialog({ speaker: 'Cofre', lines: CHEST_LINES, action: { label: 'Descargar CV (PDF)', href: profile.cvPdf } });
    }
  }, [enter]);

  // Bucle de juego: movimiento casilla a casilla con interpolación y animaciones de ambiente.
  useEffect(() => {
    const canvas = canvasRef.current;
    const g = canvas.getContext('2d');
    const map = drawMap();
    const visitor = buildSprites(VISITOR);
    const host = buildSprites(HERO);
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
        if (k >= ENTER_MS.done) { anim.done = true; setPlace(anim.b); }
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
          s.from = null; s.t = 0; s.step++;
          if (!still && ground[s.y]?.[s.x] === 'path') s.puffs.push({ x: s.x * TILE, y: s.y * TILE, t0: now });
        }
      }
      const want = s.held[s.held.length - 1] ?? s.tap;
      if (!s.from && !s.paused && s.anim?.kind !== 'enter' && want) {
        s.tap = null;
        s.dir = want;
        const [dx, dy] = DIRS[s.dir];
        const cell = cellAt(s.x + dx, s.y + dy);
        if (cell?.kind === 'door') enter(cell.building);
        else if (!cell) { s.from = { x: s.x, y: s.y }; s.x += dx; s.y += dy; s.t = 0; }
      }

      const fx = s.from ? s.from.x + (s.x - s.from.x) * s.t : s.x;
      const fy = s.from ? s.from.y + (s.y - s.from.y) * s.t : s.y;
      const camX = Math.round(Math.max(0, Math.min(W * TILE - canvas.width, fx * TILE + 8 - canvas.width / 2)));
      const camY = Math.round(Math.max(0, Math.min(H * TILE - canvas.height, fy * TILE + 8 - canvas.height / 2)));
      const time = still ? 0 : now;

      g.clearRect(0, 0, canvas.width, canvas.height);
      g.drawImage(map, -camX, -camY);
      if (!still) drawAmbient(g, time, camX, camY);
      const doorB = anim?.b && (anim.kind === 'enter' || now - anim.t0 < FADE_IN_MS * 0.8) ? anim.b : null;
      if (doorB && (anim.kind === 'fadein' || now - anim.t0 >= ENTER_MS.open * 0.5 || anim.done)) drawOpenDoor(g, doorB, camX, camY);
      drawChest(g, CHEST.x * TILE - camX, CHEST.y * TILE - camY, s.chestOpen);
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
      actors.sort((a, b) => a.y - b.y).forEach((a) => a.draw());
      if (!still) drawButterflies(g, time, camX, camY);
      drawSparkles(g, s.chestT0, now, camX, camY);

      if (fade > 0) { g.fillStyle = `rgba(5, 8, 38, ${fade.toFixed(3)})`; g.fillRect(0, 0, canvas.width, canvas.height); }

      // Indicación contextual (solo cambia el estado de React cuando cambia el texto).
      let p = null;
      if (!s.from && !s.paused && s.anim?.kind !== 'enter') {
        const [dx, dy] = DIRS[s.dir];
        const cell = cellAt(s.x + dx, s.y + dy);
        if (cell && PROMPTS[cell.kind]) p = cell.kind === 'door' ? `${PROMPTS.door}: ${cell.building.name}` : PROMPTS[cell.kind];
      }
      if (p !== lastPrompt) { lastPrompt = p; setPrompt(p); }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [vp, enter]);

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

  // Cruceta táctil
  const press = (dir) => (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    game.current.held = [dir];
    game.current.tap = dir;
  };
  const release = () => { game.current.held = []; };

  const Panel = place && places[place.panel]?.Panel;

  return (
    <div className="town" ref={wrapRef}>
      <div className="stars" aria-hidden="true" />
      <header className="town-bar" style={{ width: vp.w * vp.scale }}>
        <h1 className="town-title">Villa Portafolio</h1>
        <div className="town-actions">
          <button type="button" className="btn" onClick={onMenu}>Menú <span className="muted small">(Esc)</span></button>
        </div>
      </header>

      <div className="win town-frame">
        <canvas
          ref={canvasRef}
          className="town-canvas"
          width={vp.w}
          height={vp.h}
          style={{ width: vp.w * vp.scale, height: vp.h * vp.scale }}
          role="img"
          aria-label="Pueblo explorable. Usa los atajos de debajo para ir directamente a cada edificio."
        />
        {prompt && !dialog && !place && (
          <button type="button" className="town-prompt" onClick={interact}>
            <span className="town-key">A</span> {prompt}
          </button>
        )}
        {dialog && <TownDialog {...dialog} onClose={() => setDialog(null)} />}
      </div>

      <div className="town-pad" aria-hidden="true">
        {['up', 'left', 'right', 'down'].map((d) => (
          <button key={d} type="button" tabIndex={-1} className={`pad pad-${d}`} onPointerDown={press(d)} onPointerUp={release} onPointerCancel={release} onContextMenu={(e) => e.preventDefault()}>
            {{ up: '▲', down: '▼', left: '◀', right: '▶' }[d]}
          </button>
        ))}
        <button type="button" tabIndex={-1} className="pad pad-a" onClick={interact}>A</button>
      </div>

      <p className="town-help muted small">Flechas o WASD para moverte · Enter o Espacio para interactuar</p>
      <nav className="town-shortcuts" aria-label="Atajos a los edificios">
        <span className="muted small">Atajos:</span>
        {BUILDINGS.map((b) => (
          <button key={b.id} type="button" className="btn btn-small" onClick={() => enter(b, { instant: true })}>{b.name}</button>
        ))}
      </nav>

      {Panel && <PlaceSheet building={place} Panel={Panel} onClose={leave} />}
    </div>
  );
}

function TownDialog({ speaker, lines, action, onClose }) {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(() => (reduceMotion() ? Infinity : 0));
  const line = lines[i];
  const typing = shown < line.length;
  const last = i === lines.length - 1;
  const next = useCallback(() => {
    if (typing) return setShown(Infinity);
    if (last) return onClose();
    setI((n) => n + 1);
    setShown(reduceMotion() ? Infinity : 0);
  }, [typing, last, onClose]);

  useEffect(() => {
    if (!typing) return;
    const t = setTimeout(() => setShown((n) => n + 1), 18);
    return () => clearTimeout(t);
  }, [typing, shown]);
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
        <button ref={ref} type="button" className="btn" onClick={next}>{typing ? 'Saltar' : last ? 'Cerrar' : 'Siguiente ▼'}</button>
      </div>
    </div>
  );
}

function PlaceSheet({ building, Panel, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    const key = (e) => { if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); onClose(); } };
    window.addEventListener('keydown', key, true);
    return () => { window.removeEventListener('keydown', key, true); prev?.focus?.(); };
  }, [onClose]);

  return (
    <div className="town-sheet" role="dialog" aria-modal="true" aria-labelledby="place-title">
      <div className="town-sheet-inner">
        <header className="win town-sheet-head">
          <div>
            <h2 id="place-title" className="win-title">{building.name}</h2>
            <p className="muted small">{building.hint}</p>
          </div>
          <button ref={closeRef} type="button" className="btn" onClick={onClose}>Salir ✕</button>
        </header>
        <div className="panel-enter"><Panel /></div>
      </div>
    </div>
  );
}
