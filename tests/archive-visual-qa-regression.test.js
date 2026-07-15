const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const pages = ['books', 'essays', 'podcasts', 'talks', 'press', 'interviews'];

for (const slug of pages) {
  const html = fs.readFileSync(path.join(root, `${slug}.html`), 'utf8');
  const articles = [...html.matchAll(/<article class="(?:feature|timeline)-card">([\s\S]*?)<\/article>/g)]
    .map((match) => match[1]);
  const links = articles.map((article) => article.match(/<a href="([^"]+)"/)?.[1]).filter(Boolean);
  const duplicates = links.filter((link, index) => links.indexOf(link) !== index);
  assert.deepStrictEqual(duplicates, [], `${slug}.html must not show the same record in Featured and Full Collection`);
}

const qa = fs.readFileSync(path.join(root, 'scripts', 'qa-archive-pages.mjs'), 'utf8');
assert(qa.includes("newContext({ viewport, deviceScaleFactor: 1, bypassCSP: true })"), 'QA must apply the requested desktop/mobile viewport');
assert(qa.includes('bypassCSP: true'), 'QA must bypass production CSP so browser-side assertions can run');
assert(qa.includes("['document', 'script', 'stylesheet'].includes(response.request().resourceType())"), 'QA must hard-fail critical production resources while allowing image fallback recovery');
assert(qa.includes('scrollIntoViewIfNeeded()'), 'QA must scroll lazy images into view before full-page captures');
assert(qa.includes('window.scrollTo(0, 0)'), 'QA must reset to the page top before capturing sticky navigation');
assert(qa.includes('window.scrollY === 0'), 'QA must wait for smooth scrolling to finish before capture');

console.log('archive-visual-qa-regression.test.js passed');
