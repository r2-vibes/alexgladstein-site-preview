const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const pages = ['books', 'essays', 'podcasts', 'talks', 'press', 'interviews'];

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'content-data.js'), 'utf8'), sandbox);
const content = sandbox.window.CONTENT_DATA;

function stripScripts(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
}

function plainText(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

pages.forEach((slug) => {
  const html = fs.readFileSync(path.join(root, `${slug}.html`), 'utf8');
  const noJs = stripScripts(html);
  const text = plainText(noJs);
  const data = content[slug];

  assert(data, `${slug} should have content data`);
  assert(text.includes(data.title), `${slug}.html should render page title without JS`);
  assert(text.includes(data.subtitle), `${slug}.html should render subtitle without JS`);

  data.featured.forEach((item) => {
    assert(
      text.includes(item.title) || noJs.includes(escapeHtml(item.title)),
      `${slug}.html should render featured item "${item.title}" without JS`
    );
  });

  data.items.forEach((item) => {
    assert(
      text.includes(item.title) || noJs.includes(escapeHtml(item.title)),
      `${slug}.html should render archive item "${item.title}" without JS`
    );
  });
});

console.log('static-archive-render.test.js passed');
