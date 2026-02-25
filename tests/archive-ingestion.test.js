const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const contentPath = path.join(root, 'content-data.js');
const inventoryPath = path.join(root, 'legacy-scrape', 'legacy-source-inventory.json');
const source = fs.readFileSync(contentPath, 'utf8');

assert(fs.existsSync(inventoryPath), 'legacy-source-inventory.json should exist');
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(source, sandbox);

const data = sandbox.window.CONTENT_DATA;
assert(data, 'window.CONTENT_DATA should be defined');

const sections = ['books', 'podcasts', 'essays', 'talks', 'press', 'interviews'];

function isRealLink(link) {
  return typeof link === 'string' && /^https?:\/\//.test(link) && !link.includes('example.com');
}

function parseDate(value) {
  if (!value || typeof value !== 'string') return NaN;
  const normalized = value.trim();

  if (/^\d{4}$/.test(normalized)) return Date.parse(`${normalized}-01-01`);
  if (/^[A-Za-z]{3}\s\d{4}$/.test(normalized)) return Date.parse(`01 ${normalized}`);
  if (/^[A-Za-z]+\s\d{4}$/.test(normalized)) return Date.parse(`01 ${normalized}`);
  return Date.parse(normalized);
}

sections.forEach((section) => {
  assert(data[section], `${section} should exist`);
  assert(Array.isArray(data[section].items), `${section}.items should be an array`);

  const oldSection = inventory.sections?.[section];
  const oldTotal = Array.isArray(oldSection)
    ? oldSection.length
    : Number(oldSection?.old_total ?? 0);
  assert(data[section].items.length >= oldTotal, `${section}.items should be >= legacy total (${oldTotal})`);

  data[section].items.forEach((item, index) => {
    assert(item.title && item.date && item.link, `${section}.items[${index}] should have title/date/link`);
    assert(item.outlet, `${section}.items[${index}] should have outlet`);
    assert(typeof item.outlet === 'string' && item.outlet.trim().length > 1, `${section}.items[${index}] should have a non-empty outlet`);
    assert(isRealLink(item.link), `${section}.items[${index}] should have a real http(s) link`);
    assert.doesNotThrow(() => new URL(item.link), `${section}.items[${index}] link should be a valid URL`);
  });

  for (let i = 0; i < data[section].items.length - 1; i += 1) {
    const curr = parseDate(data[section].items[i].date);
    const next = parseDate(data[section].items[i + 1].date);
    assert(!Number.isNaN(curr), `${section}.items[${i}] date should be parseable`);
    assert(!Number.isNaN(next), `${section}.items[${i + 1}] date should be parseable`);
    assert(curr >= next, `${section}.items should be in reverse chronological order`);
  }

  const links = data[section].items.map((item) => item.link.trim());
  assert.strictEqual(new Set(links).size, links.length, `${section}.items should not contain duplicate links`);
});

console.log('archive-ingestion.test.js passed');
