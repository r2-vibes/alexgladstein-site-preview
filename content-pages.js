function reorderItemsForVisibleUniqueness(featured = [], items = []) {
  const featuredImages = new Set((featured || []).map((item) => item.image).filter(Boolean));
  const uniqueFirst = [];
  const repeatedLater = [];

  (items || []).forEach((item) => {
    if (item?.image && featuredImages.has(item.image)) repeatedLater.push(item);
    else uniqueFirst.push(item);
  });

  return [...uniqueFirst, ...repeatedLater];
}

if (typeof window !== 'undefined') {
  window.reorderItemsForVisibleUniqueness = reorderItemsForVisibleUniqueness;
}

document.addEventListener('DOMContentLoaded', () => {
  const pageEl = document.querySelector('.catalog-page');
  if (!pageEl || !window.CONTENT_DATA) return;

  const slug = pageEl.dataset.page;
  const data = window.CONTENT_DATA[slug];
  if (!data) return;

  const itemsPerPage = 4;
  let pageIndex = 0;
  const orderedItems = reorderItemsForVisibleUniqueness(data.featured, data.items);

  const labelEl = pageEl.querySelector('[data-field="label"]');
  const titleEl = pageEl.querySelector('[data-field="title"]');
  const subtitleEl = pageEl.querySelector('[data-field="subtitle"]');
  if (labelEl) labelEl.textContent = data.label;
  if (titleEl) titleEl.textContent = data.title;
  if (subtitleEl) subtitleEl.textContent = data.subtitle;

  const featuredGrid = pageEl.querySelector('.featured-grid');
  const timelineGrid = pageEl.querySelector('.timeline-grid');
  const pageIndicator = pageEl.querySelector('.page-indicator');
  const prevBtn = pageEl.querySelector('.pagination-prev');
  const nextBtn = pageEl.querySelector('.pagination-next');

  const fallbackPools = {
    books: ['images/trojan-horse/1.jpg', 'images/trojan-horse/2.jpg', 'images/trojan-horse/3.jpg'],
    essays: ['images/alex-speaking-1.jpg', 'images/alex-speaking-2.jpg', 'images/alex-speaking-3.jpg'],
    podcasts: ['images/alex-speaking-2.jpg', 'images/alex-speaking-3.jpg', 'images/alex-speaking-1.jpg'],
    talks: ['images/alex-speaking-3.jpg', 'images/alex-speaking-1.jpg', 'images/alex-speaking-2.jpg'],
    press: ['images/alex-speaking-1.jpg', 'images/alex-speaking-3.jpg', 'images/alex-speaking-2.jpg'],
    interviews: ['images/alex-speaking-2.jpg', 'images/alex-speaking-1.jpg', 'images/alex-speaking-3.jpg']
  };

  function getFallbackImage(idx) {
    const pool = fallbackPools[slug] || fallbackPools.essays;
    return pool[idx % pool.length];
  }

  function hydrateCardImages(scope = pageEl) {
    const imgs = scope.querySelectorAll('.catalog-image');
    imgs.forEach((img, idx) => {
      img.onerror = () => {
        if (!img.dataset.fallbackApplied) {
          img.dataset.fallbackApplied = 'true';
          img.src = img.dataset.fallback || getFallbackImage(idx);
        }
      };
    });
  }

  function updatePaginationState(totalPages) {
    pageIndicator.textContent = `Page ${pageIndex + 1} of ${totalPages}`;
    pageIndicator.setAttribute('aria-live', 'polite');
    prevBtn.disabled = pageIndex === 0;
    nextBtn.disabled = pageIndex >= totalPages - 1;
    const hidden = totalPages <= 1;
    pageIndicator.parentElement.hidden = hidden;
  }

  function renderFeatured() {
    featuredGrid.innerHTML = data.featured.map((item, idx) => `
      <article class="feature-card">
        <img class="catalog-image" src="${item.image || getFallbackImage(idx)}" data-fallback="${getFallbackImage(idx)}" alt="${item.title}" loading="lazy" decoding="async" />
        <p class="meta">${item.meta}</p>
        <h3>${item.title}</h3>
        <p>${item.blurb}</p>
        <div class="feature-foot">
          <span>${item.tag || 'Featured'}</span>
          <a href="${item.link}" target="_blank" rel="noopener">Open ↗</a>
        </div>
      </article>
    `).join('');
    hydrateCardImages(featuredGrid);
  }

  function renderPage() {
    const start = pageIndex * itemsPerPage;
    const pageItems = orderedItems.slice(start, start + itemsPerPage);

    timelineGrid.innerHTML = pageItems.map((item, idx) => `
      <article class="timeline-card">
        <img class="catalog-image" src="${item.image || getFallbackImage(start + idx)}" data-fallback="${getFallbackImage(start + idx)}" alt="${item.title}" loading="lazy" decoding="async" />
        <p class="meta">${item.date} · ${item.outlet}</p>
        <h3>${item.title}</h3>
        <p>${item.blurb}</p>
        <a href="${item.link}" target="_blank" rel="noopener">Read more</a>
      </article>
    `).join('');

    const totalPages = Math.ceil(orderedItems.length / itemsPerPage);
    updatePaginationState(totalPages);
    hydrateCardImages(timelineGrid);
  }

  function goToPage(nextPage) {
    const totalPages = Math.ceil(orderedItems.length / itemsPerPage);
    const clamped = Math.max(0, Math.min(nextPage, totalPages - 1));
    if (clamped === pageIndex) return;
    pageIndex = clamped;
    renderPage();
    const top = timelineGrid.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => goToPage(pageIndex - 1));
  nextBtn.addEventListener('click', () => goToPage(pageIndex + 1));

  window.addEventListener('keydown', (event) => {
    if (!pageEl.contains(document.activeElement)) return;
    if (event.key === 'ArrowLeft') goToPage(pageIndex - 1);
    if (event.key === 'ArrowRight') goToPage(pageIndex + 1);
  });

  renderFeatured();
  renderPage();
});
