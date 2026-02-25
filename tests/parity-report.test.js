const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const inventoryPath = path.join(root, 'legacy-scrape', 'legacy-source-inventory.json');
const reportPath = path.join(root, 'legacy-scrape', 'parity-report.json');

assert(fs.existsSync(inventoryPath), 'legacy source inventory should exist');
assert(fs.existsSync(reportPath), 'parity report should exist');

const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

['books', 'podcasts', 'essays', 'talks', 'press', 'interviews'].forEach((section) => {
  assert(inventory.sections[section], `inventory should include ${section}`);
  assert(report.sections[section], `parity report should include ${section}`);
  assert(report.sections[section].old_total >= 0, `${section} old_total should be numeric`);
  assert(report.sections[section].new_total >= report.sections[section].old_total, `${section} should meet or exceed old total`);
  assert.strictEqual(report.sections[section].missing.length, 0, `${section} should have zero missing entries`);
});

console.log('parity-report.test.js passed');
