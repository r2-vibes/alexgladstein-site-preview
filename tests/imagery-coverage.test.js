const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const contentPath = path.join(root, 'content-data.js');
const reportPath = path.join(root, 'images', 'archive', 'IMAGERY-STATUS.md');

const source = fs.readFileSync(contentPath, 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(source, sandbox);

const data = sandbox.window.CONTENT_DATA;
assert(data, 'window.CONTENT_DATA should be defined');

const sections = ['podcasts', 'talks', 'essays', 'press', 'interviews'];

sections.forEach((section) => {
  const items = data[section]?.items || [];
  assert(items.length >= 5, `${section} should have at least 5 items`);

  const top5 = items.slice(0, 5);
  top5.forEach((item, idx) => {
    assert(item.image, `${section}.items[${idx}] should include image`);
    assert(/^images\/archive\//.test(item.image), `${section}.items[${idx}] image should point to archive path`);
    const fullPath = path.join(root, item.image);
    assert(fs.existsSync(fullPath), `${section}.items[${idx}] image file should exist: ${item.image}`);
  });

  const featured = data[section]?.featured || [];
  featured.forEach((item, idx) => {
    assert(item.image, `${section}.featured[${idx}] should include image`);
    const fullPath = path.join(root, item.image);
    assert(fs.existsSync(fullPath), `${section}.featured[${idx}] image file should exist: ${item.image}`);
  });
});

assert(fs.existsSync(reportPath), 'IMAGERY-STATUS.md should exist');
const report = fs.readFileSync(reportPath, 'utf8');
sections.forEach((section) => {
  assert(report.includes(section), `report should mention ${section}`);
});

console.log('imagery-coverage.test.js passed');
