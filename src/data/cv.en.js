// English content. Same shape as cv.js: only the text changes; links, logos and covers are shared.
import * as es from './cv.js';

const merge = (list, texts) => list.map((item, i) => ({ ...item, ...texts[i] }));

export const BIRTHDATE = es.BIRTHDATE;

export const profile = {
  ...es.profile,
  title: 'Software Engineer',
  role: 'QA Automation · DevOps · Applied AI',
  location: 'Valdepeñas (Ciudad Real), Spain',
  status: 'Open to new quests',
  cvPdf: 'CV_Angel_Garcia_Lopezlira_EN.pdf',
  intro: [
    'Hello, traveler! I’m Ángel, a software engineer specialized in test automation and DevOps.',
    'I design BDD end-to-end tests, analyze performance and build CI/CD pipelines with ephemeral environments.',
    'I’m also exploring development with AI agents: multi-agent orchestration and spec-driven development.',
  ],
  highlights: merge(es.profile.highlights, [
    { label: '100 BDD end-to-end scenarios', detail: 'Cypress + Gherkin with the Page Object Model' },
    { label: 'Fully unattended regression', detail: 'Jenkins + Vagrant, parallel runs' },
    { label: 'Building with AI agents', detail: 'MBRG: multi-agent orchestration and SDD' },
    { label: 'Master’s degree in progress', detail: 'Computer Engineering · UCLM' },
  ]),
};

export const experience = merge(es.experience, [
  {
    title: 'QA Automation Developer',
    period: 'Aug 2026 – Nov 2026',
    reward: 'Team freed from manual test runs',
    points: [
      'Automated regression and integration tests: document generation and comparison on Windows and Linux virtual machines.',
      'Set up unattended execution of the test suites (2–3 h each), previously run by hand: the team no longer had to babysit them and runs could go in parallel.',
      'Built an in-house tool to launch controlled loads and automate performance testing, with a REST API and a web interface.',
    ],
  },
  {
    title: 'QA Automation Intern',
    period: 'Feb 2026 – Jul 2026',
    reward: 'Bugs caught in early stages',
    points: [
      'Designed and rolled out a DevOps test automation ecosystem.',
      'Defined 100 BDD end-to-end scenarios (Gherkin with Cypress) following the Page Object Model.',
      'Orchestrated execution in Jenkins with ephemeral environments provisioned with Vagrant.',
      'Added performance and stress testing with Gatling.',
    ],
  },
]);

export const projects = merge(es.projects, [
  {
    summary: 'Battle royale on EU4/RISK-style maps, with a server, a web viewer and a Discord bot.',
    points: [
      'Built with an AI agent workflow: an orchestrator splits each task between planner, implementer and reviewer agents.',
      'Spec-driven development (SDD): spec, plan and tasks before touching any code.',
    ],
    stack: ['TypeScript', 'Node.js', 'Claude Code', 'Multi-agent', 'SDD'],
    links: [{ label: 'Repository', href: es.projects[0].links[0].href }],
  },
  {
    name: 'ESIMEDIA · Microservices streaming',
    party: 'Team project · 6 people',
    summary: 'Video-on-demand platform with a decoupled microservices architecture, RBAC and JWT security, and test-driven development (TDD).',
  },
  {
    party: 'Team project · 4 people',
    summary: 'Distributed system with three backends, polyglot persistence and hardened security (OWASP Top 10).',
  },
]);

export const education = merge(es.education, [
  { title: 'Master’s Degree in Computer Engineering', period: 'Sep 2026 – present' },
  { title: 'Bachelor’s Degree in Computer Engineering', detail: 'Software Engineering track · School of Computer Science (Ciudad Real)', period: 'Sep 2022 – Jul 2026' },
  { title: 'High School Diploma, Science track', period: 'Sep 2020 – Jun 2022' },
]);

export const languages = [
  { name: 'Spanish', level: 'Native' },
  { name: 'English', level: 'B1 (CertAcles certificate)' },
];

export const skillSchools = merge(es.skillSchools, [
  { school: 'Testing and automation', skills: ['Cypress', 'Cucumber (Gherkin)', 'JUnit', 'Gatling', 'E2E', 'Regression', 'Performance'] },
  { school: 'DevOps and cloud' },
  { school: 'Applied AI', skills: ['Claude Code', 'AI agents', 'Multi-agent orchestration', 'SDD (Spec-Driven Development)'] },
  { school: 'Languages' },
  { school: 'Backend and frontend', skills: ['Spring Boot', 'Node.js', 'React', 'Angular', 'REST APIs', 'Microservices', 'HTML5', 'CSS3'] },
  { school: 'Databases' },
  { school: 'Tools' },
]);

export const passives = [
  { name: 'Keen eye', text: 'I look for edge cases and failures before they reach production.' },
  { name: 'Unblocker', text: 'I find and clear technical bottlenecks.' },
  { name: 'Fast learner', text: 'Picked up Cypress, Gatling and BDD while delivering at work.' },
  { name: 'Team player', text: 'Scrum, daily stand-ups and reviews with senior engineers.' },
  { name: 'Tech bard', text: 'I explain progress and test results to the team.' },
];
