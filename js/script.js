// Mobile menu toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
if (mobileMenu && navLinks) {
  mobileMenu.addEventListener('click', function(e) {
    e.stopPropagation();
    navLinks.classList.toggle('active');
  });
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    const target = e.target;
    if (!navLinks.contains(target instanceof Node ? target : null) && !mobileMenu.contains(target instanceof Node ? target : null)) {
      navLinks.classList.remove('active');
    }
  });
}

// Timeline item click to expand details (works for mobile/touch)
if (document.querySelectorAll('.timeline-item').length) {
  document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('click', function() {
      this.classList.toggle('expanded');
    });
  });
}
// Photo gallery lightbox
if (document.querySelectorAll('.gallery-item img').length) {
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', function() {
      const lightbox = document.getElementById('lightbox');
      if (!lightbox) return;
      const lightboxImg = lightbox.querySelector('.lightbox-img');
      const lightboxCaption = lightbox.querySelector('.lightbox-caption');
      if (lightboxImg && lightboxCaption) {
        if (lightboxImg instanceof HTMLImageElement) {
          lightboxImg.src = this.src;
        }
        lightboxCaption.textContent = this.alt;
        lightbox.classList.add('active');
      }
    });
  });
}
// Close lightbox
const lightboxClose = document.querySelector('.lightbox-close');
if (lightboxClose) {
  lightboxClose.addEventListener('click', function() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.remove('active');
  });
}
// Close lightbox on background click
const lightboxEl = document.getElementById('lightbox');
if (lightboxEl) {
  lightboxEl.addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('active');
    }
  });
}