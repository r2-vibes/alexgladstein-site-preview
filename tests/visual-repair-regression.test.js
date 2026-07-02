const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

assert(/--signal:\s*var\(--btc\)/.test(css), 'Primary signal color should be Bitcoin orange, not red');
assert(/--signal-dark:\s*#d9780d/i.test(css), 'Signal hover color should stay in the Bitcoin orange family');

assert(
  /font-size:\s*clamp\(3\.1rem,\s*6vw,\s*5\.4rem\)/.test(css),
  'Desktop hero headline should be capped below the oversized redesign'
);
assert(
  /max-width:\s*13ch/.test(css),
  'Hero headline should use a wider measure so it does not stack into a giant billboard'
);

assert(!html.includes('bio-block'), 'Homepage should not include the standalone bio block');
assert.strictEqual((html.match(/class="start-card"/g) || []).length, 5, 'Start Here should render five image-backed cards');
assert.strictEqual((html.match(/class="start-image"/g) || []).length, 5, 'Each Start Here card should have an image');

assert(
  /object-position:\s*28%\s+center/.test(css),
  'Hero portrait should use a left-weighted crop so the face is not cut off'
);
assert(
  /filter:\s*saturate\(1\.03\)\s*contrast\(1\.02\)/.test(css),
  'Hero portrait should not be forced into stark grayscale'
);

assert(!/\.catalog-image\s*\{[^}]*filter:\s*grayscale\(100%\)/s.test(css), 'Catalog images should not be globally black-and-white');
assert(/\.catalog-image\s*\{[^}]*filter:\s*saturate\(1\.04\)/s.test(css), 'Catalog images should keep real color');
assert(!/grayscale\(100%\)/.test(css), 'Site imagery should not be globally drained to black-and-white');

console.log('visual-repair-regression.test.js passed');
