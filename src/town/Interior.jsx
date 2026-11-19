import { useEffect, useRef, useState } from 'react';
import { drawInterior, HOSTS } from './interior.js';
import { buildSprites, VISITOR } from './art.js';
import { play } from './sound.js';
import { isRetro, quantize } from '../lib/gameboy.js';

const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Sala de un edificio: el anfitrión saluda y ofrece ver la sección del CV o volver al pueblo.
// En Mi casa se puede acariciar al gato de la cama: despierta y se une al visitante.
export default function Interior({ building, T, width, height, scale, catGone, onPetCat, onView, onExit }) {
  const canvasRef = useRef(null);
  const text = T.interior[building.id];
  const isCat = building.id === 'casa';
  // La última línea se fija al entrar: si el gato se une ahora, se ve despertarse
  // (la cama ya se redibuja vacía); en visitas posteriores, la cama ya está deshecha.
  const [catJoined] = useState(catGone);
  const lines = isCat ? [...text.lines, catJoined ? T.interior.catOut : T.interior.catWake] : text.lines;
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(() => (reduceMotion() ? Infinity : 0));
  const line = lines[i];
  const typing = shown < line.length;
  const last = i === lines.length - 1;
  const canPet = isCat && !catJoined && i === lines.length - 2 && !typing;
  const pet = () => {
    play('meow');
    onPetCat?.();
    play('select');
    setI(i + 1);
    setShown(reduceMotion() ? Infinity : 0);
  };
  const viewRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const g = canvas.getContext('2d');
    const host = HOSTS[building.id] && buildSprites(HOSTS[building.id]);
    const visitor = buildSprites(VISITOR);
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
  useEffect(() => {
    const key = (e) => {
      if (e.repeat) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); onExit(); }
      else if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest?.('button')) { e.preventDefault(); e.stopImmediatePropagation(); if (last && !typing) onView(); else advance(); }
    };
    const pad = (e) => { if (e.detail === 'b') onExit(); else if (e.detail === 'a') { if (last && !typing) onView(); else advance(); } };
    window.addEventListener('keydown', key, true);
    window.addEventListener('battle-input', pad);
    return () => { window.removeEventListener('keydown', key, true); window.removeEventListener('battle-input', pad); };
  });

  return (
    <div className="interior" role="dialog" aria-modal="true" aria-label={T.buildings[building.id].name}>
      <canvas ref={canvasRef} className="town-canvas" width={width} height={height} style={{ width: width * scale, height: height * scale }} aria-hidden="true" />
      <div className="win town-dialog">
        <span className="dialog-speaker">{text.speaker}</span>
        <p className="town-dialog-text" onClick={advance}>
          <span className="sr-only" aria-live="polite">{line}</span>
          <span aria-hidden="true">{line.slice(0, shown)}<span className="dialog-ghost">{line.slice(shown)}</span></span>
        </p>
        <div className="town-dialog-actions">
          {canPet ? (
            <button type="button" className="btn btn-primary" onClick={pet}>🐾 {T.interior.pet}</button>
          ) : last && !typing ? (
            <>
              <button type="button" className="btn" onClick={onExit}>{T.exit}</button>
              <button ref={viewRef} type="button" className="btn btn-primary" onClick={onView}>{T.interior.view(T.buildings[building.id].hint)}</button>
            </>
          ) : (
            <button type="button" className="btn" onClick={advance}>{typing ? T.skip : T.next}</button>
          )}
        </div>
      </div>
    </div>
  );
}
