import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import TitleScreen from './components/TitleScreen.jsx';
import StatusPanel from './panels/StatusPanel.jsx';
import SkillsPanel from './panels/SkillsPanel.jsx';
import QuestsPanel from './panels/QuestsPanel.jsx';
import HistoryPanel from './panels/HistoryPanel.jsx';
import InnPanel from './panels/InnPanel.jsx';
import { useI18n, LangToggle } from './i18n/index.jsx';
import { getLevel } from './lib/level.js';

// El pueblo se carga aparte para que la vista rápida no pague su peso.
const Town = lazy(() => import('./town/Town.jsx'));

const MENU = [
  { id: 'estado', Panel: StatusPanel },
  { id: 'habilidades', Panel: SkillsPanel },
  { id: 'misiones', Panel: QuestsPanel },
  { id: 'historia', Panel: HistoryPanel },
  { id: 'posada', Panel: InnPanel },
];

const TOWN = 'pueblo';
const PLACES = Object.fromEntries(MENU.map((m) => [m.id, m]));

const idFromHash = () => {
  const id = window.location.hash.slice(1);
  return id === TOWN || MENU.some((m) => m.id === id) ? id : null;
};

export default function App() {
  const { t, cv } = useI18n();
  const profile = cv.profile;
  const [active, setActive] = useState(idFromHash);
  const itemRefs = useRef([]);

  useEffect(() => {
    const onHash = () => setActive(idFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const open = (id) => {
    if (window.location.hash !== `#${id}`) window.location.hash = id;
    setActive(id);
  };

  // Vuelta a la portada: pantalla de inicio con el emblema y el titulo.
  const goHome = () => {
    if (!window.location.hash) return;
    window.history.pushState(null, '', `${window.location.pathname}${window.location.search}`);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  };

  if (!active) return <TitleScreen onNew={() => open(TOWN)} onContinue={() => open('estado')} />;
  if (active === TOWN) {
    return (
      <Suspense fallback={<p className="town-loading">{t.loadingTown}</p>}>
        <Town places={PLACES} onMenu={() => open('estado')} onHome={goHome} />
      </Suspense>
    );
  }

  // Flechas arriba/abajo (o izquierda/derecha en móvil) mueven el cursor del menú.
  const onMenuKey = (e) => {
    const delta = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!delta) return;
    e.preventDefault();
    const i = MENU.findIndex((m) => m.id === active);
    const next = (i + delta + MENU.length) % MENU.length;
    open(MENU[next].id);
    itemRefs.current[next]?.focus();
  };

  const current = MENU.find((m) => m.id === active);
  const { level } = getLevel();

  return (
    <div className="game">
      <div className="stars" aria-hidden="true" />
      <aside className="sidebar">
        <nav className="win menu" aria-label={t.sections} onKeyDown={onMenuKey}>
          <button type="button" className="menu-item menu-home" onClick={goHome}>
            {t.home}
            <span className="menu-hint">{t.homeHint}</span>
          </button>
          {MENU.map((m, i) => (
            <button
              key={m.id}
              ref={(el) => (itemRefs.current[i] = el)}
              type="button"
              className="menu-item"
              aria-current={m.id === active ? 'page' : undefined}
              tabIndex={m.id === active ? 0 : -1}
              onClick={() => open(m.id)}
            >
              {t.menu[m.id][0]}
              <span className="menu-hint">{t.menu[m.id][1]}</span>
            </button>
          ))}
          <LangToggle className="btn btn-small menu-lang" />
        </nav>
        <div className="win party">
          <p className="party-name">{profile.name.split(' ').slice(0, 2).join(' ')}</p>
          <p className="muted small">{t.lvl} {level} · {profile.title}</p>
          <a className="btn btn-primary btn-block" href={profile.cvPdf} download>{t.downloadCv}</a>
          <a className="btn btn-block" href={`#${TOWN}`}>{t.exploreTown}</a>
          <LangToggle className="btn btn-block" />
        </div>
      </aside>

      <main className="content" aria-labelledby="panel-title">
        <h2 id="panel-title" className="sr-only">{t.menu[current.id][0]}</h2>
        <div key={current.id} className="panel-enter">
          <current.Panel />
        </div>
      </main>
    </div>
  );
}
