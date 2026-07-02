const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'content-data.js'), 'utf8'), sandbox);

const talks = sandbox.window.CONTENT_DATA.talks.items;
const expectedTitles = [
  'Bitcoin on the Frontlines of Human Rights',
  'AI for Activists 101',
  'Farida Nabourema, Lyn Alden, Alex Gladstein & Jack Dorsey at Bitcoin Atlantis',
  'Sarah Kreps & Alex Gladstein at Bitcoin Atlantis 2024',
  'Natalie Brunell, Jeff Booth, Alex Gladstein & Jack Dorsey at Bitcoin Atlantis',
  'The Currency Caste System with Alex Gladstein',
  'Bitcoin & The Future in a Fragmenting World',
  'Bitcoin Is Money',
  'Bitcoin Magazine Conference Kyiv: Alex Gladstein & Mike Brock',
  'Can Bitcoin, Crypto, Blockchain Aid Media Freedom and Support Journalism?',
  'Is Bitcoin Compatible with Democracy?',
  'Bitcoin in the Middle East',
  'Present & Future of Bitcoin on Human Rights',
  'Why Bitcoin Matters for Human Freedom',
  'Why Authoritarianism Is Bad for Public Health',
  'Bitcoin vs Big Brother',
  'Future of Democracy',
  'The Cutting Edge of Human Rights',
  'How To Free North Korea',
  'Alex Gladstein at SVA Design for Social Innovation'
];

expectedTitles.forEach((title) => {
  assert(
    talks.some((item) => item.title === title),
    `talks should include missing appearance: ${title}`
  );
});

const links = new Set();
talks.forEach((item) => {
  assert(item.link, `${item.title} should have a canonical link`);
  assert(!links.has(item.link), `${item.title} should not duplicate an existing talk link`);
  links.add(item.link);
});

console.log('talk-completeness-sweep.test.js passed');
