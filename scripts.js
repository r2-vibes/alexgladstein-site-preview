document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const currentPath = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('nav a').forEach((a) => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === currentPath) a.setAttribute('aria-current', 'page');
  });

  const galleryImages = Array.from(document.querySelectorAll('.gallery-image'));
  if (galleryImages.length > 1) {
    let galleryIndex = 0;
    if (!reduceMotion) setInterval(() => {
      galleryImages[galleryIndex].classList.remove('active');
      galleryIndex = (galleryIndex + 1) % galleryImages.length;
      galleryImages[galleryIndex].classList.add('active');
    }, 5000);
  }

  const slides = Array.from(document.querySelectorAll('.quote-slide'));
  const dots = Array.from(document.querySelectorAll('.quote-dot'));
  if (slides.length > 0 && dots.length === slides.length) {
    let current = 0;

    const show = (i) => {
      slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
      dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
      current = i;
    };

    dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
    if (!reduceMotion) setInterval(() => show((current + 1) % slides.length), 5000);
  }
});
