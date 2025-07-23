/* ═══════════════════════════════════════════════════════════
   Tech4Village - Optimized Unified JavaScript
   ═══════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────────
   Utility helpers
   ─────────────────────────────────────────────────────────── */
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);
const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);
const openNew = url => window.open(url, '_blank');

/* ───────────────────────────────────────────────────────────
   Mobile navigation
   ─────────────────────────────────────────────────────────── */
(() => {
  const burger = $('.mobile-menu');
  const links = $('.nav-links');
  if (!burger || !links) return;

  on(burger, 'click', e => {
    e.stopPropagation();
    links.classList.toggle('active');
  });

  on(document, 'click', e => {
    const target = e.target;
    if (!links.contains(target) && !burger.contains(target)) {
      links.classList.remove('active');
    }
  });
})();

/* ───────────────────────────────────────────────────────────
   Timeline interactions
   ─────────────────────────────────────────────────────────── */
$$('.timeline-item').forEach(item => {
  on(item, 'click', () => item.classList.toggle('expanded'));
  
  on(item, 'touchstart', e => {
    e.preventDefault();
    
    if (item.classList.contains('expanded')) {
      item.classList.remove('expanded');
      return;
    }
    
    // Collapse other expanded items
    $$('.timeline-item').forEach(other => {
      if (other !== item) other.classList.remove('expanded');
    });
    
    item.classList.add('expanded');
  }, { passive: false });
});

/* ───────────────────────────────────────────────────────────
   Gallery lightbox
   ─────────────────────────────────────────────────────────── */
(() => {
  const lightbox = $('#lightbox');
  if (!lightbox) return;
  
  const img = lightbox.querySelector('.lightbox-img');
  const caption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  // Open lightbox
  $$('.gallery-item img').forEach(pic => {
    on(pic, 'click', () => {
      if (img && caption) {
        img.src = pic.src;
        caption.textContent = pic.alt;
        lightbox.classList.add('active');
      }
    });
  });

  // Close lightbox
  const closeLightbox = () => lightbox.classList.remove('active');
  
  on(closeBtn, 'click', closeLightbox);
  on(lightbox, 'click', e => {
    if (e.target === lightbox) closeLightbox();
  });
})();

/* ───────────────────────────────────────────────────────────
   Universal counter animation (handles numbers & "+" suffix)
   ─────────────────────────────────────────────────────────── */
function animateCounter(el, duration = 2000) {
  const raw = el.textContent.trim();
  const hasPlus = raw.endsWith('+');
  const target = parseInt(raw.replace(/[^\d]/g, '')) || 0;

  let current = 0;
  const step = target / (duration / 16);

  function update() {
    current += step;
    if (current < target) {
      el.textContent = Math.round(current) + (hasPlus ? '+' : '');
      requestAnimationFrame(update);
    } else {
      el.textContent = target + (hasPlus ? '+' : '');
      el.classList.add('done');
    }
  }

  update();
}

/* Hero counters (immediate animation) */
$$('.project-hero-section .project-stat-number, .blog-hero .blog-stat-number')
  .forEach(el => animateCounter(el));

/* Impact counters (scroll-triggered) */
(() => {
  const impactSection = $('.impact-counter');
  if (!impactSection) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[id$="-counter"]').forEach(counter => {
          animateCounter(counter);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(impactSection);
})();

/* ───────────────────────────────────────────────────────────
   Reveal-on-scroll animations
   ─────────────────────────────────────────────────────────── */
(() => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // @ts-ignore
        Object.assign(entry.target.style, {
          opacity: '1',
          transform: 'translateY(0)'
        });
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Initialize and observe elements
  const revealElements = '.project-card, .stat-item, .blog-featured-post, .blog-post, .blog-sidebar-section, .blog-newsletter';
  
  $$(revealElements).forEach(el => {
    Object.assign(el.style, {
      opacity: '0',
      transform: 'translateY(20px)',
      transition: 'opacity 0.6s ease, transform 0.6s ease'
    });
    revealObserver.observe(el);
  });
})();

/* ───────────────────────────────────────────────────────────
   Success stories carousel
   ─────────────────────────────────────────────────────────── */
