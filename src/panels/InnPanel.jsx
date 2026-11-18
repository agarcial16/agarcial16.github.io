import Window from '../components/Window.jsx';
import { profile } from '../data/cv.js';

export default function InnPanel() {
  return (
    <div className="panel-stack">
      <Window title="Posada · ¿Guardar partida?">
        <p>¿Buscas a alguien para tu equipo? Escríbeme y seguimos la aventura juntos.</p>
        <ul className="contact">
          <li><span className="slot">Correo</span><a href={`mailto:${profile.email}`}>{profile.email}</a></li>
          <li><span className="slot">LinkedIn</span><a href={profile.linkedin} target="_blank" rel="noreferrer">in/agarcialopezlira ↗</a></li>
          <li><span className="slot">GitHub</span><a href={profile.github} target="_blank" rel="noreferrer">agarcial16 ↗</a></li>
        </ul>
        <p className="links">
          <a className="btn btn-primary" href={profile.cvPdf} download>Descargar CV (PDF)</a>
          <a className="btn" href={`mailto:${profile.email}`}>✉ Enviar mensaje</a>
        </p>
      </Window>
    </div>
  );
}
