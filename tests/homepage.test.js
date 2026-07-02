const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'scripts.js'), 'utf8');

// Nav + core structure
assert(html.includes('>Press<'), 'Nav should include Press link');
assert(html.includes('>Writing<'), 'Nav should include Writing link');
assert(/>Watch (&amp;|&) Listen</.test(html), 'Nav should include Watch & Listen link');
assert(html.includes('>Contact<'), 'Header CTA should be Contact');
assert(!/subscribe/i.test(html), 'Homepage should not mention subscribing');
assert(!/newsletter/i.test(html), 'Homepage should not mention newsletters');
assert(html.includes('Five pieces to understand the thesis'), 'Start Here section should be present');
assert(html.includes('Bitcoin, <span>human rights</span>, and freedom tech.'), 'Updated hero headline should be present');
assert(html.includes('proof-line'), 'Hero proof line should be present');

// Media + featured integrity
assert(html.includes('hero-portrait'), 'Hero portrait should be present');
assert((html.match(/class="gallery-image/g) || []).length === 0, 'Hero should not include rotating gallery images');
assert((html.match(/class="feature-image/g) || []).length >= 5, 'Featured cards should include imagery');
assert((html.match(/loading="lazy"/g) || []).length >= 5, 'Featured images should be lazy-loaded');
assert((html.match(/decoding="async"/g) || []).length >= 5, 'Featured images should decode asynchronously');
assert((html.match(/class="feature-link"/g) || []).length >= 5, 'Each featured item should expose a clickable title link');

// Quotes/footer
assert((html.match(/<blockquote/g) || []).length === 1, 'Homepage should include one pull quote');
assert(html.includes('Writing, thinking, and speaking about human rights, freedom technology, Bitcoin, and open systems.'), 'Footer copy should be present');

// Styling tokens and key modules
assert(css.includes('#F7931A'), 'CSS should include Bitcoin orange accent');
assert(css.includes('#00FF00'), 'CSS should include cypherpunk green accent');
assert(css.includes('.hero-portrait'), 'CSS should style hero portrait');
assert(!css.includes('.newsletter-block'), 'CSS should not retain newsletter conversion block');
assert(css.includes('.feature-link'), 'CSS should style featured title links');
assert(css.includes('.start-list'), 'CSS should style Start Here list');

// Interaction scripts
assert(js.includes('aria-current'), 'JS should set current nav state');
assert(!js.includes('setInterval'), 'Homepage JS should not depend on autoplay polish');

console.log('homepage.test.js passed');
