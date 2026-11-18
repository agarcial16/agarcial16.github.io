import Window from '../components/Window.jsx';
import { useI18n } from '../i18n/index.jsx';

export default function HistoryPanel() {
  const { t, cv } = useI18n();
  const { education, languages } = cv;
  return (
    <div className="panel-stack">
      <Window title={t.history.title}>
        <ol className="timeline">
          {education.map((e) => (
            <li key={e.period} className={e.current ? 'is-current' : ''}>
              <span className="emblem"><img src={e.logo} alt={t.quests.logoAlt(e.org)} loading="lazy" /></span>
              <div>
                <h3>{e.title}</h3>
                <p className="muted">{e.org}</p>
                {e.detail && <p className="small">{e.detail}</p>}
              </div>
              <span className="period">{e.period}</span>
            </li>
          ))}
        </ol>
      </Window>
      <Window title={t.history.languages}>
        <dl className="stats">
          {languages.map((l) => [<dt key={l.name}>{l.name}</dt>, <dd key={l.name + 'd'}>{l.level}</dd>])}
        </dl>
      </Window>
    </div>
  );
}
