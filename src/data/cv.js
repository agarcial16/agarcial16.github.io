// Fuente única de contenido: la web (y en el futuro el mundo explorable) leen de aquí.
// Para actualizar el CV basta con tocar este archivo.

export const BIRTHDATE = '2004-08-07';

export const profile = {
  name: 'Ángel García Lopezlira',
  title: 'QA Automation Engineer · SDET',
  role: 'QA Automation · DevOps · IA aplicada',
  location: 'Valdepeñas (Ciudad Real), España',
  status: 'Abierto a nuevas misiones',
  email: 'agarcial0708@gmail.com',
  linkedin: 'https://www.linkedin.com/in/agarcialopezlira/',
  github: 'https://github.com/agarcial16',
  cvPdf: 'CV_Angel_Garcia_Lopezlira.pdf',
  photo: 'avatar.jpg',
  intro: [
    '¡Hola, viajero! Soy Ángel, ingeniero informático especializado en automatización de pruebas y DevOps, con casi un año de experiencia en QA Automation y cursando el Máster en Ingeniería Informática.',
    'Pruebas E2E en BDD (Cucumber/Gherkin con Cypress), pruebas de API con Postman, rendimiento con Gatling y CI/CD en Jenkins con entornos efímeros aprovisionados con Vagrant.',
    'También desarrollo con agentes de IA (orquestación multiagente y desarrollo guiado por especificaciones). Busco un equipo donde automatizar la calidad.',
  ],
  // Resumen rápido para quien solo mira la primera pantalla. Cada hazaña lleva a su sección.
  highlights: [
    { icon: '⚔', label: '100 escenarios E2E en BDD', detail: 'Cypress + Gherkin con Page Object Model', to: 'misiones' },
    { icon: '⚙', label: 'Regresión 100 % autónoma', detail: 'PowerShell + Jenkins + Vagrant: +15 baterías por versión', to: 'misiones' },
    { icon: '✦', label: 'Desarrollo con agentes de IA', detail: 'MBRG: orquestación multiagente y SDD', to: 'misiones' },
    { icon: '◆', label: 'Máster en curso', detail: 'Ingeniería Informática · UCLM', to: 'historia' },
  ],
};

export const experience = [
  {
    title: 'Desarrollador (QA Automation)',
    org: 'DocPath',
    period: 'Ago 2026 – Nov 2026',
    logo: 'logo_docpath.png',
    reward: '2-3 h ahorradas al equipo en cada release',
    points: [
      'Automaticé pruebas de regresión e integración: generación y comparación de documentos en máquinas virtuales Windows y Linux.',
      'Desarrollé scripts en PowerShell para lanzar de forma autónoma en entornos virtualizados más de 15 baterías de pruebas por versión (versiones 6 y 7 del producto), que antes lanzaban a mano 3-4 personas del equipo: unas 2-3 h de validación manual ahorradas por release (aproximadamente cada 2 semanas), y las ejecuciones pasaron a lanzarse en paralelo.',
      'Desarrollé una herramienta propia (API REST e interfaz web) para lanzar cargas controladas y pruebas de rendimiento.',
    ],
  },
  {
    title: 'Prácticas, QA Automation',
    org: 'DocPath',
    period: 'Feb 2026 – Jul 2026',
    logo: 'logo_docpath.png',
    reward: 'Detección de bugs en fases tempranas',
    points: [
      'Diseñé e implanté un ecosistema DevOps de automatización de pruebas.',
      'Definí 100 escenarios E2E en BDD (Gherkin con Cypress), siguiendo el patrón Page Object Model.',
      'Orquesté la ejecución en Jenkins con entornos efímeros aprovisionados con Vagrant.',
      'Incorporé pruebas de rendimiento y estrés con Gatling.',
    ],
  },
];

