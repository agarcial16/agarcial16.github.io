// English content. Same shape as cv.js: only the text changes; links, logos and covers are shared.
import * as es from './cv.js';

const merge = (list, texts) => list.map((item, i) => ({ ...item, ...texts[i] }));

export const BIRTHDATE = es.BIRTHDATE;

export const profile = {
  ...es.profile,
  title: 'QA Automation Engineer · SDET',
  role: 'QA Automation · DevOps · Applied AI',
  location: 'Valdepeñas (Ciudad Real), Spain',
  status: 'Open to new quests',
  cvPdf: 'CV_Angel_Garcia_Lopezlira_EN.pdf',
  intro: [
    'Hello, traveler! I’m Ángel, a computer engineer specialised in test automation and DevOps, with almost a year of experience in QA Automation and currently studying a Master’s in Computer Engineering.',
    'BDD end-to-end testing (Cucumber/Gherkin with Cypress), API testing with Postman, performance testing with Gatling and CI/CD in Jenkins with ephemeral environments provisioned with Vagrant.',
    'I also develop with AI agents (multi-agent orchestration and spec-driven development). Looking for a team where I can automate quality.',
  ],
  highlights: merge(es.profile.highlights, [
    { label: '100 BDD end-to-end scenarios', detail: 'Cypress + Gherkin with the Page Object Model' },
    { label: 'Fully unattended regression', detail: 'PowerShell + Jenkins + Vagrant: 15+ suites per release' },
    { label: 'Building with AI agents', detail: 'MBRG: multi-agent orchestration and SDD' },
    { label: 'Master’s degree in progress', detail: 'Computer Engineering · UCLM' },
  ]),
};

export const experience = merge(es.experience, [
  {
    title: 'QA Automation Developer',
    period: 'Aug 2026 – Nov 2026',
    reward: '2-3 h saved per release for the team',
    points: [
      'Automated regression and integration tests: document generation and comparison on Windows and Linux virtual machines.',
      'Built PowerShell scripts to run 15+ test suites per release (product versions 6 and 7) autonomously in virtualised environments, previously launched by hand by 3-4 team members: around 2-3 h of manual validation saved per release (roughly every 2 weeks), and runs now execute in parallel.',
      'Built an in-house tool (REST API and web UI) to launch controlled loads and performance tests.',
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
    summary: 'Battle royale on EU4/RISK-style maps (each round a random faction falls and a neighbour takes its provinces), with a server, web viewer and Discord bot.',
    points: [
      'Built with an AI agent workflow: an orchestrator splits each task between planner, implementer and reviewer agents.',
      'Spec-driven development (SDD): spec, plan and tasks before touching any code.',
    ],
    links: [{ label: 'Repository', href: es.projects[0].links[0].href }],
  },
  {
    name: 'ESIMEDIA · Microservices streaming',
    party: 'Team project · 6 people',
    summary: 'Video-on-demand platform with a decoupled microservices architecture, RBAC and JWT security, and test-driven development (TDD).',
    points: [
      'Test-driven development (TDD) with JUnit and Mockito, reaching 60% code coverage.',
    ],
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
  { school: 'Testing and automation', skills: ['Cypress', 'Cucumber (Gherkin)', 'JUnit', 'Mockito', 'Gatling', 'Postman', 'SonarQube', 'E2E', 'Regression', 'Integration', 'Performance', 'TDD', 'BDD', 'Page Object Model'] },
  { school: 'DevOps and cloud' },
  { school: 'Applied AI', skills: ['Claude Code', 'AI agents', 'Multi-agent orchestration', 'SDD (Spec-Driven Development)'] },
  { school: 'Languages', skills: ['Java', 'JavaScript/TypeScript', 'Python', 'PowerShell', 'C#', 'C/C++', 'SQL'] },
  { school: 'Backend and frontend', skills: ['Spring Boot', 'Node.js', 'React', 'Angular', 'REST APIs', 'Microservices', 'HTML5', 'CSS3'] },
  { school: 'Databases' },
  { school: 'Tools', skills: ['Git', 'Maven', 'Jira', 'Visual Studio', 'Eclipse', 'Scrum'] },
]);

export const passives = [
  { name: 'Keen eye', text: 'I look for edge cases and failures before they reach production.' },
  { name: 'Unblocker', text: 'I find and clear technical bottlenecks.' },
  { name: 'Fast learner', text: 'Picked up Cypress, Gatling and BDD while delivering at work.' },
  { name: 'Team player', text: 'Scrum, daily stand-ups and reviews with senior engineers.' },
  { name: 'Tech bard', text: 'I explain progress and test results to the team.' },
];
