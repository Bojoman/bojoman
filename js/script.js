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
   Reveal-on-scroll animations (enter + exit)
   ─────────────────────────────────────────────────────────── */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = '.reveal, .blog-featured-post, .blog-post, .blog-sidebar-section, .blog-newsletter, .project-card, .timeline-item, .device-card, .testimonial-card, .help-card';

  $$(revealElements).forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal-delay-1');
    if (i % 3 === 2) el.classList.add('reveal-delay-2');
    if (reduceMotion) el.classList.add('is-visible');
  });

  if (reduceMotion) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.classList.add('is-visible');
        el.classList.remove('is-leaving');
      } else {
        // Exit transition when scrolling away
        if (el.classList.contains('is-visible')) {
          el.classList.add('is-leaving');
          el.classList.remove('is-visible');
        }
      }
    });
  }, {
    threshold: 0.18,
    rootMargin: '0px 0px -8% 0px'
  });

  $$('.reveal').forEach(el => revealObserver.observe(el));
})();

/* ───────────────────────────────────────────────────────────
   Parallax scroll effects
   ─────────────────────────────────────────────────────────── */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const heroes = $$('[data-parallax]');
  const slowLayers = $$('.parallax-slow');
  if (!heroes.length && !slowLayers.length) return;

  let ticking = false;

  const update = () => {
    const y = window.scrollY || window.pageYOffset;

    heroes.forEach(hero => {
      const content = hero.querySelector('.hero-content, .project-hero-content, .blog-hero-content');
      const image = hero.querySelector('.hero-image');
      if (content) content.style.transform = `translate3d(0, ${y * 0.28}px, 0)`;
      if (image) image.style.transform = `translate3d(0, ${y * 0.14}px, 0)`;
    });

    slowLayers.forEach(layer => {
      const rect = layer.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -0.12;
      layer.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
    ticking = false;
  };

  on(window, 'scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  update();
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
window.bookCall = () => openNew('https://calendly.com/kaggwakarenge/30min');

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
  const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/Kaggwakarenge@gmail.com';

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
    // FormSubmit helpers
    formData.set('_captcha', 'false');
    formData.set('_template', 'table');
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
  "kaggwa-lab": {
    title: "Kaggwa in the Lab: Building Our First Digital Hub",
    image: "images/uploaded-15.jpeg",
    date: "February 20, 2025",
    readTime: "3 min read",
    tag: "In the Lab",
    content: `
      <p>What started as an empty room with a dirt floor and bare shelves has become a <strong>fully functioning digital computer lab</strong> serving over 200 students every week. This is the story of how we built it - with our own hands.</p>
      <h3>From Vision to Reality</h3>
      <p>When I first walked into the space that would become the Tech4Village Digital Hub, there was nothing but dust and a single wooden table. No electricity. No internet. No computers. Just a vision.</p>
      <p>Over three months, with the help of our community and generous donors, we transformed it step by step:</p>
      <ul>
        <li>Installed custom-built wooden desks to hold multiple workstations</li>
        <li>Set up solar-backed power infrastructure for reliable electricity</li>
        <li>Configured 10 refurbished desktop computers with educational software</li>
        <li>Mounted a shared display screen for group teaching sessions</li>
        <li>Stocked bookshelves with textbooks and reference materials</li>
      </ul>
      <h3>The First Day</h3>
      <p>When students walked in and saw the glowing screens, you could hear the gasps. Some had never seen a computer up close before. I stood there, arms crossed, watching their faces light up - and I knew every sleepless night of planning had been worth it.</p>
      <p>This lab isn't just a room with computers. It's a <strong>portal to possibility</strong> for kids who were told the digital world wasn't for them.</p>
    `
  },
  "lab-setup": {
    title: "Hands-On: Setting Up 10 Desktops From Scratch",
    image: "images/uploaded-14.jpeg",
    date: "February 12, 2025",
    readTime: "4 min read",
    tag: "In the Lab",
    content: `
      <p>Setting up a computer lab in a rural village isn't like plugging in a few machines at a school in the city. Every cable, every connection, every configuration has to be thought through carefully - because there's no IT department to call when something goes wrong.</p>
      <h3>The Setup Process</h3>
      <p>I spent three intense days in the lab, personally handling every step:</p>
      <ul>
        <li><strong>Day 1:</strong> Unpacking, cleaning, and testing all 10 refurbished desktop units. Three had bad RAM sticks that needed swapping.</li>
        <li><strong>Day 2:</strong> Installing Ubuntu Linux on every machine, pre-loading educational software (KA Lite for offline Khan Academy, LibreOffice, Scratch for coding).</li>
        <li><strong>Day 3:</strong> Wiring the network, configuring the local mesh, and stress-testing every machine with simultaneous use.</li>
      </ul>
      <h3>Challenges We Faced</h3>
      <p>The biggest challenge? <strong>Power management.</strong> With unreliable grid electricity, we had to configure aggressive power-saving modes and set up our solar backup to kick in automatically. I wrote a simple script that monitors battery levels and gracefully shuts down non-essential machines during low power.</p>
      <p>Every machine is now named after a famous African scientist - from Wangari Maathai to Philip Emeagwali. The students love it.</p>
    `
  },
  "first-session": {
    title: "First Lab Session: Teaching Typing & Internet Safety",
    image: "images/uploaded-13.jpeg",
    date: "February 8, 2025",
    readTime: "3 min read",
    tag: "In the Lab",
    content: `
      <p>The electricity was buzzing, the screens were glowing, and <strong>15 eager students</strong> sat in front of keyboards for the very first time. This was it - our inaugural lab session.</p>
      <h3>The Curriculum</h3>
      <p>I designed the first session around two core skills:</p>
      <ul>
        <li><strong>Typing basics:</strong> Using a fun typing game to teach keyboard familiarity. Within an hour, most students could type their own name!</li>
        <li><strong>Internet safety:</strong> Before anyone browses the web, they need to understand passwords, personal information, and how to spot scams.</li>
      </ul>
      <h3>Moments That Mattered</h3>
      <p>One student, 12-year-old Amina, typed her name and then burst into tears. "I made the computer say my name!" she said. Her classmates cheered. That single moment justified every hour of fundraising, every late night of configuration, every mile of travel.</p>
      <p>We now run three sessions per week: <strong>Monday</strong> for beginners, <strong>Wednesday</strong> for intermediate learners, and <strong>Friday</strong> for our advanced coding club. The lab is always full.</p>
    `
  },
  "school-donation": {
    title: "10 More Devices to Village School #3 - Thanks to Our Donors",
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
    title: "Supporting a World Bank-Led Digital Lab Design in South Sudan",
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
    title: "Solar Chargers Deployed With Laptops - First Off-Grid Computer Session",
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
    title: "Recognized During Advent Mass by Bishop Burbidge for Youth Service",
    image: "images/uploaded-05.jpeg",
    date: "December 24, 2024",
    readTime: "2 min read",
    tag: "Community",
    content: `
      <p>It was a profound honor to be recognized by <strong>Bishop Burbidge</strong> during the Advent Mass for the work we are doing with Tech4Village.</p>
      <p>Service is at the core of my faith and my leadership. This recognition isn't just for me, but for every volunteer and donor who has believed in this vision.</p>
      <p>The Bishop spoke about the power of youth using their talents to serve the marginalized. It was a reminder that our technical skills-coding, engineering, logistics-can be instruments of grace when used to lift others up.</p>
    `
  },
  "tech-post": {
    title: "Engineering Connectedness: Lazy Static Site Gen",
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
      <p><em>- Kaggwa Karenge<br>Founder - Tech4Village<br>Email: tech4village@gmail.com<br>Donate: CashApp $karenge | M-Pesa 0722961906</em></p>
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

// Floating particles removed - keep motion purposeful
function createFloatingParticles() {}

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
  // Intentionally light - scroll reveal & parallax init above
});

/* ───────────────────────────────────────────────────────────
   Global utility functions
   ─────────────────────────────────────────────────────────── */
// @ts-ignore
window.showDonationOptions = () => {
  window.location.href = 'donate.html';
};

/* End of unified script */