const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const reportPath = path.join(root, 'audits', 'tomorrow-fixlist.json');

assert(fs.existsSync(reportPath), 'tomorrow-fixlist.json must exist at audits/tomorrow-fixlist.json');

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
assert.strictEqual(report.report, 'tomorrow-fixlist', 'report.report must equal "tomorrow-fixlist"');
assert(Array.isArray(report.issues), 'report.issues must be an array');
assert(report.issues.length > 0, 'report.issues must not be empty');

const allowedKinds = new Set([
  'missing_item',
  'broken_link',
  'duplicate_title',
  'duplicate_top_fold_imagery'
]);

for (const [idx, issue] of report.issues.entries()) {
  assert(issue.id && issue.id.trim(), `issue[${idx}] must include non-empty id`);
  assert(allowedKinds.has(issue.kind), `issue[${idx}] has unsupported kind: ${issue.kind}`);
  assert(['P0', 'P1', 'P2', 'P3'].includes(issue.priority), `issue[${idx}] has invalid priority`);
  assert(typeof issue.confidence === 'number' && issue.confidence >= 0 && issue.confidence <= 1, `issue[${idx}] confidence must be 0..1`);
  assert(Array.isArray(issue.targets) && issue.targets.length > 0, `issue[${idx}] targets must be a non-empty array`);

  for (const [tidx, target] of issue.targets.entries()) {
    assert(target.file && target.file.trim(), `issue[${idx}].targets[${tidx}] missing file`);
    assert(Number.isInteger(target.line) && target.line > 0, `issue[${idx}].targets[${tidx}] line must be positive integer`);
  }
}

const priorities = report.issues.map((x) => x.priority);
const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
for (let i = 1; i < priorities.length; i += 1) {
  assert(rank[priorities[i]] >= rank[priorities[i - 1]], 'issues should be sorted by priority (P0..P3)');
}

console.log('tomorrow-fixlist.test.js passed');
