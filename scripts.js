document.addEventListener('DOMContentLoaded', () => {
  const galleryImages = Array.from(document.querySelectorAll('.gallery-image'));
  if (galleryImages.length > 1) {
    let galleryIndex = 0;
    setInterval(() => {
      galleryImages[galleryIndex].classList.remove('active');
      galleryIndex = (galleryIndex + 1) % galleryImages.length;
      galleryImages[galleryIndex].classList.add('active');
    }, 2000);
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
    setInterval(() => show((current + 1) % slides.length), 5000);
  }
});
