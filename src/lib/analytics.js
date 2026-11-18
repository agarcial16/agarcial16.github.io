// Estadísticas de visitas con GoatCounter: sin cookies y sin datos personales.
// Se activa al rellenar CODE con el código de la cuenta (https://<CODE>.goatcounter.com).
const CODE = '';

const enabled = () => CODE && !['localhost', '127.0.0.1'].includes(window.location.hostname);

function count(path, event = false) {
  if (!enabled()) return;
  const send = () => window.goatcounter?.count?.({ path, title: path, event });
  if (window.goatcounter?.count) send();
  else (window.__gcQueue ??= []).push(send);
}

// Pantalla actual como ruta: /titulo, /estado, /pueblo…
const screen = () => `/${window.location.hash.slice(1) || 'titulo'}`;

export function initAnalytics() {
  if (!enabled()) return;
  window.goatcounter = { no_onload: true };
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.dataset.goatcounter = `https://${CODE}.goatcounter.com/count`;
  script.onload = () => { (window.__gcQueue ?? []).forEach((f) => f()); window.__gcQueue = []; };
  document.head.appendChild(script);

  count(screen());
  window.addEventListener('hashchange', () => count(screen()));
  // Cualquier descarga del CV, venga de donde venga (menú, posada, cofre o final).
  document.addEventListener('click', (e) => {
    const link = e.target.closest?.('a[download]');
    if (link) count(`cv-${document.documentElement.lang}`, true);
  });
}

// Hitos del juego: partida completada, combate ganado, modo Game Boy…
export const track = (name) => count(name, true);
