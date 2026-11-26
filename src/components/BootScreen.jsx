// Arranque estilo consola: el logo de Complex (pixel JRPG) se enciende de gris a
// azul, aparece el nombre y desaparece hacia la pantalla de título, como el logo
// de un estudio al encender una consola. Una vez por sesión, se salta con tecla
// o clic y respeta el movimiento reducido.
import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/index.jsx';
import Logo from './Logo.jsx';

const KEY = 'pueblo-boot';
const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const yaArranco = () => { try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; } };

export default function BootScreen() {
  const { t } = useI18n();
  const [state, setState] = useState(() => (yaArranco() ? 'off' : 'boot'));

  // Un segundo largo de logo y fundido; con movimiento reducido, directo y breve.
  useEffect(() => {
    if (state !== 'boot') return;
    const t0 = setTimeout(() => setState('out'), reduceMotion() ? 350 : 1500);
    return () => clearTimeout(t0);
  }, [state]);

  // Al terminar el fundido se marca la sesión y el overlay desaparece.
  useEffect(() => {
    if (state !== 'out') return;
    const t0 = setTimeout(() => {
      try { sessionStorage.setItem(KEY, '1'); } catch { /* sin almacenamiento */ }
      setState('off');
    }, 480);
    return () => clearTimeout(t0);
  }, [state]);

  // Cualquier tecla o clic salta el arranque.
  useEffect(() => {
    if (state !== 'boot') return;
    const saltar = () => setState('out');
    window.addEventListener('keydown', saltar);
    window.addEventListener('pointerdown', saltar);
    return () => { window.removeEventListener('keydown', saltar); window.removeEventListener('pointerdown', saltar); };
  }, [state]);

  if (state === 'off') return null;

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
