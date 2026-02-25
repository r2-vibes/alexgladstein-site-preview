const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'scripts.js'), 'utf8');

assert(html.includes('>Press<'), 'Nav should include Press link');
assert(html.includes('>Contact Me<'), 'CTA should be Contact Me');
assert(!html.includes('Start Here'), 'Start Here should be removed');
assert(!html.includes('<section class="cred shell">'), 'Credibility strip should be removed');
assert(html.includes('A living publication of Alex’s essays, talks, books, and interviews.'), 'Hero copy should be updated');
assert(html.includes('hero-gallery'), 'Hero gallery should be present');
assert((html.match(/class="gallery-image/g) || []).length >= 2, 'Hero gallery should include multiple images');
assert((html.match(/class="feature-image/g) || []).length >= 3, 'Featured cards should include imagery');
assert((html.match(/loading="lazy"/g) || []).length >= 4, 'Featured images should be lazy-loaded for crisp performance');
assert((html.match(/decoding="async"/g) || []).length >= 4, 'Featured images should decode asynchronously');
assert((html.match(/class="feature-link"/g) || []).length >= 4, 'Each featured item should expose a clickable title link');
assert(html.includes('quote-carousel'), 'Quote carousel wrapper should exist');
assert(html.includes('Writing, thinking, and speaking about human rights, freedom, technology, and open systems.'), 'Footer copy should be updated');

assert(css.includes('#F7931A'), 'CSS should include Bitcoin orange accent');
assert(css.includes('#00FF00'), 'CSS should include cypherpunk green accent');
assert(css.includes('.hero-gallery'), 'CSS should style hero gallery');
assert(css.includes('.quote-carousel'), 'CSS should style quote carousel');
assert(css.includes('.feature-link'), 'CSS should style featured title links');
assert(css.includes('.feature-image-wrap::after'), 'CSS should add a crisp media overlay for featured imagery');

assert(js.includes('setInterval') && js.includes('2000'), 'Hero gallery should auto-rotate around 2s');
assert(js.includes('quote-slide'), 'JS should handle quote slides');

console.log('homepage.test.js passed');