(() => {
  const carousel = $('.stories-carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.story-slide');
  const prevBtn = carousel.querySelector('.story-nav.prev');
  const nextBtn = carousel.querySelector('.story-nav.next');
  
  let currentIndex = 0;
  let timer;
  const AUTO_PLAY_DELAY = 8000;

  function goToSlide(index) {
    slides[currentIndex].classList.remove('active');
    currentIndex = (index + slides.length) % slides.length;
    slides[currentIndex].classList.add('active');
  }

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);
  
  const startAutoPlay = () => timer = setInterval(nextSlide, AUTO_PLAY_DELAY);
  const stopAutoPlay = () => clearInterval(timer);

  // Navigation controls
  on(nextBtn, 'click', () => { nextSlide(); startAutoPlay(); });
  on(prevBtn, 'click', () => { prevSlide(); startAutoPlay(); });

  // Pause on hover/focus
  ['mouseenter', 'focusin'].forEach(event => 
    on(carousel, event, stopAutoPlay));
  ['mouseleave', 'focusout'].forEach(event => 
    on(carousel, event, startAutoPlay));

  startAutoPlay();
})();

/* ───────────────────────────────────────────────────────────
   Smooth scrolling for anchor links
   ─────────────────────────────────────────────────────────── */
$$('a[href^="#"]').forEach(anchor => {
  on(anchor, 'click', e => {
    e.preventDefault();
    const target = $(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ───────────────────────────────────────────────────────────
   Navigation background on scroll
   ─────────────────────────────────────────────────────────── */
(() => {
  const nav = $('nav');
  if (!nav) return;

  const updateNavBackground = () => {
    if (window.scrollY > 50) {
      Object.assign(nav.style, {
        background: 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(20px)'
      });
    } else {
      Object.assign(nav.style, {
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)'
      });
    }
  };

  on(window, 'scroll', updateNavBackground);
})();

/* ───────────────────────────────────────────────────────────
   Calendly booking integration
   ─────────────────────────────────────────────────────────── */
// @ts-ignore
window.bookCall = () => openNew('https://calendly.com/denomath4/30min');

$$('#bookCallBtn, [onclick="bookCall()"]').forEach(btn => {
  on(btn, 'click', e => {
    e.preventDefault();
    // @ts-ignore
    window.bookCall();
  });
});

/* ───────────────────────────────────────────────────────────
   Donation page tab system
   ─────────────────────────────────────────────────────────── */
(() => {
  const tabs = $$('.donation-tab');
  const sections = $$('.donation-content');
  if (!tabs.length) return;

  const cleanTabName = text => 
    text.replace(/[^a-z ]/gi, '').trim().split(' ').pop().toLowerCase();

  const activateTab = tabName => {
    tabs.forEach(btn => 
      btn.classList.toggle('active', btn.dataset.tab === tabName));
    sections.forEach(section => 
      section.classList.toggle('active', section.id === `${tabName}-donation`));
  };

  // Initialize tabs
  tabs.forEach(btn => {
    if (!btn.dataset.tab) {
      btn.dataset.tab = cleanTabName(btn.textContent);
    }
    on(btn, 'click', () => activateTab(btn.dataset.tab));
  });

  // Activate first tab by default
  const defaultTab = ($('.donation-tab.active') || tabs[0]).dataset.tab;
  activateTab(defaultTab);

  // Global function for external use
  // @ts-ignore
  window.showDonationTab = activateTab;
})();

/* ───────────────────────────────────────────────────────────
   FormSubmit AJAX integration
   ─────────────────────────────────────────────────────────── */
(() => {
  const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/bojoman05@gmail.com';

  async function submitForm(form, extraData = {}) {
    const successMsg = form.querySelector('.success-message');
    const errorMsg = form.querySelector('.error-message');
    const spinner = form.querySelector('.loading-spinner');

    // Reset message states
    [successMsg, errorMsg].forEach(el => {
      if (el) el.style.display = 'none';
    });
    
    if (spinner) spinner.classList.add('spinning');

    const formData = new FormData(form);
    Object.entries(extraData).forEach(([key, value]) => 
      formData.set(key, value));

    try {
      const response = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        if (successMsg) successMsg.style.display = 'block';
      } else {
        if (errorMsg) errorMsg.style.display = 'block';
      }
    } catch (error) {
      if (errorMsg) errorMsg.style.display = 'block';
    } finally {
      if (spinner) spinner.classList.remove('spinning');
    }
  }

  // Newsletter form
  const newsletterForm = $('.blog-newsletter-form');
  if (newsletterForm) {
    on(newsletterForm, 'submit', e => {
      e.preventDefault();
      submitForm(newsletterForm);
    });
  }

  // Donation forms
  ['#device-form', '#volunteer-form'].forEach(selector => {
    const form = $(selector);
    if (form) {
      on(form, 'submit', e => {
        e.preventDefault();
        const subject = form.id === 'device-form' 
          ? 'New Device Donation' 
          : 'New Volunteer Application';
        submitForm(form, { _subject: subject });
      });
    }
  });

  // Contact form with inline spinner
  const contactForm = $('.contact-form form');
  if (contactForm) {
    // Create and append spinner
    const spinner = document.createElement('span');
    spinner.className = 'loading-spinner';
    Object.assign(spinner.style, {
      display: 'none',
      marginLeft: '.5rem',
      width: '14px',
      height: '14px',
      border: '2px solid #fff',
      borderRightColor: 'transparent',
      borderRadius: '50%',
      animation: 'spin .6s linear infinite'
    });
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.appendChild(spinner);

    on(contactForm, 'submit', e => {
      e.preventDefault();
      submitForm(contactForm, { _subject: 'Contact Form Message' });
    });
  }
})();

/* ───────────────────────────────────────────────────────────
   Blog modal system with full post data
   ─────────────────────────────────────────────────────────── */
const fullPosts = {
  "tradition-to-tech": {
    title: "🎙️ From Tradition to Tech: Why This Moment Sparked My Mission",
    image: "images/young-leader-speaking.jpeg",
    date: "December 15, 2024",
    readTime: "5 min read",
    tag: "Leadership",
    content: `
      <p>When I stood up to speak at my Kikuyu rite of passage, I wasn't just wearing tradition—I was stepping into it. The weight of generations rested on my shoulders, but so did the future.</p>
      <p>At 14, I was chosen to lead my ríka (age group). It was an honor that came with responsibility. As I looked around at my peers, I noticed something striking: in this sacred space of ancient wisdom, we were disconnected from the modern world.</p>
      <ul>
        <li>💻 No laptops for research</li>
        <li>📶 No Wi‑Fi for learning</li>
        <li>📱 No smartphones for connection</li>
      </ul>
      <p>This wasn't just about missing technology—it was about missing opportunities. In that moment, I realized: our traditions don't have to compete with technology. They can complement each other.</p>
      <p>Now, at 17, I'm leading Tech4Village to bridge this gap. We collect and distribute refurbished devices, but we do more than that. We're creating a future where tradition and technology walk hand in hand.</p>
      <p><strong>And I'm just getting started.</strong></p>
    `
  },
  "crawl-forward": {
    title: "🥾 Crawl Forward Anyway: Lessons from the Mud",
    image: "images/crawling-through-the-mud.jpeg",
    date: "December 10, 2024",
    readTime: "4 min read",
    tag: "Resilience",
    content: `
      <p>This photo was taken during my rite of passage leadership training deep in the forest. We had to crawl through narrow, muddy tunnels with no light but our determination.</p>
      <p>We started at dawn, the forest floor damp from last night's rain. My heart pounded as I pressed my body flat against the earth. The tunnel seemed endless, but we had each other's voices for guidance.</p>
      <h3>What the mud taught me:</h3>
      <ul>
        <li>Resilience isn't about speed—it's about persistence</li>
        <li>Leadership means guiding others even when you can't see the way</li>
        <li>Progress happens one inch at a time</li>
      </ul>
      <p>That same determination fuels Tech4Village. When resources are scarce, we crawl forward anyway—finding solutions one step at a time.</p>
      <p><strong>Because progress often looks messy—but it starts with a single crawl.</strong></p>
    `
  },
  "tech-hub": {
    title: "🤝 Building Dreams: Our First Tech Hub",
    image: "images/kaggwa-team.jpeg",
    date: "December 5, 2024",
    readTime: "6 min read",
    tag: "Community",
    content: `
      <p>What started as a simple idea has grown into a movement. Today, we celebrated the opening of our first community tech hub in Kikuyu village.</p>
      <p>The space isn't just about computers—it's about connection. Students gather here not just to learn coding, but to dream bigger than they ever thought possible.</p>
      <h3>What makes our hub special:</h3>
      <ul>
        <li>Solar‑powered workstations</li>
        <li>Community‑led workshops</li>
        <li>Peer mentorship program</li>
        <li>Cultural integration</li>
      </ul>
      <p>We've created more than a computer lab—we've built a bridge between tradition and innovation. A place where elders share stories while youth explore digital horizons.</p>
      <p><strong>This is just the beginning of our tech‑hub network.</strong></p>
    `
  },
  "real-impact": {
    title: "🌟 Beyond Devices: The Real Impact",
    image: "images/kagwa-speaking.jpeg",
    date: "November 30, 2024",
    readTime: "4 min read",
    tag: "Impact",
    content: `
      <p>Numbers tell one story, but the real impact lies in the lives changed. Meet Sarah, a 15‑year‑old who discovered coding through our program.</p>
      <p>"I never thought computers were for me," she told me. "Now I'm building websites for local businesses." Sarah's story is one of many that show the transformative power of access to technology.</p>
      <h3>Impact Highlights:</h3>
      <ul>
        <li>5 students started freelancing</li>
        <li>3 local businesses went digital</li>
        <li>1 mobile app in development</li>
        <li>Countless dreams unlocked</li>
      </ul>
      <p>Every device we distribute isn't just a piece of technology—it's a key to unlock potential. A bridge to possibilities previously unimagined.</p>
      <p><strong>This is the real impact: dreams taking digital flight.</strong></p>
    `
  }
};

// @ts-ignore
window.openFullPost = key => {
  const post = fullPosts[key];
  const modal = $('#blog-fullPostModal');
  const content = $('#blog-fullPostContent');
  
  if (!post || !modal || !content) return;

  content.innerHTML = `
    <article class="blog-modal-body">
      <img src="${post.image}" alt="${post.title}" class="blog-modal-image" />
      <h1>${post.title}</h1>
      <div class="blog-modal-meta">
        <span class="blog-post-tag">${post.tag}</span>
        <span>${post.date}</span>
        <span>${post.readTime}</span>
      </div>
      ${post.content}
      <hr style="margin:2rem 0;border:none;border-top:1px solid var(--border);" />
      <p><em>— Kaggwa Karenge<br>Founder – Tech4Village<br>📧 tech4village@gmail.com<br>💸 Donate: CashApp $karenge | M‑Pesa 0722961906</em></p>
    </article>
  `;

  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

// @ts-ignore
window.closeFullPost = () => {
  const modal = $('#blog-fullPostModal');
  if (!modal) return;
  
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

// Close modal on Escape key
on(document, 'keydown', e => {
  // @ts-ignore
  if (e.key === 'Escape') window.closeFullPost();
});

/* ───────────────────────────────────────────────────────────
   Advanced UI enhancements
   ─────────────────────────────────────────────────────────── */

// Copy to clipboard utility
// @ts-ignore
window.copyText = text => {
  navigator.clipboard?.writeText(text).then(() => {
    // Create temporary feedback
    const feedback = document.createElement('div');
    feedback.textContent = `Copied: ${text}`;
    feedback.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 9999;
      background: #059669; color: white; padding: 8px 16px;
      border-radius: 4px; font-size: 14px;
      animation: slideIn 0.3s ease, slideOut 0.3s ease 2s forwards;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 2500);
  }).catch(() => {
    alert(`Copied: ${text}`);
  });
};

// Typewriter effect for hero quotes
function typeWriter(element, text, speed = 30) {
  let index = 0;
  element.textContent = '';
  
  function type() {
    if (index < text.length) {
      element.textContent += text[index++];
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Floating particles for hero sections
function createFloatingParticles() {
  const hero = $('.blog-hero');
  if (!hero) return;

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    Object.assign(particle.style, {
      position: 'absolute',
      width: '2px',
      height: '2px',
      background: 'rgba(255,255,255,0.3)',
      borderRadius: '50%',
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
      animationDelay: `${Math.random() * 2}s`
    });
    hero.appendChild(particle);
  }
}

/* ───────────────────────────────────────────────────────────
   CSS animations and styles injection
   ─────────────────────────────────────────────────────────── */
(() => {
  const styles = document.createElement('style');
  styles.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
    .loading-spinner.spinning {
      display: inline-block !important;
    }
  `;
  document.head.appendChild(styles);
})();

/* ───────────────────────────────────────────────────────────
   DOM ready initialization
   ─────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize typewriter effect for hero quotes
  const heroQuote = $('.blog-hero p');
  if (heroQuote) {
    const originalText = heroQuote.textContent;
    setTimeout(() => typeWriter(heroQuote, originalText), 500);
  }
  
  // Initialize floating particles
  setTimeout(createFloatingParticles, 100);
});

/* ───────────────────────────────────────────────────────────
   Global utility functions
   ─────────────────────────────────────────────────────────── */
// @ts-ignore
window.showDonationOptions = () => {
  window.location.href = 'donate.html';
};

/* End of unified script */