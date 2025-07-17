// ─── Calendly URL (hidden) ───────────────────────────────────────────────────
const CALENDLY_URL = 'https://calendly.com/denomath4/30min';

document.addEventListener('DOMContentLoaded', () => {
  // Book a 15‑min Call
  const bookBtn = document.getElementById('bookCallBtn');
  if (bookBtn) {
    bookBtn.addEventListener('click', e => {
      e.preventDefault();
      window.open(CALENDLY_URL, '_blank', 'noopener');
    });
  }

  // Mobile menu toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
      mobileMenu.addEventListener('click', function() {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
          navLinks.classList.toggle('active');
        }
      });
    }

  // Counter animation
  setTimeout(() => {
    document.querySelectorAll('[id$="-counter"]').forEach(el => {
      // @ts-ignore
      const target = +el.textContent;
      let count = 0;
      const step = Math.ceil(target / 100);
      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          // @ts-ignore
          el.textContent = target;
          clearInterval(timer);
        } else {
          // @ts-ignore
          el.textContent = count;
        }
      }, 20);
    });
  }, 500);

  // Smooth scroll for in‑page anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      if (href) {
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Fade‑in on scroll
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // @ts-ignore
        entry.target.style.animation = 'fadeInUp .8s ease-out forwards';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.project-card, .section h2')
    .forEach(el => observer.observe(el));
});

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      const navLinks = document.querySelector('.nav-links');
      const mobileMenu = document.querySelector('.mobile-menu');
      
      // @ts-ignore
      if (navLinks && mobileMenu && !navLinks.contains(e.target) && !mobileMenu.contains(e.target)) {
        navLinks.classList.remove('active');
      }
    });