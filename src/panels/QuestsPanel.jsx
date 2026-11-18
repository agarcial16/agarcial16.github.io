import Window from '../components/Window.jsx';
import ProjectCover from '../components/ProjectCover.jsx';
import { useI18n } from '../i18n/index.jsx';

function QuestBadge({ state, t }) {
  const map = { 'en curso': ['⚔', t.active, 'is-active'], completada: ['✔', t.done, 'is-done'] };
  const [icon, label, cls] = map[state] ?? map.completada;
  return <span className={`badge ${cls}`}><span aria-hidden="true">{icon}</span> {label}</span>;
}

export default function QuestsPanel() {
  const { t: all, cv } = useI18n();
  const t = all.quests;
  const { experience, projects } = cv;
  return (
    <div className="panel-stack">
      <Window title={t.guild}>
        <ol className="quests">
          {experience.map((q) => (
            <li key={q.period} className="quest quest-org">
              <span className="emblem"><img src={q.logo} alt={t.logoAlt(q.org)} loading="lazy" /></span>
              <div>
                <header className="quest-head">
                  <h3>{q.title} <span className="muted">· {q.org}</span></h3>
                  <span className="period">{q.period}</span>
                </header>
                <ul className="bullets">{q.points.map((p) => <li key={p}>{p}</li>)}</ul>
                <p className="reward"><span className="hl">{t.reward}</span> {q.reward}</p>
              </div>
            </li>
          ))}
        </ol>
      </Window>

      <Window title={t.party}>
        <ol className="quests">
          {projects.map((q) => (
            <li key={q.thumb ?? q.art} className="quest quest-project">
              <ProjectCover thumb={q.thumb} art={q.art} alt={t.coverAlt(q.name)} />
              <div>
              <header className="quest-head">
                <h3>{q.name}</h3>
                <QuestBadge state={q.state} t={t} />
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
