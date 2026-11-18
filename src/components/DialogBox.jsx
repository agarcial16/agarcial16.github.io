import { useEffect, useState } from 'react';

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Cuadro de diálogo con texto letra a letra. Clic o tecla para avanzar/saltar.
export default function DialogBox({ speaker, lines }) {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(() => (reduceMotion() ? lines[0].length : 0));
  const line = lines[index];
  const done = shown >= line.length;

  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setShown((n) => n + 1), 22);
    return () => clearTimeout(t);
  }, [shown, done]);

  const advance = () => {
    if (!done) return setShown(line.length);
    const next = (index + 1) % lines.length;
    setIndex(next);
    setShown(reduceMotion() ? lines[next].length : 0);
  };

  return (
    <button type="button" className="win dialog" onClick={advance} aria-label="Siguiente diálogo">
      <span className="dialog-speaker">{speaker}</span>
      {/* El texto completo queda en el DOM para lectores de pantalla y buscadores. */}
      <span className="dialog-text" aria-live="polite">
        <span>{line.slice(0, shown)}</span>
        <span className="dialog-ghost" aria-hidden="true">{line.slice(shown)}</span>
      </span>
      <span className={`dialog-next ${done ? 'is-ready' : ''}`} aria-hidden="true">▼</span>
      <span className="dialog-count" aria-hidden="true">{index + 1}/{lines.length}</span>
    </button>
  );
}
