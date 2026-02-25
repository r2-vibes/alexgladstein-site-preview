const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const pages = ['books', 'podcasts', 'essays', 'talks', 'press', 'interviews'];

const js = fs.readFileSync(path.join(root, 'content-pages.js'), 'utf8');
assert(js.includes('function hydrateCardImages'), 'JS should define image hydration fallback helper');
assert(js.includes('onerror'), 'JS should attach onerror fallback for entry imagery');
assert(js.includes("loading=\"lazy\""), 'Cards should lazy-load images');
assert(js.includes('pageEl.dataset.page'), 'JS should scope behavior to each subpage slug');
assert(js.includes('window.addEventListener(\'keydown\''), 'Pagination should support keyboard navigation');
assert(js.includes('scrollTo({ top:'), 'Pagination should scroll timeline section into view');
assert(js.includes('aria-live'), 'Pagination status should be screen-reader friendly');

const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
assert(css.includes('.catalog-hero'), 'Subpages should have a premium hero treatment');
assert(css.includes('.hero-accent-orb'), 'Hero should include accent glow treatment');
assert(css.includes('.feature-card:hover'), 'Featured cards should have premium hover state');
assert(css.includes('.timeline-card:hover'), 'Timeline cards should have premium hover state');
assert(css.includes('scroll-snap-type: x mandatory'), 'Featured strip should have clean carousel/scroll-snap UX');
assert(css.includes('.pagination button:focus-visible'), 'Pagination controls should have visible focus treatment');

pages.forEach((slug) => {
  const html = fs.readFileSync(path.join(root, `${slug}.html`), 'utf8');
  assert(html.includes('class="shell catalog-shell catalog-hero"'), `${slug}.html should use enhanced hero wrapper`);
  assert(html.includes('hero-accent-orb'), `${slug}.html should include hero accent orb`);
  assert(html.includes('aria-live="polite"'), `${slug}.html should include aria-live page indicator`);
  assert(html.includes(`<title>${slug.charAt(0).toUpperCase() + slug.slice(1)} — Alex Gladstein</title>`), `${slug}.html title should be clean`);
});

console.log('subpages-premium.test.js passed');
