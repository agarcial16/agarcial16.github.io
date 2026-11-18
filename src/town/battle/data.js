// Combates de la Cueva de los bugs. Cada bug es débil a la técnica que lo arreglaría de verdad,
// y cada habilidad cita la experiencia del CV en la que se basa.

export const HERO_STATS = { hp: 60, mp: 20, coffees: 2 };

export const SKILLS = [
  {
    id: 'e2e', mp: 3, power: 9, color: '#86f5a6',
    es: { name: 'Escenario E2E', info: 'Cypress + Gherkin con Page Object Model. Definí 100 escenarios así en DocPath.' },
    en: { name: 'E2E scenario', info: 'Cypress + Gherkin with the Page Object Model. I defined 100 of these at DocPath.' },
  },
  {
    id: 'vagrant', mp: 3, power: 9, color: '#9fd3ff',
    es: { name: 'Entorno efímero', info: 'Máquinas limpias con Vagrant en cada ejecución: adiós a los fallos por estado sucio.' },
    en: { name: 'Ephemeral env', info: 'Clean Vagrant machines on every run: no more failures from leftover state.' },
  },
  {
    id: 'gatling', mp: 4, power: 10, color: '#ffd866',
    es: { name: 'Prueba de carga', info: 'Gatling y mi herramienta de cargas controladas: encuentra dónde se atasca el sistema.' },
    en: { name: 'Load test', info: 'Gatling and my controlled-load tool: finds where the system chokes.' },
  },
  {
    id: 'agents', mp: 8, power: 16, color: '#d59bff',
    es: { name: 'Equipo de agentes', info: 'Orquestador, planner, implementer y reviewer, como en MBRG. Fuerte contra todo, pero gasta mucho PM.' },
    en: { name: 'Agent squad', info: 'Orchestrator, planner, implementer and reviewer, as in MBRG. Strong against anything, but costly in MP.' },
  },
];

export const ENEMIES = [
  {
    id: 'flaky', hp: 30, weak: 'vagrant', atk: [4, 7], exp: 40, scale: 4, flicker: true,
    pal: { k: '#1a2a4a', h: '#cfe3ff', w: '#ffffff', b: '#9fd3ff', B: '#6aa4ff' },
    es: { name: 'Test inestable', attack: 'El test falla… solo a veces. Nadie sabe por qué.' },
    en: { name: 'Flaky test', attack: 'The test fails… only sometimes. Nobody knows why.' },
  },
  {
    id: 'regression', hp: 40, weak: 'e2e', atk: [5, 8], exp: 60, scale: 4,
    pal: { k: '#2a0a0a', h: '#3b1212', w: '#ffffff', b: '#e04848', B: '#2a0a0a' },
    es: { name: 'Bug de regresión', attack: 'Rompe una funcionalidad que ya funcionaba.' },
    en: { name: 'Regression bug', attack: 'It breaks a feature that used to work.' },
  },
  {
    id: 'bottleneck', hp: 50, weak: 'gatling', atk: [6, 9], exp: 80, scale: 4,
    pal: { k: '#2a1a05', h: '#5a3a12', w: '#ffffff', b: '#c98a12', B: '#7a4a10' },
    es: { name: 'Cuello de botella', attack: 'Todo va leeento… las peticiones se acumulan.' },
    en: { name: 'Bottleneck', attack: 'Everything gets sloooow… requests pile up.' },
  },
  {
    id: 'production', hp: 90, weak: null, atk: [8, 12], exp: 200, scale: 5, boss: true,
    pal: { k: '#14051f', h: '#2a0a3a', w: '#ff4d4d', b: '#7d3fa8', B: '#e04848' },
    es: { name: 'Bug en producción', attack: '¡Tumba el servidor un viernes por la tarde!' },
    en: { name: 'Production bug', attack: 'It takes the server down on a Friday afternoon!' },
  },
];

// Bicho de 16×16; cada enemigo cambia la paleta (k contorno, h cabeza, w ojos, b caparazón, B manchas).
export const BUG_SPRITE = [
  '......k..k......',
  '.......kk.......',
  '....kkkkkkkk....',
  '...khhhhhhhhk...',
  '..khhwkhhwkhhk..',
  '..khhhhhhhhhhk..',
  '.kkkkkkkkkkkkkk.',
  'kbbbbbbkkbbbbbbk',
  'kbBbbbbkkbbbbBbk',
  'kbbbbbbkkbbbbbbk',
  'kbbbBbbkkbbBbbbk',
  'kbbbbbbkkbbbbbbk',
  '.kbbbbbkkbbbbbk.',
  '..kkkkkkkkkkkk..',
  '.k..k......k..k.',
  'k..k........k..k',
];
