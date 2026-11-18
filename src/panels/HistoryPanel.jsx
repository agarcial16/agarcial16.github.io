import Window from '../components/Window.jsx';
import { education, languages } from '../data/cv.js';

export default function HistoryPanel() {
  return (
    <div className="panel-stack">
      <Window title="Historia · Formación">
        <ol className="timeline">
          {education.map((e) => (
            <li key={e.title} className={e.current ? 'is-current' : ''}>
              <span className="emblem"><img src={e.logo} alt={`Logo de ${e.org}`} loading="lazy" /></span>
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
      <Window title="Idiomas">
        <dl className="stats">
          {languages.map((l) => [<dt key={l.name}>{l.name}</dt>, <dd key={l.name + 'd'}>{l.level}</dd>])}
        </dl>
      </Window>
    </div>
  );
}
