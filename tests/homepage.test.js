const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'scripts.js'), 'utf8');

// Nav + core structure
assert(html.includes('>Press<'), 'Nav should include Press link');
assert(html.includes('>Interviews<'), 'Nav should include Interviews link');
assert(html.includes('>Contact Me<'), 'Header CTA should be Contact Me');
assert(html.includes('Five pieces to understand the thesis'), 'Start Here section should be present');
assert(html.includes('Bitcoin, <span>Human Rights</span>, and Freedom Tech.'), 'Updated hero headline should be present');
assert(html.includes('proof-line'), 'Hero proof line should be present');

// Media + featured integrity
assert(html.includes('hero-gallery'), 'Hero gallery should be present');
assert((html.match(/class="gallery-image/g) || []).length >= 2, 'Hero gallery should include multiple images');
assert((html.match(/class="feature-image/g) || []).length >= 5, 'Featured cards should include imagery');
assert((html.match(/loading="lazy"/g) || []).length >= 5, 'Featured images should be lazy-loaded');
assert((html.match(/decoding="async"/g) || []).length >= 5, 'Featured images should decode asynchronously');
assert((html.match(/class="feature-link"/g) || []).length >= 5, 'Each featured item should expose a clickable title link');

// Quotes/footer
assert(html.includes('quote-carousel'), 'Quote carousel wrapper should exist');
assert(html.includes('Writing, thinking, and speaking about human rights, freedom, technology, and open systems.'), 'Footer copy should be present');

// Styling tokens and key modules
assert(css.includes('#F7931A'), 'CSS should include Bitcoin orange accent');
assert(css.includes('#00FF00'), 'CSS should include cypherpunk green accent');
assert(css.includes('.hero-gallery'), 'CSS should style hero gallery');
assert(css.includes('.quote-carousel'), 'CSS should style quote carousel');
assert(css.includes('.feature-link'), 'CSS should style featured title links');
assert(css.includes('.start-list'), 'CSS should style Start Here list');

// Interaction scripts
assert(js.includes('reduceMotion'), 'JS should respect reduced motion');
assert(js.includes('setInterval') && js.includes('2600'), 'Hero gallery should auto-rotate around 2.6s');
assert(js.includes('quote-slide'), 'JS should handle quote slides');
assert(js.includes('aria-current'), 'JS should set current nav state');

console.log('homepage.test.js passed');
