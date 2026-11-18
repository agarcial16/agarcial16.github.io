import Window from '../components/Window.jsx';
import DialogBox from '../components/DialogBox.jsx';
import { profile } from '../data/cv.js';
import { getLevel } from '../lib/level.js';

export default function StatusPanel() {
  const { level, progress, daysLeft } = getLevel();
  return (
    <div className="panel-stack">
      <Window className="status">
        <div className="status-avatar">
          <img className="photo" src={profile.photo} alt={`Foto de ${profile.name}`} width="128" height="128" />
        </div>
        <div className="status-main">
          <h1 className="status-name">{profile.name}</h1>
          <dl className="stats">
            <dt>Clase</dt><dd>{profile.title}</dd>
            <dt>Oficio</dt><dd>{profile.role}</dd>
            <dt>Nivel</dt><dd><span className="hl">Nv. {level}</span></dd>
            <dt>Lugar</dt><dd>{profile.location}</dd>
            <dt>Estado</dt><dd><span className="ok">● {profile.status}</span></dd>
          </dl>
          <div className="exp" title={`Faltan ${daysLeft} días para el nivel ${level + 1}`}>
            <span className="exp-label">EXP</span>
            <span className="bar"><span className="bar-fill" style={{ width: `${Math.round(progress * 100)}%` }} /></span>
            <span className="exp-next">Nv. {level + 1} en {daysLeft} días</span>
          </div>
        </div>
      </Window>

      <DialogBox speaker={profile.name.split(' ')[0]} lines={profile.intro} />

      <Window title="Hazañas destacadas">
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
