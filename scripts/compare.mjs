// Genera .review/compare.html: comparador antes/después con barra deslizante.
// Uso: npm run compare            (todos los pasos de .review/snapshots)
//      npm run compare -- 00 01   (solo los pasos que empiezan por esos prefijos)
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const root = '.review/snapshots';
const filters = process.argv.slice(2);
const steps = readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory() && (!filters.length || filters.some((f) => d.name.startsWith(f))))
  .map((d) => d.name)
  .sort();

const data = {};
for (const step of steps) {
  data[step] = {};
  for (const file of readdirSync(`${root}/${step}`).filter((f) => f.endsWith('.jpg'))) {
    const [view, ...rest] = file.replace('.jpg', '').split('-');
    const screen = rest.join('-');
    (data[step][view] ??= {})[screen] = 'data:image/jpeg;base64,' + readFileSync(`${root}/${step}/${file}`).toString('base64');
  }
}

const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><style>
*{box-sizing:border-box}
body{margin:0;font-family:var(--font-sans,system-ui);color:var(--foreground,#111)}
.bar{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin-bottom:10px;font-size:13px}
.bar label{display:flex;gap:6px;align-items:center;color:var(--muted-foreground,#666)}
select{font:inherit;padding:3px 6px;border-radius:6px;border:1px solid var(--border,#ccc);background:var(--card,#fff);color:var(--foreground,#111)}
.pills{display:flex;flex-wrap:wrap;gap:6px}
.pills button{font:inherit;font-size:12.5px;padding:4px 10px;border-radius:999px;border:1px solid var(--border,#ccc);background:transparent;color:var(--foreground,#111);cursor:pointer}
.pills button[aria-pressed=true]{background:var(--primary,#333);color:var(--primary-foreground,#fff);border-color:var(--primary,#333)}
.view{height:560px;overflow:auto;border:1px solid var(--border,#ccc);border-radius:var(--radius,8px);background:#05081f}
.cmp{position:relative;display:grid;margin:0 auto;user-select:none;touch-action:pan-y;cursor:ew-resize}
.cmp.mobile{max-width:390px}
.cmp img{grid-area:1/1;width:100%;display:block;align-self:start;pointer-events:none}
.cmp .after{clip-path:inset(0 0 0 var(--pos))}
.line{position:absolute;top:0;bottom:0;left:var(--pos);width:2px;background:#ffd866;box-shadow:0 0 0 1px #000;pointer-events:none}
.tag{position:sticky;top:8px;grid-area:1/1;align-self:start;z-index:2;font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;padding:3px 8px;border-radius:999px;margin:8px;pointer-events:none}
.tag.b{justify-self:start;background:#ffe1e1;color:#a40000}
.tag.a{justify-self:end;background:#dcf7e3;color:#0b6b2b}
input[type=range]{width:100%;margin:10px 0 2px}
.hint{font-size:12px;color:var(--muted-foreground,#666)}
</style></head><body>
<div class="bar">
  <label>Antes <select id="b"></select></label>
  <label>Después <select id="a"></select></label>
  <div class="pills" id="views"></div>
</div>
<div class="bar"><div class="pills" id="screens"></div></div>
<div class="view"><div class="cmp" id="cmp" style="--pos:50%">
  <img id="ib" alt="Antes"><img id="ia" class="after" alt="Después">
  <span class="tag b">Antes</span><span class="tag a">Después</span><span class="line"></span>
</div></div>
<input type="range" id="r" min="0" max="100" value="50" aria-label="Posición de la barra">
<p class="hint">Arrastra sobre la imagen o usa la barra. Desplázate hacia abajo para ver la página entera.</p>
<script>
const DATA = ${JSON.stringify(data)};
const steps = Object.keys(DATA);
const $ = (id) => document.getElementById(id);
const st = { b: steps[Math.max(0, steps.length - 2)], a: steps[steps.length - 1], view: 'desktop', screen: null };
for (const id of ['b', 'a']) {
  $(id).innerHTML = steps.map((s) => '<option>' + s + '</option>').join('');
  $(id).value = st[id];
  $(id).onchange = (e) => { st[id] = e.target.value; render(); };
}
const pick = (step, screen) => {
  const v = DATA[step][st.view] || {};
  return v[screen] || v.pagina || v.estado || Object.values(v)[0];
};
function pills(el, items, current, set) {
  el.innerHTML = '';
  for (const [key, label] of items) {
    const b = document.createElement('button');
    b.textContent = label; b.setAttribute('aria-pressed', key === current);
    b.onclick = () => { set(key); render(); };
    el.appendChild(b);
  }
}
function render() {
  pills($('views'), [['desktop', 'Escritorio'], ['mobile', 'Móvil']], st.view, (v) => (st.view = v));
  const ORDER = ['pagina', 'titulo', 'estado', 'habilidades', 'misiones', 'historia', 'posada'];
  const rank = (k) => (ORDER.indexOf(k) + 1 || 99);
  const screens = Object.keys(DATA[st.a][st.view] || {}).sort((x, y) => rank(x) - rank(y));
  if (!screens.includes(st.screen)) st.screen = screens[0];
  pills($('screens'), screens.map((s) => [s, ({ pagina: 'Página', titulo: 'Título' })[s] || s[0].toUpperCase() + s.slice(1)]), st.screen, (s) => (st.screen = s));
  $('ib').src = pick(st.b, st.screen);
  $('ia').src = pick(st.a, st.screen);
  $('cmp').classList.toggle('mobile', st.view === 'mobile');
}
const setPos = (p) => { p = Math.max(0, Math.min(100, p)); $('cmp').style.setProperty('--pos', p + '%'); $('r').value = p; };
$('r').oninput = (e) => setPos(+e.target.value);
let drag = false;
const fromEvent = (e) => { const r = $('cmp').getBoundingClientRect(); setPos(((e.clientX - r.left) / r.width) * 100); };
$('cmp').addEventListener('pointerdown', (e) => { drag = true; fromEvent(e); });
addEventListener('pointermove', (e) => drag && fromEvent(e));
addEventListener('pointerup', () => (drag = false));
render();
</script></body></html>`;

writeFileSync('.review/compare.html', html);
console.log(`.review/compare.html (${(html.length / 1024 / 1024).toFixed(1)} MB, pasos: ${steps.join(', ')})`);
