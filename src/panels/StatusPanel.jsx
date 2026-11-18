import Window from '../components/Window.jsx';
import DialogBox from '../components/DialogBox.jsx';
import { useI18n } from '../i18n/index.jsx';
import { getLevel } from '../lib/level.js';

export default function StatusPanel() {
  const { t, cv } = useI18n();
  const profile = cv.profile;
  const s = t.status;
  const { level, progress, daysLeft } = getLevel();
  return (
    <div className="panel-stack">
      <Window className="status">
        <div className="status-avatar">
          <img className="photo" src={profile.photo} alt={s.photoAlt(profile.name)} width="128" height="128" />
        </div>
        <div className="status-main">
          <h1 className="status-name">{profile.name}</h1>
          <dl className="stats">
            <dt>{s.stats[0]}</dt><dd>{profile.title}</dd>
            <dt>{s.stats[1]}</dt><dd>{profile.role}</dd>
            <dt>{s.stats[2]}</dt><dd><span className="hl">{t.lvl} {level}</span></dd>
            <dt>{s.stats[3]}</dt><dd>{profile.location}</dd>
            <dt>{s.stats[4]}</dt><dd><span className="ok">● {profile.status}</span></dd>
          </dl>
          <div className="exp" title={s.expTitle(daysLeft, level + 1)}>
            <span className="exp-label">EXP</span>
            <span className="bar"><span className="bar-fill" style={{ width: `${Math.round(progress * 100)}%` }} /></span>
            <span className="exp-next">{s.expNext(level + 1, daysLeft)}</span>
          </div>
        </div>
      </Window>

      <DialogBox key={t.langName} speaker={profile.name.split(' ')[0]} lines={profile.intro} label={s.nextLine} />

      <Window title={s.highlights}>
        <ul className="highlights">
          {profile.highlights.map((h) => (
            <li key={h.label}>
              <a href={`#${h.to}`}>
                <span className="hl-icon" aria-hidden="true">{h.icon}</span>
                <span className="hl-label">{h.label}</span>
                <span className="muted small">{h.detail}</span>
              </a>
            </li>
          ))}
        </ul>
      </Window>
    </div>
  );
}
