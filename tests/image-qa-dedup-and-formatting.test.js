const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const pagesJs = fs.readFileSync(path.join(root, 'content-pages.js'), 'utf8');
const dataSrc = fs.readFileSync(path.join(root, 'content-data.js'), 'utf8');

const sandbox = { window: {}, document: { addEventListener: () => {} } };
vm.createContext(sandbox);
vm.runInContext(dataSrc, sandbox);
vm.runInContext(pagesJs, sandbox);

assert(
  typeof sandbox.window.reorderItemsForVisibleUniqueness === 'function',
  'content-pages.js should expose window.reorderItemsForVisibleUniqueness(featured, items)'
);

['books', 'press'].forEach((section) => {
  const sectionData = sandbox.window.CONTENT_DATA[section];
  const ordered = sandbox.window.reorderItemsForVisibleUniqueness(sectionData.featured, sectionData.items);
  const visibleImages = [
    ...sectionData.featured.map((x) => x.image),
    ...ordered.slice(0, 4).map((x) => x.image)
  ];
  const duplicateVisible = visibleImages.filter((img, idx) => visibleImages.indexOf(img) !== idx);
  assert.strictEqual(
    duplicateVisible.length,
    0,
    `${section} should have no repeated imagery across featured + first timeline viewport`
  );
});

assert(
  css.includes('.catalog-page[data-page="books"] .catalog-image { object-fit: contain;'),
  'Books catalog images should keep object-fit contain for readability'
);
assert(
  css.includes('aspect-ratio: 3 / 4;'),
  'Books catalog images should enforce a readable 3:4 cover ratio'
);
assert(
  css.includes('object-position: center;'),
  'Books catalog images should be centered for cover legibility'
);

console.log('image-qa-dedup-and-formatting.test.js passed');
