import { useEffect, useRef } from 'react';
import { profile } from '../data/cv.js';

export default function TitleScreen({ onNew, onContinue }) {
  const startRef = useRef(null);
  useEffect(() => startRef.current?.focus(), []);

  return (
    <main className="title-screen">
      <div className="stars" aria-hidden="true" />
      <div className="title-logo">
        <p className="title-kicker">Portafolio de</p>
        <h1 className="title-name">{profile.name}</h1>
        <p className="title-role">{profile.role}</p>
      </div>

      <nav className="win title-menu" aria-label="Menú principal">
        <button ref={startRef} type="button" className="menu-item" onClick={onNew}>
          Nueva partida
          <span className="menu-hint">Explora el pueblo</span>
        </button>
        <button type="button" className="menu-item" onClick={onContinue}>
          Continuar
          <span className="menu-hint">Vista rápida del CV</span>
        </button>
        <a className="menu-item" href={profile.cvPdf} download>
          Descargar CV (PDF)
        </a>
      </nav>

      <p className="press-start" aria-hidden="true">PRESS START</p>
      <p className="title-footer">© {new Date().getFullYear()} {profile.name}</p>
    </main>
  );
}
