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
  "school-donation": {
    title: "🎓 10 More Devices to Village School #3 — Thanks to Our Donors",
    image: "images/uploaded-02.jpeg",
    date: "February 5, 2025",
    readTime: "2 min read",
    tag: "Impact",
    content: `
      <p>We are thrilled to announce the delivery of <strong>10 refurbished laptops</strong> to our third partner school in rural Kenya. This delivery marks a significant milestone in our mission to bridge the digital divide.</p>
      <h3>From Box to Classroom</h3>
      <p>These devices, donated by our generous supporters, were refurbished, tested, and pre-loaded with educational software before making the journey to the village. Upon arrival, the excitement was palpable.</p>
      <ul>
        <li>Students explored typing for the first time</li>
        <li>Teachers began integrating digital lessons</li>
        <li>The school administration committed to a secure storage plan</li>
      </ul>
      <p><strong>Thank You to Our Donors:</strong> Your contributions made this possible. These aren't just laptops; they are portals to the world for these students.</p>
    `
  },
  "world-bank": {
    title: "🌍 Supporting a World Bank–Led Digital Lab Design in South Sudan",
    image: "images/uploaded-03.jpeg",
    date: "January 28, 2025",
    readTime: "3 min read",
    tag: "Global",
    content: `
      <p>Tech4Village is honored to be consulting on the design of a new <strong>Digital Lab initiative in South Sudan</strong>, a project led by the World Bank.</p>
      <p>Our experience in deploying off-grid, rugged technical solutions in rural Kenya provided valuable insights for this large-scale project. We contributed research on:</p>
      <ul>
        <li>Solar power requirements for remote labs</li>
        <li>Offline-first educational content caching</li>
        <li>Community ownership models for sustainability</li>
      </ul>
      <p>It is humbling to see our grassroots "village model" influencing regional development strategies. Engineering is about solving real problems, and this project is a massive step forward.</p>
    `
  },
  "solar-chargers": {
    title: "☀️ Solar Chargers Deployed With Laptops — First Off-Grid Computer Session",
    image: "images/uploaded-04.jpeg",
    date: "January 15, 2025",
    readTime: "3 min read",
    tag: "Innovation",
    content: `
      <p>Power reliability is one of the biggest challenges in rural education. You can have the best laptops, but without power, they are just paperweights.</p>
      <p>This week, we successfully deployed our first batch of <strong>portable solar chargers</strong> alongside our laptop distribution. This allows students to hold computer sessions even when the main grid is down (or non-existent).</p>
      <p><strong>The Setup:</strong></p>
      <ul>
        <li>Foldable 60W Solar Panels</li>
        <li>High-capacity portable power banks</li>
        <li>Low-power consumption laptops</li>
      </ul>
      <p>Seeing a coding class run entirely on sunshine was a "lightbulb" moment for everyone involved!</p>
    `
  },
  "bishop-recognition": {
    title: "🙏 Recognized During Advent Mass by Bishop Burbidge for Youth Service",
    image: "images/uploaded-05.jpeg",
    date: "December 24, 2024",
    readTime: "2 min read",
    tag: "Community",
    content: `
      <p>It was a profound honor to be recognized by <strong>Bishop Burbidge</strong> during the Advent Mass for the work we are doing with Tech4Village.</p>
      <p>Service is at the core of my faith and my leadership. This recognition isn't just for me, but for every volunteer and donor who has believed in this vision.</p>
      <p>The Bishop spoke about the power of youth using their talents to serve the marginalized. It was a reminder that our technical skills—coding, engineering, logistics—can be instruments of grace when used to lift others up.</p>
    `
  },
  "tech-post": {
    title: "⚙️ Engineering Connectedness: Lazy Static Site Gen",
    image: "images/uploaded-06.jpeg",
    date: "February 1, 2025",
    readTime: "5 min read",
    tag: "Engineering",
    content: `
      <p>Maintenance is the enemy of side projects. I wanted Tech4Village.com to be fast and simple, but updating a pure HTML site manually is a pain.</p>
      <p>Instead of reaching for a heavy CMS like WordPress, I wrote a simple <strong>Static Site Generator</strong> script. It reads Markdown files and injecting them into my HTML template.</p>
      <p>Here is a snippet of the logic that handles our blog posts:</p>
      <pre style="background:#2d3748;color:#e2e8f0;padding:1rem;border-radius:8px;overflow-x:auto;"><code>
const fs = require('fs');
const marked = require('marked');

// Simple generator logic
function buildBlog() {
  const template = fs.readFileSync('./template.html', 'utf-8');
  const posts = fs.readdirSync('./posts');

  posts.forEach(post => {
    const content = fs.readFileSync(\`./posts/\${post}\`, 'utf-8');
    const html = marked.parse(content);
    // Inject and save...
  });
}
      </code>      </pre>
      <p>This simple engineering solution saves me hours of work, allowing me to focus on what matters: sourcing devices and helping students.</p>
      
      <h3 style="margin-top:2rem;">Bonus: Flashing OpenWRT for Rural Mesh</h3>
      <p>We often use commodity hardware for our village networks. Here is a snippet of the network config I use to prioritize educational traffic over social media on our solar-powered routers:</p>
      <pre style="background:#2d3748;color:#e2e8f0;padding:1rem;border-radius:8px;overflow-x:auto;"><code>
config rule
    option name 'Prioritize_Edu'
    option src 'lan'
    option dest 'wan'
    option proto 'tcp'
    option dest_port '80 443'
    option target 'MARK'
    option set_mark '0x1'

config qos 'wan'
    option interface 'wan'
    option upload '5000'
    option download '20000'
      </code></pre>
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