import Window from '../components/Window.jsx';
import { useI18n } from '../i18n/index.jsx';

export default function InnPanel() {
  const { t, cv } = useI18n();
  const profile = cv.profile;
  return (
    <div className="panel-stack">
      <Window title={t.inn.title}>
        <p>{t.inn.text}</p>
        <ul className="contact">
          <li><span className="slot">{t.inn.email}</span><a href={`mailto:${profile.email}`}>{profile.email}</a></li>
          <li><span className="slot">LinkedIn</span><a href={profile.linkedin} target="_blank" rel="noreferrer">in/agarcialopezlira ↗</a></li>
          <li><span className="slot">GitHub</span><a href={profile.github} target="_blank" rel="noreferrer">agarcial16 ↗</a></li>
        </ul>
        <p className="links">
          <a className="btn btn-primary" href={profile.cvPdf} download>{t.downloadCvPdf}</a>
          <a className="btn" href={`mailto:${profile.email}`}>{t.inn.send}</a>
        </p>
      </Window>
    </div>
  );
}
