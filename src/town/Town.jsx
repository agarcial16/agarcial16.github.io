import { useCallback, useEffect, useRef, useState } from 'react';
import { TILE, W, H, BUILDINGS, START, NPC, CHEST, cellAt } from './map.js';
import { drawMap, drawChest, buildSprites, HERO, VISITOR } from './art.js';
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

export default function Town({ places, onMenu }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const vp = useViewport(wrapRef);
  const [prompt, setPrompt] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [place, setPlace] = useState(null);
  const [chestOpen, setChestOpen] = useState(false);

  const game = useRef({
    x: START.x, y: START.y, dir: START.dir, from: null, t: 0, step: 0,
    held: [], tap: null, paused: false, chestOpen: false,
  });
  game.current.paused = Boolean(dialog || place);
  game.current.chestOpen = chestOpen;

  const enter = useCallback((b) => { game.current.held = []; game.current.tap = null; setPlace(b); }, []);

  const interact = useCallback(() => {
    const s = game.current;
    if (s.paused || s.from) return;
    const [dx, dy] = DIRS[s.dir];
    const cell = cellAt(s.x + dx, s.y + dy);
    s.held = [];
    if (cell?.kind === 'door') enter(cell.building);
    else if (cell?.kind === 'npc') setDialog({ speaker: profile.name.split(' ')[0], lines: HOST_LINES });
    else if (cell?.kind === 'sign') setDialog({ speaker: 'Cartel', lines: SIGN_LINES });
    else if (cell?.kind === 'chest') {
      setChestOpen(true);
      setDialog({ speaker: 'Cofre', lines: CHEST_LINES, action: { label: 'Descargar CV (PDF)', href: profile.cvPdf } });
    }
  }, [enter]);

  // Bucle de juego: movimiento casilla a casilla con interpolación.
  useEffect(() => {
    const canvas = canvasRef.current;
    const g = canvas.getContext('2d');
    const map = drawMap();
    const hero = buildSprites(VISITOR);
    const host = buildSprites(HERO);
    let raf, last = performance.now(), lastPrompt = undefined;

    const frame = (now) => {
      const s = game.current;
      const dt = Math.min(50, now - last); last = now;

      if (s.from) {
        s.t += dt / STEP_MS;
        if (s.t >= 1) { s.from = null; s.t = 0; s.step++; }
      }
      const want = s.held[s.held.length - 1] ?? s.tap;
      if (!s.from && !s.paused && want) {
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

      g.clearRect(0, 0, canvas.width, canvas.height);
      g.drawImage(map, -camX, -camY);
      drawChest(g, CHEST.x * TILE - camX, CHEST.y * TILE - camY, s.chestOpen);
      const shadow = (x, y) => { g.fillStyle = '#00000040'; g.fillRect(x + 3, y + 14, 10, 2); };
      const hostDir = Math.abs(s.x - NPC.x) + Math.abs(s.y - NPC.y) === 1
        ? Object.keys(DIRS).find((d) => DIRS[d][0] === s.x - NPC.x && DIRS[d][1] === s.y - NPC.y)
        : NPC.dir;
      const actors = [
        { y: NPC.y, draw: () => { shadow(NPC.x * TILE - camX, NPC.y * TILE - camY); g.drawImage(host[hostDir][0], NPC.x * TILE - camX, NPC.y * TILE - camY - 2); } },
        {
          y: fy,
          draw: () => {
            const hx = Math.round(fx * TILE) - camX, hy = Math.round(fy * TILE) - camY;
            const f = s.from ? (s.t < 0.5 ? 1 + (s.step % 2) : 0) : 0;
            shadow(hx, hy);
            g.drawImage(hero[s.dir][f], hx, hy - 2 - (f ? 1 : 0));
          },
        },
      ];
      actors.sort((a, b) => a.y - b.y).forEach((a) => a.draw());

      // Indicación contextual (solo cambia el estado de React cuando cambia el texto).
      let p = null;
      if (!s.from && !s.paused) {
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
          <button key={b.id} type="button" className="btn btn-small" onClick={() => enter(b)}>{b.name}</button>
        ))}
      </nav>

      {Panel && <PlaceSheet building={place} Panel={Panel} onClose={() => setPlace(null)} />}
    </div>
  );
}

function TownDialog({ speaker, lines, action, onClose }) {
  const [i, setI] = useState(0);
  const last = i === lines.length - 1;
  const next = useCallback(() => (last ? onClose() : setI((n) => n + 1)), [last, onClose]);
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
      <p className="town-dialog-text" aria-live="polite">{lines[i]}</p>
      <div className="town-dialog-actions">
        {last && action && <a className="btn btn-primary" href={action.href} download onClick={onClose}>{action.label}</a>}
        <button ref={ref} type="button" className="btn" onClick={next}>{last ? 'Cerrar' : 'Siguiente ▼'}</button>
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
