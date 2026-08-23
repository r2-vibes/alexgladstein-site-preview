const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'content', 'reflections-on-ai.json'), 'utf8'));

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const formatDate = (value) => new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
}).format(new Date(`${value}T00:00:00Z`));

const parts = data.parts.map((part) => {
  const text = fs.readFileSync(path.join(root, part.textFile), 'utf8').trimEnd();
  const paragraphs = text.split(/\n\n+/).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n          ');
  return `
      <article class="reflection-entry" id="part-${part.part}">
        <header class="reflection-entry-head">
          <p class="mono">Part ${part.part}</p>
          <div>
            <h2>Part ${part.part}</h2>
            <p class="reflection-date">${formatDate(part.published)}</p>
          </div>
        </header>
        <div class="reflection-prose">
          ${paragraphs}
        </div>
        <footer class="reflection-source">
          <a href="${part.sourceUrl}" target="_blank" rel="noopener">View the original post on X ↗</a>
        </footer>
      </article>`;
}).join('\n');

const partNav = data.parts.map((part) => `<a href="#part-${part.part}">Part ${part.part}</a>`).join('\n          ');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reflections on AI — Alex Gladstein</title>
  <meta name="description" content="Alex Gladstein's original, unedited reflections on artificial intelligence, freedom, and open systems." />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css?v=20260823a" />
</head>
<body class="reflections-page">
  <div class="noise"></div>
  <header class="site-header" id="siteHeader">
    <div class="shell nav-pill">
      <a class="brand" href="index.html">Alex Gladstein</a>
      <nav aria-label="Primary">
        <a href="index.html#start-here">Start Here</a>
        <a href="essays.html">Writing</a>
        <a href="podcasts.html">Watch &amp; Listen</a>
        <a href="books.html">Books</a>
        <a href="contact.html#speaking">Speaking</a>
        <a href="press.html">Press</a>
      </nav>
      <a class="start-here" href="contact.html#contact">Contact</a>
    </div>
  </header>

  <main>
    <section class="shell reflections-hero">
      <p class="mono">A continuing series</p>
      <h1>Reflections on <span>AI</span></h1>
      <div class="reflection-rule" aria-hidden="true"></div>
    </section>

    <nav class="shell part-nav" aria-label="Reflections on AI installments">
          ${partNav}
    </nav>

    <section class="shell reflections-entries">
${parts}
    </section>
  </main>

  <footer>
    <div class="shell footer-inner">
      <div>
        <h4>Alex Gladstein</h4>
        <p>Writing, thinking, and speaking about human rights, freedom technology, Bitcoin, and open systems.</p>
      </div>
      <div class="status"><span></span>Archive: Live</div>
    </div>
  </footer>
  <script src="scripts.js?v=20260702a"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(root, 'reflections-on-ai.html'), html);
console.log(`Rendered ${data.parts.length} Reflections on AI installment(s)`);
