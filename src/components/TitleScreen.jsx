import { useEffect, useRef } from 'react';
import { useI18n, LangToggle } from '../i18n/index.jsx';
import Logo from './Logo.jsx';

export default function TitleScreen({ onNew, onContinue }) {
  const { t, cv } = useI18n();
  const profile = cv.profile;
  const startRef = useRef(null);
  useEffect(() => startRef.current?.focus(), []);

  return (
    <main className="title-screen">
      <div className="stars" aria-hidden="true" />
      <div className="title-lang"><LangToggle /></div>
      <div className="title-logo">
        <Logo size={80} className="title-emblem" />
        <p className="title-kicker">{t.title.kicker}</p>
        <h1 className="title-name">{profile.name}</h1>
        <p className="title-role">{profile.role}</p>
      </div>

      <nav className="win title-menu" aria-label={t.title.mainMenu}>
        <button ref={startRef} type="button" className="menu-item" onClick={onNew}>
          {t.title.newGame[0]}
          <span className="menu-hint">{t.title.newGame[1]}</span>
        </button>
        <button type="button" className="menu-item" onClick={onContinue}>
          {t.title.continue[0]}
          <span className="menu-hint">{t.title.continue[1]}</span>
        </button>
        <a className="menu-item" href={profile.cvPdf} download>
          {t.downloadCvPdf}
        </a>
      </nav>

      <p className="press-start" aria-hidden="true">PRESS START</p>
      <p className="title-footer">
        © {new Date().getFullYear()} {profile.name} · {t.title.madeBy}{' '}
        <img className="footer-mark" src="brand/logo-pixel-16-jrpg.png" alt="" width="16" height="16" />Complex
      </p>
    </main>
  );
}
