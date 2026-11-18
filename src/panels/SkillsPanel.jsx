import Window from '../components/Window.jsx';
import { skillSchools, passives } from '../data/cv.js';

export default function SkillsPanel() {
  return (
    <div className="panel-stack">
      <Window title="Técnicas aprendidas">
        <div className="schools">
          {skillSchools.map((s) => (
            <section key={s.school} className="school">
              <h3>{s.school}</h3>
              <ul className="chips">
                {s.skills.map((k) => <li key={k}>{k}</li>)}
              </ul>
            </section>
          ))}
        </div>
      </Window>
      <Window title="Habilidades pasivas">
        <ul className="passives">
          {passives.map((p) => (
            <li key={p.name}><span className="hl">{p.name}</span><span>{p.text}</span></li>
          ))}
        </ul>
      </Window>
    </div>
  );
}
