const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'content-data.js'), 'utf8'), sandbox);

const essays = sandbox.window.CONTENT_DATA.essays.items;
const interviews = sandbox.window.CONTENT_DATA.interviews.items;

[
  'Donald Trump Is Not the Bitcoin President',
  'Why Bitcoin Is Freedom Money',
  'How to Dictator-Proof Your Money',
  'Debate: Bitcoin Is the Future of Free Exchange',
  'Bitcoin Is Venice: What If You Knew The Renaissance Was Coming?',
  'The Invisible Cost Of War In The Age Of Quantitative Easing',
  'Op Ed: As Cash Fades, Will Bitcoin Keep Protest Alive In The Surveillance Age?',
  'Bomben som reddet Terje Hakonsen'
].forEach((title) => {
  assert(
    essays.some((item) => item.title === title),
    `essays should include missing writing: ${title}`
  );
});

[
  'Why Bitcoin Is the Way Forward for Human Rights'
].forEach((title) => {
  assert(
    interviews.some((item) => item.title === title),
    `interviews should include missing interview: ${title}`
  );
});

console.log('writing-completeness-sweep.test.js passed');
