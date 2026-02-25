const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const htmlPages = [
  'index.html',
  'books.html',
  'podcasts.html',
  'essays.html',
  'talks.html',
  'press.html',
  'interviews.html'
];

for (const page of htmlPages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  assert(!/href\s*=\s*["']#["']/.test(html), `${page} should not contain placeholder href="#" links`);
}

const raw = fs.readFileSync(path.join(root, 'content-data.js'), 'utf8');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(raw, ctx);
const data = ctx.window.CONTENT_DATA;

const sections = ['books', 'podcasts', 'essays', 'talks', 'press', 'interviews'];
const normalizeTitle = (value) => value.toLowerCase().normalize('NFKC').replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();

for (const slug of sections) {
  const section = data[slug];
  assert(section, `Missing ${slug} section in CONTENT_DATA`);

  const visibleItems = [
    ...section.featured.map((item) => ({ bucket: 'featured', item })),
    ...section.items.slice(0, 4).map((item) => ({ bucket: 'items', item }))
  ];

  for (const { bucket, item } of visibleItems) {
    const required = bucket === 'featured'
      ? ['title', 'meta', 'blurb', 'link', 'image']
      : ['date', 'outlet', 'title', 'blurb', 'link', 'image'];

    for (const key of required) {
      assert(item[key] && String(item[key]).trim(), `${slug}:${bucket} entry "${item.title || '(untitled)'}" missing ${key}`);
    }

    assert(!/^\s*#\s*$/.test(item.link), `${slug}:${bucket} entry "${item.title}" has placeholder link`);
    assert(/^https?:\/\//.test(item.link), `${slug}:${bucket} entry "${item.title}" link should be absolute URL`);
  }

  const titleCounts = new Map();
  const imageCounts = new Map();
  for (const { item } of visibleItems) {
    const t = normalizeTitle(item.title);
    titleCounts.set(t, (titleCounts.get(t) || 0) + 1);
    imageCounts.set(item.image, (imageCounts.get(item.image) || 0) + 1);
  }

  const dupTitles = [...titleCounts.entries()].filter(([, count]) => count > 1);
  const dupImages = [...imageCounts.entries()].filter(([, count]) => count > 1);

  assert.strictEqual(dupTitles.length, 0, `${slug} has duplicate high-visibility titles: ${dupTitles.map(([t, c]) => `${c}x ${t}`).join('; ')}`);
  assert.strictEqual(dupImages.length, 0, `${slug} has duplicate high-visibility image assignments: ${dupImages.map(([img, c]) => `${c}x ${img}`).join('; ')}`);
}

console.log('link-duplication-step1.test.js passed');
