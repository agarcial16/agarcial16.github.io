import Window from '../components/Window.jsx';
import ProjectCover from '../components/ProjectCover.jsx';
import { experience, projects } from '../data/cv.js';

function QuestBadge({ state }) {
  const map = { 'en curso': ['⚔', 'En curso', 'is-active'], completada: ['✔', 'Completada', 'is-done'] };
  const [icon, label, cls] = map[state] ?? map.completada;
  return <span className={`badge ${cls}`}><span aria-hidden="true">{icon}</span> {label}</span>;
}

export default function QuestsPanel() {
  return (
    <div className="panel-stack">
      <Window title="Misiones de gremio · Experiencia">
        <ol className="quests">
          {experience.map((q) => (
            <li key={q.title} className="quest quest-org">
              <span className="emblem"><img src={q.logo} alt={`Logo de ${q.org}`} loading="lazy" /></span>
              <div>
                <header className="quest-head">
                  <h3>{q.title} <span className="muted">· {q.org}</span></h3>
                  <span className="period">{q.period}</span>
                </header>
                <ul className="bullets">{q.points.map((p) => <li key={p}>{p}</li>)}</ul>
                <p className="reward"><span className="hl">Recompensa:</span> {q.reward}</p>
              </div>
            </li>
          ))}
        </ol>
      </Window>

      <Window title="Misiones de grupo · Proyectos">
        <ol className="quests">
          {projects.map((q) => (
            <li key={q.name} className="quest quest-project">
              <ProjectCover thumb={q.thumb} art={q.art} name={q.name} />
              <div>
              <header className="quest-head">
                <h3>{q.name}</h3>
                <QuestBadge state={q.state} />
              </header>
              {q.party && <p className="muted small">{q.party}</p>}
              <p>{q.summary}</p>
              {q.points.length > 0 && <ul className="bullets">{q.points.map((p) => <li key={p}>{p}</li>)}</ul>}
              <ul className="chips">{q.stack.map((s) => <li key={s}>{s}</li>)}</ul>
              {q.links.length > 0 && (
                <p className="links">
                  {q.links.map((l) => <a key={l.href} className="btn" href={l.href} target="_blank" rel="noreferrer">{l.label} ↗</a>)}
                </p>
              )}
              </div>
            </li>
          ))}
        </ol>
      </Window>
    </div>
  );
}
