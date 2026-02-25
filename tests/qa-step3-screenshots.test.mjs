import { access } from 'node:fs/promises';

const required = [
  'screenshots/qa-step3-current/homepage-full.png',
  'screenshots/qa-step3-current/homepage-featured-focus.png',
  'screenshots/qa-step3-current/books-full.png',
  'screenshots/qa-step3-current/books-featured-focus.png',
  'screenshots/qa-step3-current/books-chronology-focus.png',
  'screenshots/qa-step3-current/interviews-full.png',
  'screenshots/qa-step3-current/interviews-top-grid-focus.png'
];

let missing = [];
for (const file of required) {
  try {
    await access(file);
  } catch {
    missing.push(file);
  }
}

if (missing.length) {
  throw new Error(`Missing screenshot artifacts:\n${missing.join('\n')}`);
}

console.log('All required Step 3 screenshot artifacts are present.');
