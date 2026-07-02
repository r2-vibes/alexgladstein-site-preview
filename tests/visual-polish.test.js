const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'scripts.js'), 'utf8');

assert(html.includes('>Start Here<'), 'Header nav should lead with Start Here');
assert(html.includes('>Writing<'), 'Header nav should use intent-first Writing label');
assert(/>Watch (&amp;|&) Listen</.test(html), 'Header nav should merge audio/video discovery');
assert(html.includes('>Speaking<'), 'Header nav should include Speaking');
assert(html.includes('>Subscribe<'), 'Header should make Subscribe the primary CTA');

assert(html.includes('class="hero shell editorial-hero"'), 'Homepage should use the editorial hero treatment');
assert.strictEqual((html.match(/class="gallery-image/g) || []).length, 0, 'Hero should not use a rotating portrait stack');
assert(html.includes('class="hero-portrait"'), 'Hero should use one strong portrait');

assert(html.includes('newsletter-block'), 'Homepage should include a dedicated newsletter conversion block');
assert(!html.includes('quote-carousel'), 'Homepage should not use the old quote carousel');
assert.strictEqual((html.match(/<blockquote/g) || []).length, 1, 'Homepage should keep a single pull quote');
assert(!html.includes('quote-dot'), 'Homepage should not render quote carousel dots');

assert(css.includes('--signal:'), 'Visual system should use a single signal accent token');
assert(css.includes('.editorial-hero'), 'CSS should style the editorial hero');
assert(css.includes('.newsletter-block'), 'CSS should style the newsletter block');
assert(!css.includes('.premium-hero-gallery'), 'Old premium gallery styles should be removed');

assert(js.includes('aria-current'), 'JS should still set current nav state');
assert(!js.includes('quote-slide'), 'JS should not retain quote carousel behavior');
assert(!js.includes('2600'), 'JS should not retain fast hero gallery rotation');

console.log('visual-polish.test.js passed');
