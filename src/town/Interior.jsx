import { useEffect, useMemo, useRef, useState } from 'react';
import { drawInterior, drawZzz, HOSTS } from './interiorSkin.js';
import { buildSprites, VISITOR, HERO } from './artSkin.js';
import { play } from './sound.js';
import { dayPhase } from './effects.js';
import { isRetro, quantize } from '../lib/gameboy.js';
import { track } from '../lib/visitas.js';
import { paginasDeTexto, presupuestoDialogo } from '../lib/paginas.js';

const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Viajeros de la posada: paletas propias; se sientan tras las mesas laterales.
const GUEST_PAL = [
  { ...HERO, h: '#e8e8f0', t: '#7d3fa8', T: '#5e2a7d', b: '#c98a12', p: '#4a3a5a' },   // el bardo
  { ...HERO, h: '#3b2414', s: '#c98a5a', t: '#2e7d5b', T: '#1f5a40', b: '#ffd866', p: '#2a2a40' }, // la mercader
];

// El rumor del día: rota a diario y es distinto para cada viajero.
const dayRumor = (pool, guestIdx) => pool[(Math.floor(Date.now() / 86_400_000) + guestIdx * 2) % pool.length];

// Sala de un edificio: el anfitrión saluda y ofrece ver la sección del CV o volver al pueblo.
// En Mi casa se puede acariciar al gato de la cama: despierta y se une al visitante.
// En la posada, los viajeros de las mesas cuentan rumores sobre Ángel.
// En el taller, un bug incrustado en el yunque se extrae a martillazos con timing.
export default function Interior({ building, T, width, height, scale, catGone, forged, onPetCat, onForgeDone, onView, onExit }) {
  const canvasRef = useRef(null);
  const text = T.interior[building.id];
  const isCat = building.id === 'casa';
  const isInn = building.id === 'posada';
  const isForge = building.id === 'taller';
  const guests = isInn ? T.interior.guests : null;
  // La mercader duerme sobre la mesa de noche; el bardo nunca para de contar historias.
  const night = dayPhase() === 'night';
  const [guest, setGuest] = useState(null); // índice del viajero con el que se habla
  // La última línea se fija al entrar: si el gato se une ahora, se ve despertarse
  // (la cama ya se redibuja vacía); en visitas posteriores, la cama ya está deshecha.
  const [catJoined] = useState(catGone);
  const [forge, setForge] = useState(false); // minijuego del yunque en marcha
  const [reward, setReward] = useState(false); // el herrero entrega el arma recién forjada
  const strikeRef = useRef(null);
  const baseLines = isCat
    ? [...text.lines, catJoined ? T.interior.catOut : T.interior.catWake]
    : isForge
      ? [...text.lines, forged ? T.interior.forgeDone : T.interior.forgeIntro]
      : text.lines;
  const lines = reward ? T.interior.forgeWin
    : guest === null ? baseLines
      : [night && guest === 1 ? guests[guest].sleep : dayRumor(guests[guest].talk, guest)];
  const speaker = guest !== null ? guests[guest].name : text.speaker;
  // Paginas del dialogo: en pantallas estrechas las lineas se trocean para que el
  // recuadro quede de tamano fijo; cada pagina recuerda su linea semantica.
  const pages = useMemo(
    () => lines.flatMap((l, li) => paginasDeTexto(l, presupuestoDialogo()).map((text) => ({ li, text }))),
    [lines],
  );
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(() => (reduceMotion() ? Infinity : 0));
  const page = pages[i];
  const line = page.text;
  const typing = shown < line.length;
  const last = i === pages.length - 1;
  // Ultima pagina de su linea: aqui se ofrecen las acciones de esa linea semantica.
  const lastOfLine = i + 1 >= pages.length || pages[i + 1].li !== page.li;
  const canPet = isCat && !catJoined && page.li === lines.length - 2 && lastOfLine && !typing;
  const pet = () => {
    play('meow');
    onPetCat?.();
    play('select');
    setI(i + 1);
    setShown(reduceMotion() ? Infinity : 0);
  };
  const talkTo = (idx) => {
    play('talk');
    track('rumor-viajero');
    setGuest(idx);
    setI(0);
    setShown(reduceMotion() ? Infinity : 0);
  };
  const startForge = () => { play('select'); setForge(true); };
  const cancelForge = () => { play('select'); setForge(false); };
  const winForge = () => {
    setForge(false);
    setReward(true);
    setI(0);
    setShown(reduceMotion() ? Infinity : 0);
    play('item');
    onForgeDone?.();
  };
  const viewRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const g = canvas.getContext('2d');
    const host = HOSTS[building.id] && buildSprites(HOSTS[building.id]);
    const visitor = buildSprites(VISITOR);
    const guestSprites = isInn ? GUEST_PAL.map((pal) => buildSprites(pal)) : [];
    const still = reduceMotion();
    // La sala se dibuja a su tamaño y se amplía para llenar el hueco que deja el diálogo.
    const off = document.createElement('canvas');
    off.width = Math.min(11 * 16 + 6, canvas.width); off.height = 7 * 16 + 6;
    const o = off.getContext('2d');
    const k = Math.max(1, Math.floor(Math.min(canvas.width / off.width, (canvas.height - 74) / off.height) * 4) / 4);
    const dx = Math.round((canvas.width - off.width * k) / 2);
    let raf;
    const frame = (now) => {
      const time = still ? 0 : now;
      drawInterior(o, building.id, off.width, off.height, time, (pos) => {
        if (host) o.drawImage(host.down[0], pos.host.x, pos.host.y - (Math.floor(time / 520) % 2));
        pos.guests.forEach((gp, idx) => {
          const sleeping = night && idx === 1;
          o.drawImage(guestSprites[idx].down[0], gp.x, gp.y + (sleeping ? 2 : -(Math.floor(time / 520) % 2)));
          if (sleeping) drawZzz(o, gp.x + 4, gp.y - 2, time);
        });
        o.drawImage(visitor.up[0], pos.visitor.x, pos.visitor.y);
      }, { catGone });
      g.fillStyle = '#05060d'; g.fillRect(0, 0, canvas.width, canvas.height);
      g.imageSmoothingEnabled = false;
      g.drawImage(off, dx, 6, off.width * k, off.height * k);
      if (isRetro()) quantize(g, canvas.width, canvas.height);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [building, width, height, catGone]);

  useEffect(() => {
    if (!typing) return;
    const timer = setTimeout(() => { if (shown % 3 === 0 && line[shown] !== ' ') play('blip'); setShown((n) => n + 1); }, 18);
    return () => clearTimeout(timer);
  }, [typing, shown, line]);

  useEffect(() => { if (last && !typing) viewRef.current?.focus(); }, [last, typing]);

  const advance = () => {
    if (typing) return setShown(Infinity);
    // En Mi casa, avanzar desde la segunda línea es acariciar al gato.
    if (canPet) return pet();
    if (!last) { play('select'); setI((n) => n + 1); setShown(reduceMotion() ? Infinity : 0); }
  };

  // Enter/A avanza o entra en la sección; Esc/B vuelve al pueblo.
  // Si el minijuego de la forja está en marcha, Enter golpea y Esc lo abandona.
  useEffect(() => {
    const key = (e) => {
      if (e.repeat) return;
      if (forge) {
        if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); cancelForge(); }
        else if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest?.('button')) { e.preventDefault(); e.stopImmediatePropagation(); strikeRef.current?.(); }
        return;
      }
      if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); onExit(); }
      else if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest?.('button')) { e.preventDefault(); e.stopImmediatePropagation(); if (last && !typing) onView(); else advance(); }
    };
    const pad = (e) => {
      if (forge) { if (e.detail === 'b') cancelForge(); else if (e.detail === 'a') strikeRef.current?.(); return; }
      if (e.detail === 'b') onExit(); else if (e.detail === 'a') { if (last && !typing) onView(); else advance(); }
    };
    window.addEventListener('keydown', key, true);
    window.addEventListener('battle-input', pad);
    return () => { window.removeEventListener('keydown', key, true); window.removeEventListener('battle-input', pad); };
  });

  return (
    <div className="interior" role="dialog" aria-modal="true" aria-label={T.buildings[building.id].name}>
      <canvas ref={canvasRef} className="town-canvas" width={width} height={height} style={{ width: width * scale, height: height * scale }} aria-hidden="true" />
      {forge ? (
        <ForgeGame T={T} strikeRef={strikeRef} onWin={winForge} onCancel={cancelForge} />
      ) : (
        <div className="win town-dialog">
          <span className="dialog-speaker">{speaker}</span>
          <p className="town-dialog-text" onClick={advance}>
            <span className="sr-only" aria-live="polite">{line}</span>
            <span aria-hidden="true">{line.slice(0, shown)}<span className="dialog-ghost">{line.slice(shown)}</span></span>
          </p>
          <div className="town-dialog-actions">
            {canPet ? (
              <button type="button" className="btn btn-primary" onClick={pet}>🐾 {T.interior.pet}</button>
            ) : last && !typing ? (
              <>
                {guests && guests.map((gu, idx) => (
                  <button key={gu.name} type="button" className="btn" onClick={() => talkTo(idx)}>
                    {night && idx === 1 ? '💤' : gu.mark} {T.interior.talk(gu.name)}
                  </button>
                ))}
                {isForge && !forged && !reward && (
                  <button type="button" className="btn" onClick={startForge}>🔨 {T.interior.forgeButton}</button>
                )}
                <button type="button" className="btn" onClick={onExit}>{T.exit}</button>
                <button ref={viewRef} type="button" className="btn btn-primary" onClick={onView}>{T.interior.view(T.buildings[building.id].hint)}</button>
              </>
            ) : (
              <button type="button" className="btn" onClick={advance}>{typing ? T.skip : T.next}</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Minijuego de la forja: el martillo oscila de un lado a otro de la barra y hay que
// golpear (Enter, A o el botón) cuando cruza la zona dorada. Tres aciertos lo extraen.
// Zona y velocidad dependen solo de los golpes llevados: fallar retrocede un golpe
// y devuelve la dificultad del nivel anterior. Y si el martillo estuvo en la zona
// hace menos de FORGE_GRACE ms, el golpe cuenta: se evalúa cuándo pulsó el jugador,
// no cuándo procesó el navegador el clic o la tecla.
const FORGE_NEED = 3;
const FORGE_GRACE = 60;
const zoneOf = (h) => 0.1 * 0.82 ** h; // semiancho de la zona por golpes llevados
const speedOf = (h) => 0.0011 * 1.2 ** h; // posición por milisegundo

function ForgeGame({ T, strikeRef, onWin, onCancel }) {
  const [hits, setHits] = useState(0);
  const [msg, setMsg] = useState('');
  const [flash, setFlash] = useState(null); // 'hit' | 'miss'
  const zone = useRef(zoneOf(0));
  const speed = useRef(speedOf(0));
  const pos = useRef(0.15);
  const dir = useRef(1);
  const lastInZone = useRef(0);
  const markerRef = useRef(null);
  const zoneRef = useRef(null);
  const hitsRef = useRef(0);
  const doneRef = useRef(false);

  useEffect(() => {
    let raf, lastT = performance.now();
    const frame = (now) => {
      const dt = Math.min(50, now - lastT); lastT = now;
      pos.current += dir.current * speed.current * dt;
      if (pos.current >= 1) { pos.current = 1; dir.current = -1; }
      else if (pos.current <= 0) { pos.current = 0; dir.current = 1; }
      if (Math.abs(pos.current - 0.5) <= zone.current) lastInZone.current = now;
      if (markerRef.current) markerRef.current.style.left = `${(pos.current * 100).toFixed(2)}%`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const strike = () => {
    if (doneRef.current) return;
    const inZone = Math.abs(pos.current - 0.5) <= zone.current;
    if (inZone || performance.now() - lastInZone.current < FORGE_GRACE) {
      play('clang');
      setFlash('hit');
      hitsRef.current += 1;
      setMsg(`${T.interior.forgeHit} ${T.interior.forgeHits(hitsRef.current, FORGE_NEED)}`);
    } else {
      play('bump');
      setFlash('miss');
      hitsRef.current = Math.max(0, hitsRef.current - 1);
      setMsg(`${T.interior.forgeMiss} ${T.interior.forgeHits(hitsRef.current, FORGE_NEED)}`);
    }
    // La dificultad siempre acompaña a los golpes: sube al acertar y baja al fallar.
    zone.current = zoneOf(hitsRef.current);
    speed.current = speedOf(hitsRef.current);
    if (zoneRef.current) zoneRef.current.style.width = `${zone.current * 200}%`;
    setHits(hitsRef.current);
    if (hitsRef.current >= FORGE_NEED) {
      doneRef.current = true;
      setTimeout(onWin, 700);
    }
    setTimeout(() => setFlash(null), 300);
  };
  useEffect(() => { strikeRef.current = strike; });

  return (
    <div className="win town-dialog forge-box">
      <span className="dialog-speaker">🔨 {T.interior.forgeTitle}</span>
      <p className="small muted">{T.interior.forgeHint}</p>
      <div className={`forge-bar ${flash ?? ''}`}>
        <span ref={zoneRef} className="forge-zone" />
        <span ref={markerRef} className="forge-marker" aria-hidden="true">🔨</span>
      </div>
      <p className="small forge-status" role="status">{msg || T.interior.forgeHits(0, FORGE_NEED)}</p>
      <div className="town-dialog-actions">
        {/* pointerdown responde antes que click; detail 0 distingue el Enter sobre el boton */}
        <button type="button" className="btn btn-primary" onPointerDown={strike} onClick={(e) => e.detail === 0 && strike()}>
          {T.interior.forgeStrike} · {hits}/{FORGE_NEED}
        </button>
        <button type="button" className="btn" onClick={onCancel}>{T.exit}</button>
      </div>
    </div>
  );
}