export const projects = [
  {
    name: 'MBRG · Map Battle Royale Game',
    thumb: 'projects/mbrg.jpg',
    state: 'en curso',
    summary: 'Battle royale sobre mapas de estilo EU4/RISK (cada ronda cae una facción al azar y un vecino se queda sus provincias), con servidor, visor web y bot de Discord.',
    points: [
      'Hecho con un flujo de agentes de IA: un orquestador reparte cada tarea entre planner, implementer y reviewer.',
      'Desarrollo guiado por especificaciones (SDD): spec, plan y tareas antes de tocar código.',
    ],
    stack: ['TypeScript', 'Node.js', 'Claude Code', 'Multiagente', 'SDD'],
    links: [{ label: 'Repositorio', href: 'https://github.com/agarcial16/MBRG' }],
  },
  {
    name: 'ESIMEDIA · Streaming con microservicios',
    thumb: 'projects/esimedia.jpg',
    state: 'completada',
    party: 'Proyecto en equipo · 6 personas',
    summary:
      'Plataforma de vídeo bajo demanda con arquitectura desacoplada en microservicios, seguridad basada en RBAC y JWT, y desarrollo guiado por pruebas (TDD).',
    points: [
      'Desarrollo guiado por pruebas (TDD) con JUnit y Mockito, con un 60 % de cobertura de código.',
    ],
    stack: ['React', 'TypeScript', 'Java 21', 'Spring Boot 3', 'MongoDB', 'JWT', 'Docker'],
    links: [
      { label: 'Frontend', href: 'https://github.com/ISO-2526/ESIMedia_FE' },
      { label: 'Backend', href: 'https://github.com/ISO-2526/ESIMedia_BE' },
    ],
  },
  {
    name: 'Quantum Web Generator',
    art: 'quantum',
    state: 'completada',
    party: 'Proyecto en equipo · 4 personas',
    summary:
      'Sistema distribuido con tres backends, persistencia políglota y seguridad reforzada (OWASP Top 10).',
    points: [],
    stack: ['Angular', 'Java 21', 'Spring Boot 3', 'SQL Server', 'MySQL'],
    links: [],
  },
];

export const education = [
  {
    title: 'Máster en Ingeniería Informática',
    org: 'Universidad de Castilla-La Mancha',
    period: 'Sep 2026 – actualidad',
    logo: 'logo_uclm.png',
    current: true,
  },
  {
    title: 'Grado en Ingeniería Informática',
    detail: 'Mención en Ingeniería del Software · Escuela Superior de Informática (Ciudad Real)',
    org: 'Universidad de Castilla-La Mancha',
    period: 'Sep 2022 – Jul 2026',
    logo: 'logo_uclm.png',
  },
  {
    title: 'Bachillerato de Ciencias',
    org: 'IES Bernardo de Balbuena',
    period: 'Sep 2020 – Jun 2022',
    logo: 'logo_bernardo_balbuena.jpg',
  },
];

export const languages = [
  { name: 'Español', level: 'Nativo' },
  { name: 'Inglés', level: 'B1 (certificado CertAcles)' },
];

export const skillSchools = [
  { school: 'Pruebas y automatización', skills: ['Cypress', 'Cucumber (Gherkin)', 'JUnit', 'Mockito', 'Gatling', 'Postman', 'SonarQube', 'E2E', 'Regresión', 'Integración', 'Rendimiento', 'TDD', 'BDD', 'Page Object Model'] },
  { school: 'DevOps y cloud', skills: ['Jenkins', 'Vagrant', 'VMware', 'Docker', 'Azure DevOps', 'Apache Kafka', 'CI/CD'] },
  { school: 'IA aplicada', skills: ['Claude Code', 'Agentes de IA', 'Orquestación multiagente', 'SDD (Spec-Driven Development)'] },
  { school: 'Lenguajes', skills: ['Java', 'JavaScript/TypeScript', 'Python', 'PowerShell', 'C#', 'C/C++', 'SQL'] },
  { school: 'Backend y frontend', skills: ['Spring Boot', 'Node.js', 'React', 'Angular', 'APIs REST', 'Microservicios', 'HTML5', 'CSS3'] },
  { school: 'Bases de datos', skills: ['MySQL', 'SQL Server', 'MongoDB', 'Oracle Database'] },
  { school: 'Herramientas', skills: ['Git', 'Maven', 'Jira', 'Visual Studio', 'Eclipse', 'Scrum'] },
];

// Competencias personales como habilidades pasivas.
export const passives = [
  { name: 'Ojo crítico', text: 'Analizo casos límite y fallos antes de que lleguen a producción.' },
  { name: 'Desatascador', text: 'Identifico y desbloqueo cuellos de botella técnicos.' },
  { name: 'Aprendiz veloz', text: 'Incorporé Cypress, Gatling y BDD en paralelo al trabajo.' },
  { name: 'Juego en grupo', text: 'Scrum, reuniones diarias y revisiones con perfiles senior.' },
  { name: 'Bardo técnico', text: 'Explico el progreso y los resultados de las pruebas al equipo.' },
];
