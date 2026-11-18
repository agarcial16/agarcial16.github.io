// Captura la web (escritorio y móvil) para el comparador antes/después.
// Uso: npm run snapshot -- <nombre-paso> [url]
// Requiere el servidor de Vite levantado (npm run dev). Usa el Chrome instalado.
// Guarda .review/snapshots/<paso>/<desktop|mobile>-<pantalla>.jpg (carpeta ignorada por git).
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const step = process.argv[2];
const url = process.argv[3] ?? 'http://localhost:5173/';
if (!step) { console.error('Falta el nombre del paso, p. ej. 00-original'); process.exit(1); }

const outDir = `.review/snapshots/${step}`;
mkdirSync(outDir, { recursive: true });

const viewports = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true },
};

// Pantallas a capturar: nombre y hash de la URL.
const screens = [
  ['titulo', ''],
  ['estado', '#estado'],
  ['habilidades', '#habilidades'],
  ['misiones', '#misiones'],
  ['historia', '#historia'],
  ['posada', '#posada'],
];

const browser = await chromium.launch({ channel: 'chrome' });
for (const [name, vp] of Object.entries(viewports)) {
  const { width, height, ...rest } = vp;
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'reduce', ...rest });
  for (const [screen, hash] of screens) {
    await page.goto('about:blank');
    await page.goto(url + hash, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // Recorre la página por si hay animaciones de aparición y vuelve arriba.
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += height / 2) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(100);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    const file = `${outDir}/${name}-${screen}.jpg`;
    await page.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 70 });
    console.log(file);
  }
  await page.close();
}
await browser.close();
