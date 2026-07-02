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
assert(html.includes('>Contact<'), 'Header should route to Contact');
assert(!html.includes('>Subscribe<'), 'Header should not include Subscribe');

assert(html.includes('class="hero shell editorial-hero"'), 'Homepage should use the editorial hero treatment');
assert.strictEqual((html.match(/class="gallery-image/g) || []).length, 0, 'Hero should not use a rotating portrait stack');
assert(html.includes('class="hero-portrait"'), 'Hero should use one strong portrait');

assert(!html.includes('newsletter-block'), 'Homepage should not include a newsletter conversion block');
assert(!/newsletter/i.test(html), 'Homepage should not mention newsletters');
assert(!/subscribe/i.test(html), 'Homepage should not mention subscribing');
assert(!html.includes('quote-carousel'), 'Homepage should not use the old quote carousel');
assert.strictEqual((html.match(/<blockquote/g) || []).length, 1, 'Homepage should keep a single pull quote');
assert(!html.includes('quote-dot'), 'Homepage should not render quote carousel dots');
assert.strictEqual((html.match(/class="start-title"/g) || []).length, 5, 'Start Here rows should separate titles for mobile layout');
assert.strictEqual((html.match(/class="start-meta"/g) || []).length, 5, 'Start Here rows should separate metadata for mobile layout');

assert(css.includes('--signal:'), 'Visual system should use a single signal accent token');
assert(css.includes('.editorial-hero'), 'CSS should style the editorial hero');
assert(css.includes('.start-meta'), 'CSS should style Start Here metadata separately');
assert(!css.includes('.newsletter-block'), 'CSS should not retain newsletter block styles');
assert(!css.includes('.premium-hero-gallery'), 'Old premium gallery styles should be removed');

assert(js.includes('aria-current'), 'JS should still set current nav state');
assert(!js.includes('quote-slide'), 'JS should not retain quote carousel behavior');
assert(!js.includes('2600'), 'JS should not retain fast hero gallery rotation');

console.log('visual-polish.test.js passed');
