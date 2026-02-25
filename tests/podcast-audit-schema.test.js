const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const REPORT_PATH = path.join(__dirname, '..', 'audit', 'podcast-completeness-audit-2026-02-24.md');

function extractSection(md, name) {
  const re = new RegExp(`## ${name}\\n([\\s\\S]*?)(?=\\n## |$)`, 'm');
  const m = md.match(re);
  return m ? m[1].trim() : null;
}

function parseTableRows(sectionText) {
  if (!sectionText) return [];
  const lines = sectionText.split('\n').map(l => l.trim()).filter(Boolean);
  return lines.filter(l => l.startsWith('|') && !/^\|[- ]+\|/.test(l) && !l.includes('title | date | source_url')).slice(0);
}

test('podcast audit report follows required schema', () => {
  assert.ok(fs.existsSync(REPORT_PATH), `Missing report file: ${REPORT_PATH}`);
  const md = fs.readFileSync(REPORT_PATH, 'utf8');

  for (const sectionName of ['FOUND', 'MISSING', 'LOW-CONFIDENCE']) {
    const section = extractSection(md, sectionName);
    assert.ok(section, `Missing section: ${sectionName}`);

    const rows = parseTableRows(section);
    // Allow empty sections but if rows exist enforce schema.
    for (const row of rows) {
      const cols = row.split('|').slice(1, -1).map(s => s.trim());
      assert.equal(cols.length, 6, `Expected 6 columns in row: ${row}`);
      assert.ok(cols[0].length > 0, 'title required');
      assert.ok(/\d{4}|Unknown/i.test(cols[1]), `date should include year or Unknown: ${cols[1]}`);
      assert.ok(/^https?:\/\//.test(cols[2]), `source_url must be URL: ${cols[2]}`);
      assert.ok(/^https?:\/\//.test(cols[3]), `evidence_url must be URL: ${cols[3]}`);
      assert.ok(/high|medium|low/i.test(cols[4]), `confidence must include high/medium/low: ${cols[4]}`);
      assert.ok(/^https?:\/\//.test(cols[5]) || /^N\/A$/i.test(cols[5]), `recommended_image_source must be URL or N/A: ${cols[5]}`);
    }
  }
});
