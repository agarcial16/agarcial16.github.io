import Window from '../components/Window.jsx';
import { useI18n } from '../i18n/index.jsx';

export default function SkillsPanel() {
  const { t, cv } = useI18n();
  const { skillSchools, passives } = cv;
  return (
    <div className="panel-stack">
      <Window title={t.skills.learned}>
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
      <Window title={t.skills.passives}>
        <ul className="passives">
          {passives.map((p) => (
            <li key={p.name}><span className="hl">{p.name}</span><span>{p.text}</span></li>
          ))}
        </ul>
      </Window>
    </div>
  );
}
