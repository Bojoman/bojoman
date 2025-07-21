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

document.addEventListener('DOMContentLoaded', function() {
  // Handle timeline items touch/click events
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  timelineItems.forEach(item => {
    item.addEventListener('touchstart', function(e) {
      e.preventDefault(); // Prevent hover effects from interfering
      
      // If this item is already expanded, collapse it
      if (this.classList.contains('expanded')) {
        this.classList.remove('expanded');
        return;
      }
      
      // Collapse any other expanded items
      timelineItems.forEach(otherItem => {
        if (otherItem !== this) {
          otherItem.classList.remove('expanded');
        }
      });
      
      // Expand this item
      this.classList.add('expanded');
    });
  });
});

// Impact Counter Animation
function animateCounter(element, target) {
  let current = 0;
  const duration = 2000; // 2 seconds
  const step = target / (duration / 16); // Update every 16ms for smooth 60fps
  
  function update() {
    current += step;
    if (current < target) {
      element.textContent = Math.round(current);
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }
  
  update();
}

// Intersection Observer for counter animation
document.addEventListener('DOMContentLoaded', function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate each counter
        const counters = entry.target.querySelectorAll('[id$="-counter"]');
        counters.forEach(counter => {
          const target = parseInt(counter.textContent || '0');
          animateCounter(counter, target);
        });
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, { threshold: 0.5 });

  // Observe the counter section
  const counterSection = document.querySelector('.impact-counter');
  if (counterSection instanceof Element) {
    observer.observe(counterSection);
  }

  // Calendly Integration
  const bookCallButtons = document.querySelectorAll('#bookCallBtn, [onclick="bookCall()"]');
  bookCallButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      window.open('https://calendly.com/denomath4/30min', '_blank');
    });
  });
});

// Project Page Animations and Interactions
document.addEventListener('DOMContentLoaded', function() {
  // Add smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Add intersection observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // @ts-ignore
        entry.target.style.opacity = '1';
        // @ts-ignore
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe project cards
  document.querySelectorAll('.project-card').forEach(card => {
    // @ts-ignore
    card.style.opacity = '0';
    // @ts-ignore
    card.style.transform = 'translateY(20px)';
    // @ts-ignore
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });

  // Counter animation for stats
  function animateCounter(element, start, end, duration) {
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      element.textContent = current + (end >= 100 ? '+' : '');
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }

  // Animate counters when they come into view
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const number = entry.target.querySelector('.stat-number');
        if (number) {
      // @ts-ignore
          const finalNumber = parseInt(number.textContent.replace('+', ''));
          animateCounter(number, 0, finalNumber, 2000);
          statObserver.unobserve(entry.target);
        }
      }
    });
  });

  document.querySelectorAll('.stat-item').forEach(item => {
    statObserver.observe(item);
  });

  // Success Stories Auto-Rotation
  const carousel = document.querySelector('.stories-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.story-slide');
    let currentSlide = 0;

    function showNextSlide() {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }

    // Auto rotate every 4 seconds
    setInterval(showNextSlide, 4000);
  }

  // Common Functions
  // @ts-ignore
  window.bookCall = function() {
    window.open('https://calendly.com/denomath4/30min', '_blank');
  };

  // @ts-ignore
  window.showDonationOptions = function() {
    window.location.href = 'donate.html';
  };
    });