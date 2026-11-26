// Arranque de la consola al entrar al pueblo: el logo de Complex (pixel JRPG) se
// enciende de gris a azul con calma, aparece el nombre y funde hacia el juego.
// Se muestra CADA vez que se abre el pueblo (no por sesión), se salta con
// cualquier tecla o clic y respeta el movimiento reducido.
import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/index.jsx';
import Logo from './Logo.jsx';

const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const DURACION = 3200;
const FUNDIDO = 500;

export default function BootScreen({ onDone }) {
  const { t } = useI18n();
  const [state, setState] = useState('boot');

  // Encendido largo (para saborear la oleada del rombo) y apagado.
  useEffect(() => {
    if (state !== 'boot') return;
    const t0 = setTimeout(() => setState('out'), reduceMotion() ? 500 : DURACION);
    return () => clearTimeout(t0);
  }, [state]);

  // Al terminar el fundido, la consola queda en manos del juego.
  useEffect(() => {
    if (state !== 'out') return;
    const t0 = setTimeout(() => onDone?.(), FUNDIDO);
    return () => clearTimeout(t0);
  }, [state, onDone]);

  // Cualquier tecla o clic salta el arranque.
  useEffect(() => {
    if (state !== 'boot') return;
    const saltar = () => setState('out');
    window.addEventListener('keydown', saltar);
    window.addEventListener('pointerdown', saltar);
    return () => { window.removeEventListener('keydown', saltar); window.removeEventListener('pointerdown', saltar); };
  }, [state]);

  return (
    <div className={`boot ${state === 'out' ? 'is-out' : ''}`} role="status" aria-label={`Complex ${t.boot.presents}`}>
      <div className="boot-inner">
        <Logo size={160} className="boot-logo" />
        <p className="boot-brand">COMPLEX</p>
        <p className="boot-presents">{t.boot.presents}</p>
      </div>
    </div>
  );
}
