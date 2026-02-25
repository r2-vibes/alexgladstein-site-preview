const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');

const requiredPages = ['books', 'interviews', 'press', 'podcasts', 'essays', 'talks'];

const dataJs = fs.readFileSync(path.join(root, 'content-data.js'), 'utf8');
assert(dataJs.includes('window.CONTENT_DATA'), 'content-data.js should expose window.CONTENT_DATA');
requiredPages.forEach((slug) => {
  const sectionPattern = new RegExp(`(["']?${slug}["']?\\s*:\\s*\\{)`);
  assert(sectionPattern.test(dataJs), `content-data.js should include ${slug} data`);
  assert(/(["']?featured["']?\s*:\s*\[)/.test(dataJs), 'content-data.js should include featured array(s)');
  assert(/(["']?items["']?\s*:\s*\[)/.test(dataJs), 'content-data.js should include items array(s)');
});

const templateJs = fs.readFileSync(path.join(root, 'content-pages.js'), 'utf8');
assert(templateJs.includes('renderFeatured'), 'content-pages.js should render featured entries');
assert(templateJs.includes('renderPage'), 'content-pages.js should render paginated items');
assert(templateJs.includes('itemsPerPage = 4'), 'Pagination should show 4 items per page');
assert(templateJs.includes('pagination-next'), 'Should wire next pagination button');
assert(templateJs.includes('pagination-prev'), 'Should wire previous pagination button');

requiredPages.forEach((page) => {
  const html = fs.readFileSync(path.join(root, `${page}.html`), 'utf8');
  assert(html.includes('class="catalog-page"'), `${page}.html should include catalog page marker`);
  assert(html.includes(`data-page="${page}"`), `${page}.html should include page slug data attribute`);
  assert(html.includes('featured-grid'), `${page}.html should include featured section`);
  assert(html.includes('pagination'), `${page}.html should include pagination controls`);
  assert(html.includes('content-data.js'), `${page}.html should load content-data.js`);
  assert(html.includes('content-pages.js'), `${page}.html should load content-pages.js`);
});

const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
assert(css.includes('.catalog-shell'), 'styles.css should include catalog shell styles');
assert(css.includes('.timeline-card'), 'styles.css should include timeline card styles');
assert(css.includes('.pagination'), 'styles.css should include pagination styles');

console.log('content-pages.test.js passed');
