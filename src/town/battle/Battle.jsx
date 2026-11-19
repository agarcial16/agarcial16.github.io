import { useCallback, useEffect, useRef, useState } from 'react';
import { HERO_STATS, SKILLS, BUG_SPRITE } from './data.js';
import { buildSprites, ANGEL, ANGEL_SHAPE } from '../art.js';
import { play, jingle } from '../sound.js';
import { isRetro, quantize } from '../../lib/gameboy.js';

const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

function bugCanvas(pal) {
  const c = document.createElement('canvas'); c.width = 16; c.height = 16;
  const g = c.getContext('2d');
  BUG_SPRITE.forEach((row, y) => [...row].forEach((ch, x) => {
    if (ch !== '.') { g.fillStyle = pal[ch]; g.fillRect(x, y, 1, 1); }
  }));
  return c;
}

// Combate por turnos contra un bug. onEnd recibe 'win', 'lose' o 'run'.
// forged indica que el visitante forjó el «Refactor total» en el taller.
export default function Battle({ enemy, lang, T, width, height, scale, forged, onEnd }) {
  const B = T.battle;
  const foe = enemy[lang];
  // Sin forja no hay quinta habilidad: el arsenal la esconde.
  const skills = forged ? SKILLS : SKILLS.filter((s) => s.id !== 'refactor');
  const canvasRef = useRef(null);
  const fx = useRef({ pops: [], t0: performance.now() });
  const [hp, setHp] = useState(HERO_STATS.hp);
  const [mp, setMp] = useState(HERO_STATS.mp);
  const [ehp, setEhp] = useState(enemy.hp);
  const [coffees, setCoffees] = useState(HERO_STATS.coffees);
  const [mode, setMode] = useState('msg'); // msg | menu | skills
  const [msg, setMsg] = useState(B.appears(foe.name, enemy.boss));
  const [info, setInfo] = useState('');
  const alive = useRef(true);
  const skip = useRef(null);
  const menuRef = useRef(null);
  const stats = useRef({ hp, mp, ehp, coffees });
  stats.current = { hp, mp, ehp, coffees };

  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);

  // Espera que el jugador puede acortar con clic, Enter o A.
  const wait = (ms) => new Promise((resolve) => {
    const t = setTimeout(resolve, reduceMotion() ? Math.min(ms, 700) : ms);
    skip.current = () => { clearTimeout(t); resolve(); };
  });
  const say = async (text, ms = 1100) => { if (!alive.current) return; setMsg(text); await wait(ms); };

  // Presentación y primer turno.
  useEffect(() => {
    (async () => {
      jingle('encounter');
      await wait(1300);
      if (alive.current) setMode('menu');
    })();
  }, []);

  useEffect(() => {
    if (mode === 'menu' || mode === 'skills') menuRef.current?.querySelector('button:not(:disabled)')?.focus();
  }, [mode]);

  const enemyTurn = async () => {
    await say(`${foe.name}: ${foe.attack}`, 900);
    const dmg = rand(...enemy.atk);
    fx.current.heroHit = performance.now();
    fx.current.pops.push({ text: `-${dmg}`, who: 'hero', t0: performance.now(), color: '#ff8a8a' });
    play('hit');
    const left = Math.max(0, stats.current.hp - dmg);
    setHp(left);
    await say(B.heroHurt(dmg), 900);
    if (left <= 0) {
      jingle('lose');
      await say(B.lose, 2200);
      if (alive.current) onEnd('lose');
      return;
    }
    if (alive.current) setMode('menu');
  };

  const hitEnemy = async (dmg, color, weak) => {
    fx.current.lunge = performance.now();
    fx.current.shot = { t0: performance.now(), color };
    await wait(420);
    fx.current.enemyHit = performance.now();
    fx.current.pops.push({ text: `-${dmg}`, who: 'enemy', t0: performance.now(), color: weak ? '#ffd866' : '#ffffff' });
    play(weak ? 'crit' : 'hit');
    const left = Math.max(0, stats.current.ehp - dmg);
    setEhp(left);
    if (weak) await say(B.weak, 900);
    await say(B.damage(foe.name, dmg), 900);
    if (left <= 0) {
      fx.current.dead = performance.now();
      jingle('fanfare');
      await say(B.win(foe.name), 1500);
      await say(B.exp(enemy.exp), 1300);
      if (alive.current) onEnd('win');
      return;
    }
    await enemyTurn();
  };

  const act = async (kind, skill) => {
    setMode('msg'); setInfo('');
    if (kind === 'attack') {
      await say(B.uses(B.commands.attack), 700);
      await hitEnemy(rand(5, 7), '#ffffff', false);
    } else if (kind === 'skill') {
      if (stats.current.mp < skill.mp) { await say(B.noMp, 1000); setMode('skills'); return; }
      setMp((m) => m - skill.mp);
      play('skill');
      await say(B.uses(skill[lang].name), 700);
      // El «Refactor total» es el punto débil del jefe: le reescribe el código de raíz.
      const weak = enemy.weak === skill.id || (enemy.boss && skill.id === 'refactor');
      const dmg = (skill.power + rand(0, 3)) * (weak ? 2 : 1);
      await hitEnemy(dmg, skill.color, weak);
    } else if (kind === 'item') {
      if (!stats.current.coffees) { await say(B.noCoffee, 1000); setMode('menu'); return; }
      setCoffees((c) => c - 1);
      setHp((h) => Math.min(HERO_STATS.hp, h + 25));
      setMp((m) => Math.min(HERO_STATS.mp, m + 8));
      play('heal');
      fx.current.pops.push({ text: '+25', who: 'hero', t0: performance.now(), color: '#86f5a6' });
      await say(B.coffee, 1100);
      await enemyTurn();
    } else if (kind === 'run') {
      await say(B.ranAway, 1400);
      if (alive.current) onEnd('run');
    }
  };

  // Teclado y botones de la consola: flechas mueven el cursor, Enter/A elige, Esc/B vuelve.
  const input = useCallback((key) => {
    if (mode === 'msg') { if (key === 'a') skip.current?.(); return; }
    const buttons = [...(menuRef.current?.querySelectorAll('button:not(:disabled)') ?? [])];
    const i = buttons.indexOf(document.activeElement);
    if (key === 'up' || key === 'left') buttons[(i - 1 + buttons.length) % buttons.length]?.focus();
    else if (key === 'down' || key === 'right') buttons[(i + 1) % buttons.length]?.focus();
    else if (key === 'a') (buttons[i] ?? buttons[0])?.click();
    else if (key === 'b' && mode === 'skills') setMode('menu');
  }, [mode]);

  useEffect(() => {
    const keys = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', Enter: 'a', ' ': 'a', Escape: 'b' };
    const down = (e) => {
      const k = keys[e.key];
      if (!k || e.repeat) return;
      e.preventDefault(); e.stopImmediatePropagation();
      if (k === 'a' && mode !== 'msg') return document.activeElement?.closest?.('.battle') ? document.activeElement.click() : input('a');
      input(k);
    };
    const pad = (e) => input(e.detail);
    window.addEventListener('keydown', down, true);
    window.addEventListener('battle-input', pad);
    return () => { window.removeEventListener('keydown', down, true); window.removeEventListener('battle-input', pad); };
  }, [input, mode]);

  // Escena: cueva, plataformas, bug y Ángel, con golpes, proyectiles y números de daño.
  useEffect(() => {
    const canvas = canvasRef.current;
    const g = canvas.getContext('2d');
    const bug = bugCanvas(enemy.pal);
    const hero = buildSprites(ANGEL, ANGEL_SHAPE).left[0];
    const still = reduceMotion();
    const W = canvas.width, H = canvas.height;
    // En pantallas estrechas el menú ocupa más alto: los personajes suben un poco.
    const narrow = W < 300;
    const ex = Math.round(W * 0.3), ey = Math.round(H * (narrow ? 0.33 : 0.36));
    const hx = Math.round(W * 0.72), hy = Math.round(H * (narrow ? 0.52 : 0.6));
    const es = enemy.scale * 16, hs = 48;
    let raf;
    const frame = (now) => {
      const f = fx.current;
      const sky = g.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#120e24'); sky.addColorStop(1, '#2b2440');
      g.fillStyle = sky; g.fillRect(0, 0, W, H);
      g.fillStyle = '#0b0916';
      for (let x = 0; x < W; x += 22) { const d = 10 + ((x * 7) % 17); g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 11, d); g.lineTo(x + 22, 0); g.fill(); }
      g.fillStyle = '#3d3556';
      g.beginPath(); g.ellipse(ex, ey + es / 2 - 4, es * 0.7, 9, 0, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.ellipse(hx, hy + hs / 2 - 2, 40, 8, 0, 0, Math.PI * 2); g.fill();

      // Enemigo: parpadea si es inestable, tiembla al recibir golpe y se desvanece al caer.
      const hit = f.enemyHit ? (now - f.enemyHit) / 350 : 1;
      const dead = f.dead ? Math.min(1, (now - f.dead) / 700) : 0;
      const shake = hit < 1 && !still ? Math.round(Math.sin(hit * 30) * 3) : 0;
      const bob = still ? 0 : Math.round(Math.sin(now / 400) * 2);
      g.save();
      g.globalAlpha = (1 - dead) * (enemy.flicker && !still && Math.sin(now / 90) > 0.6 ? 0.35 : 1);
      g.imageSmoothingEnabled = false;
      if (enemy.boss && !still) { g.fillStyle = `rgba(224, 72, 72, ${0.15 + Math.sin(now / 250) * 0.08})`; g.beginPath(); g.ellipse(ex, ey, es * 0.75, es * 0.6, 0, 0, Math.PI * 2); g.fill(); }
      g.drawImage(bug, ex - es / 2 + shake, ey - es / 2 + bob, es, es);
      if (hit < 0.5) { g.globalCompositeOperation = 'source-atop'; g.fillStyle = 'rgba(255,255,255,0.7)'; g.fillRect(ex - es / 2 + shake, ey - es / 2 + bob, es, es); }
      g.restore();

      // Ángel: embiste al atacar y tiembla al recibir daño.
      const lunge = f.lunge ? (now - f.lunge) / 400 : 1;
      const dx = lunge < 1 && !still ? -Math.round(Math.sin(lunge * Math.PI) * 18) : 0;
      const hh = f.heroHit ? (now - f.heroHit) / 350 : 1;
      const hshake = hh < 1 && !still ? Math.round(Math.sin(hh * 30) * 3) : 0;
      g.imageSmoothingEnabled = false;
      g.globalAlpha = hh < 0.5 && Math.floor(now / 60) % 2 ? 0.4 : 1;
      g.drawImage(hero, hx - hs / 2 + dx + hshake, hy - hs / 2, hs, hs);
      g.globalAlpha = 1;

      // Proyectil de la habilidad: ráfaga de píxeles del color de la técnica.
      if (f.shot) {
        const k = (now - f.shot.t0) / 420;
        if (k < 1) {
          for (let i = 0; i < 5; i++) {
            const t = Math.max(0, Math.min(1, k * 1.3 - i * 0.07));
            const x = hx - 20 + (ex - hx + 20) * t, y = hy - 8 + (ey - hy + 8) * t - Math.sin(t * Math.PI) * 18;
            g.fillStyle = f.shot.color; g.fillRect(Math.round(x) - 2, Math.round(y) - 2, 4 - (i > 2 ? 1 : 0), 4 - (i > 2 ? 1 : 0));
          }
        } else f.shot = null;
      }

      // Números de daño que suben y se desvanecen.
      g.font = '8px "Press Start 2P", monospace';
      g.textAlign = 'center';
      f.pops = f.pops.filter((p) => now - p.t0 < 900);
      for (const p of f.pops) {
        const k = (now - p.t0) / 900;
        const [px, py] = p.who === 'enemy' ? [ex, ey - es / 2] : [hx, hy - hs / 2];
        g.globalAlpha = 1 - k;
        g.fillStyle = '#000'; g.fillText(p.text, px + 1, py - k * 16 + 1);
        g.fillStyle = p.color; g.fillText(p.text, px, py - k * 16);
      }
      g.globalAlpha = 1;
      if (isRetro()) quantize(g, W, H);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [enemy, width, height]);

  const pct = (v, max) => `${Math.round((v / max) * 100)}%`;
  const cmds = [
    { id: 'attack', label: B.commands.attack, info: B.attackInfo },
    { id: 'skills', label: B.commands.skills, info: '' },
    { id: 'item', label: `${B.commands.item} ×${coffees}`, info: B.itemInfo(coffees), disabled: !coffees },
    { id: 'run', label: B.commands.run, info: B.runInfo },
  ];

  return (
    <div className="battle" role="dialog" aria-modal="true" aria-label={B.title}>
      <canvas ref={canvasRef} className="town-canvas" width={width} height={height} style={{ width: width * scale, height: height * scale }} aria-hidden="true" />
      <div className="battle-foe win">
        <span>{foe.name}</span>
        <span className="battle-bar"><span style={{ width: pct(ehp, enemy.hp) }} /></span>
      </div>
      <div className="battle-hero win">
        <span>Ángel</span>
        <span className="battle-stat">{B.hp} {hp}/{HERO_STATS.hp}<span className="battle-bar"><span style={{ width: pct(hp, HERO_STATS.hp) }} /></span></span>
        <span className="battle-stat">{B.mp} {mp}/{HERO_STATS.mp}<span className="battle-bar is-mp"><span style={{ width: pct(mp, HERO_STATS.mp) }} /></span></span>
      </div>
      <div className="battle-box win" ref={menuRef}>
        {mode === 'msg' && (
          <button type="button" className="battle-msg" onClick={() => skip.current?.()} aria-live="polite">{msg}</button>
        )}
        {mode === 'menu' && (
          <>
            <div className="battle-cmds">
              {cmds.map((c) => (
                <button key={c.id} type="button" className="menu-item" disabled={c.disabled}
                  onFocus={() => setInfo(c.info)} onMouseEnter={() => setInfo(c.info)}
                  onClick={() => (c.id === 'skills' ? setMode('skills') : act(c.id))}>{c.label}</button>
              ))}
            </div>
            <p className="battle-info muted small">{info}</p>
          </>
        )}
        {mode === 'skills' && (
          <>
            <div className="battle-cmds">
              {skills.map((s) => (
                <button key={s.id} type="button" className="menu-item" disabled={mp < s.mp}
                  onFocus={() => setInfo(s[lang].info)} onMouseEnter={() => setInfo(s[lang].info)}
                  onClick={() => act('skill', s)}>
                  {s[lang].name} <span className="muted small">{s.mp} {B.mp}</span>
                </button>
              ))}
              <button type="button" className="menu-item" onFocus={() => setInfo('')} onClick={() => setMode('menu')}>{B.back}</button>
            </div>
            <p className="battle-info muted small">{info}</p>
          </>
        )}
      </div>
    </div>
  );
}
