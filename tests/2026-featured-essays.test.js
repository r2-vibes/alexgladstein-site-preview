const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'content-data.js'), 'utf8'), sandbox);

const essays = sandbox.window.CONTENT_DATA.essays;
const wsjUrl = 'https://partners.wsj.com/the-nakamoto-project/bitcoin-reframed/bitcoins-overlooked-promise-freedom/';
const aiUrl = 'https://www.journalofdemocracy.org/online-exclusive/how-ai-agents-are-empowering-human-rights-defenders/';
const wsjTitle = 'Bitcoin’s Overlooked Promise: Freedom';
const aiTitle = 'How AI Agents Are Empowering Human-Rights Defenders';

for (const [title, url] of [[wsjTitle, wsjUrl], [aiTitle, aiUrl]]) {
  assert(html.includes(title), `${title} should appear on the homepage`);
  assert(html.includes(url), `${title} homepage card should use the canonical URL`);
  assert(essays.featured.some((item) => item.title === title && item.canonicalUrl === url), `${title} should be featured in Writing`);
  assert(essays.items.some((item) => item.title === title && item.canonicalUrl === url), `${title} should appear in the full Writing archive`);
}

const featuredWork = html.slice(html.indexOf('<div class="feature-grid">'), html.indexOf('</section>', html.indexOf('<div class="feature-grid">')));

assert(
  featuredWork.indexOf(wsjTitle) < featuredWork.indexOf('Bitcoin: Global Utility'),
  'The newest WSJ essay should precede older homepage work'
);
assert(
  featuredWork.indexOf(aiTitle) < featuredWork.indexOf('Bitcoin: Global Utility'),
  'The AI essay should be front-page material ahead of older homepage work'
);

console.log('2026-featured-essays.test.js passed');
