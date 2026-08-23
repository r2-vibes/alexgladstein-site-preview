const fs = require('fs');
const path = require('path');
const assert = require('assert');
const crypto = require('crypto');

const root = path.resolve(__dirname, '..');
const homepage = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const page = fs.readFileSync(path.join(root, 'reflections-on-ai.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(root, 'content', 'reflections-on-ai.json'), 'utf8'));

assert(homepage.includes('href="reflections-on-ai.html"'), 'Homepage should link to Reflections on AI');
assert(homepage.includes('Reflections on AI'), 'Homepage should name the series');
assert(page.includes('<h1>Reflections on <span>AI</span></h1>'), 'Series page should use the official title');
assert(page.includes('href="#part-1"'), 'Series page should expose Part 1 navigation');
assert(page.includes('id="part-1"'), 'Part 1 should have a stable anchor');
assert(css.includes('.reflections-page'), 'Series page should have dedicated editorial styling');

assert.strictEqual(data.series, 'Reflections on AI');
assert.strictEqual(data.parts[0].sourceUrl, 'https://x.com/gladstein/status/2027789622978224443');
assert.strictEqual(data.parts[0].published, '2026-02-28');
const partOneText = fs.readFileSync(path.join(root, data.parts[0].textFile), 'utf8');
const partOneHash = crypto.createHash('sha256').update(partOneText).digest('hex');
assert.strictEqual(
  partOneHash,
  '300ae630ee8307657d7d977728f5382a90b34b0809d0f8396f86188850090a59',
  'Part 1 must remain character-for-character identical to the source X post',
);

assert.strictEqual(data.parts[1].sourceUrl, 'https://x.com/gladstein/status/2067646581243850996');
assert.strictEqual(data.parts[1].published, '2026-06-18');
const partTwoText = fs.readFileSync(path.join(root, data.parts[1].textFile), 'utf8');
const partTwoHash = crypto.createHash('sha256').update(partTwoText).digest('hex');
assert.strictEqual(
  partTwoHash,
  '7f20697b6f5cbfba891ae995ed0016ccea9a4a3604f1d3db45360dc9493c9e14',
  'Part 2 must remain character-for-character identical to the source X post',
);

for (const part of data.parts) {
  assert(Number.isInteger(part.part), 'Each installment needs a numeric part');
  assert(part.sourceUrl.startsWith('https://x.com/gladstein/status/'), 'Each installment needs its original X URL');
  const text = fs.readFileSync(path.join(root, part.textFile), 'utf8');
  assert(text.length > 1000, 'Each installment should contain the full long-form post');
  assert(page.includes(`href="#part-${part.part}"`), `Part ${part.part} should appear in the series navigation`);
  assert(page.includes(`id="part-${part.part}"`), `Part ${part.part} should have a stable anchor`);
}

console.log('reflections-on-ai.test.js passed');
