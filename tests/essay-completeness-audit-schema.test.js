const fs = require('fs');
const path = require('path');
const assert = require('assert');

const reportPath = path.resolve(__dirname, '..', 'reports', 'essay-completeness-audit.md');

assert(fs.existsSync(reportPath), 'essay completeness audit report should exist at reports/essay-completeness-audit.md');

const report = fs.readFileSync(reportPath, 'utf8');

['## FOUND', '## MISSING', '## LOW-CONFIDENCE'].forEach((heading) => {
  assert(report.includes(heading), `report should include section: ${heading}`);
});

const expectedHeader = '| Publication | Date | Title | URL | Suggested Imagery Source |';
const headerCount = (report.match(/\| Publication \| Date \| Title \| URL \| Suggested Imagery Source \|/g) || []).length;
assert(headerCount >= 3, 'report should contain schema table header in each section');

const foundSection = report.split('## FOUND')[1]?.split('## MISSING')[0] || '';
assert(/\|\s*[^|]+\s*\|\s*[^|]+\s*\|\s*[^|]+\s*\|\s*https?:\/\//.test(foundSection), 'FOUND section should include at least one populated row with URL');

console.log('essay-completeness-audit-schema.test.js passed');
