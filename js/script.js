// Mobile menu toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
if (mobileMenu && navLinks) {
  mobileMenu.addEventListener('click', function (e) {
    e.stopPropagation();
    navLinks.classList.toggle('active');
  });
  // Close mobile menu when clicking outside
  document.addEventListener('click', function (e) {
    const target = e.target;
    if (!navLinks.contains(target instanceof Node ? target : null) && !mobileMenu.contains(target instanceof Node ? target : null)) {
      navLinks.classList.remove('active');
    }
  });
}

// Timeline item click to expand details (works for mobile/touch)
if (document.querySelectorAll('.timeline-item').length) {
  document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('click', function () {
      this.classList.toggle('expanded');
    });
  });
}

// Photo gallery lightbox
if (document.querySelectorAll('.gallery-item img').length) {
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', function () {
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
  lightboxClose.addEventListener('click', function () {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.remove('active');
  });
}

// Close lightbox on background click
const lightboxEl = document.getElementById('lightbox');
if (lightboxEl) {
  lightboxEl.addEventListener('click', function (e) {
    if (e.target === this) {
      this.classList.remove('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // Handle timeline items touch/click events
  const timelineItems = document.querySelectorAll('.timeline-item');

  timelineItems.forEach(item => {
    item.addEventListener('touchstart', function (e) {
      e.preventDefault();

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
  const step = target / (duration / 16);

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
document.addEventListener('DOMContentLoaded', function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate each counter
        const counters = entry.target.querySelectorAll('[id$="-counter"]');
        counters.forEach(counter => {
          const target = parseInt(counter.textContent || '0');
          animateCounter(counter, target);
        });
        observer.unobserve(entry.target);
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
    button.addEventListener('click', function (e) {
      e.preventDefault();
      window.open('https://calendly.com/denomath4/30min', '_blank');
    });
  });
});

// Project Page Animations and Interactions

// @ts-ignore
/* ░░ Counter animator that keeps trailing "+" ░░ */
function animateCounter(el, duration = 2000) {
  const raw = el.textContent.trim();
  const hasPlus = raw.endsWith('+');
  const target = parseInt(raw.replace('+', '')) || 0;

  let cur = 0, step = target / (duration / 16);

  (function tick() {
    cur += step;
    if (cur < target) {
      el.textContent = Math.round(cur) + (hasPlus ? '+' : '');
      requestAnimationFrame(tick);
    } else {
      el.textContent = target + (hasPlus ? '+' : '');
      el.classList.add('done');
    }
  })();
}

/* ░░ Blog‑hero counters  ░░ */
document.querySelectorAll('.blog-hero        .blog-stat-number')
  .forEach(el => animateCounter(el));

/* ░░ Hero stat counters ░░ */
document.querySelectorAll('.project-hero-section .project-stat-number')
  // @ts-ignore
  .forEach(num => animateCounter(num, parseInt(num.textContent) || 0));

/* ░░ Impact‑section counters ░░ */
const impactObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[id$="-counter"]').forEach(c => {
        // @ts-ignore
        animateCounter(c, parseInt(c.textContent) || 0);
      });
      impactObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const impactSection = document.querySelector('.impact-counter');
if (impactSection) impactObserver.observe(impactSection);

/* ░░ Project‑cards & stat reveal ░░ */
const revealOpt = { threshold: 0.1, rootMargin: '0px 0px -50px' };
const revealObs = new IntersectionObserver((ents, obs) => {
  ents.forEach(ent => {
    if (ent.isIntersecting) {
      // @ts-ignore
      ent.target.style.opacity = '1';
      // @ts-ignore
      ent.target.style.transform = 'translateY(0)';
      obs.unobserve(ent.target);
    }
  });
}, revealOpt);
document.querySelectorAll('.project-card, .stat-item')
  .forEach(el => {
    // @ts-ignore
    el.style.opacity = '0';
    // @ts-ignore
    el.style.transform = 'translateY(20px)';
    // @ts-ignore
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    revealObs.observe(el);
  });

/* ░░ Success‑stories carousel ░░ */
const carousel = document.querySelector('.stories-carousel');
if (carousel) {
  const slides = carousel.querySelectorAll('.story-slide');
  const prevBtn = carousel.querySelector('.story-nav.prev');
  const nextBtn = carousel.querySelector('.story-nav.next');
  let cur = 0, timer;
  const DELAY = 8000;
  const show = i => {
    slides[cur].classList.remove('active');
    cur = (i + slides.length) % slides.length;
    slides[cur].classList.add('active');
  };
  const next = () => show(cur + 1), prev = () => show(cur - 1);
  const start = () => timer = setInterval(next, DELAY), stop = () => clearInterval(timer);
  // @ts-ignore
  if (prevBtn) prevBtn.onclick = () => { prev(); start(); };
  // @ts-ignore
  if (nextBtn) nextBtn.onclick = () => { next(); start(); };
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', start);
  start();
}

/* ░░ Smooth‑scroll local anchors ░░ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    // @ts-ignore
    document.querySelector(a.getAttribute('href'))
      ?.scrollIntoView({ behavior: 'smooth' });
  });
});

document.addEventListener('DOMContentLoaded', function () {
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
});

// Success Stories carousel with Prev / Next & pause
const carousel2 = document.querySelector('.stories-carousel');
if (carousel2) {
  const slides = carousel2.querySelectorAll('.story-slide');
  const prevBtn = carousel2.querySelector('.story-nav.prev');
  const nextBtn = carousel2.querySelector('.story-nav.next');
  let current = 0;
  let timer;
  const DELAY = 8000;

  function goTo(i) {
    slides[current].classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
  }
  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  function start() { timer = setInterval(next, DELAY); }
  function stop() { clearInterval(timer); }

  // Button events
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); start(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); start(); });

  // Pause while user is hovering or using keyboard focus
  carousel2.addEventListener('mouseenter', stop);
  carousel2.addEventListener('mouseleave', start);
  carousel2.addEventListener('focusin', stop);
  carousel2.addEventListener('focusout', start);

  start();
}

// Common Functions
// @ts-ignore
window.bookCall = function () {
  window.open('https://calendly.com/denomath4/30min', '_blank');
};

// @ts-ignore
window.showDonationOptions = function () {
  window.location.href = 'donate.html';
};

/* ░░ Newsletter AJAX to FormSubmit (no redirect) ░░ */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.blog-newsletter-form');
  if (!form) return;
  const ENDPOINT = 'https://formsubmit.co/ajax/bojoman05@gmail.com';
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // @ts-ignore
    const data = new FormData(form);
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        // @ts-ignore
        form.reset();
        toast('🎉 Thanks for subscribing!');
      } else {
        toast('⚠️ Something went wrong. Please try again.');
      }
    } catch {
      toast('⚠️ Network error. Please try later.');
    }
  });
  /* mini helper */
  function toast(msg) {
    const note = document.createElement('div');
    note.textContent = msg;
    note.style.cssText = `
      margin-top:1rem; padding:.75rem 1rem;
      background:#059669; color:#fff; border-radius:8px;
      text-align:center; font-weight:600; 
      animation:fadein .4s ease, fadeout .4s ease 3.6s forwards`;
    // @ts-ignore
    form.after(note);
    setTimeout(() => note.remove(), 4000);
  }
});

/* ░░ Full‑Post Data ░░ */
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

/* ░░ Modal helpers ░░ */
function openFullPost(key) {
  const post = fullPosts[key];
  const modal = document.getElementById("blog-fullPostModal");

  const content = `
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

  // @ts-ignore
  document.getElementById("blog-fullPostContent").innerHTML = content;
  // @ts-ignore
  modal.style.display = "block";
  // @ts-ignore
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeFullPost() {
  const modal = document.getElementById("blog-fullPostModal");
  // @ts-ignore
  modal.style.display = "none";
  // @ts-ignore
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/* ░░ Counter Animation ░░ */
window.addEventListener("load", () => {
  document.querySelectorAll('[id$="-counter"]').forEach((el) => {
    // @ts-ignore
    const target = +el.textContent;
    el.textContent = "0";
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
});

/* ░░ Smooth Scroll (local anchors) ░░ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

/* ░░ Nav background on scroll ░░ */
window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  if (window.scrollY > 50) {
    // @ts-ignore
    nav.style.background = "rgba(255,255,255,0.98)";
    // @ts-ignore
    nav.style.backdropFilter = "blur(20px)";
  } else {
    // @ts-ignore
    nav.style.background = "rgba(255,255,255,0.95)";
    // @ts-ignore
    nav.style.backdropFilter = "blur(10px)";
  }
});

/* ░░ Intersection‑Observer reveal ░░ */
const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // @ts-ignore
        entry.target.style.animation = "fadeInUp 0.8s ease-out forwards";
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
);

document
  .querySelectorAll(
    ".blog-featured-post, .blog-post, .blog-sidebar-section, .blog-newsletter"
  )
  .forEach((el) => revealObserver.observe(el));

/* ░░ Type‑writer effect on hero quote ░░ */
function typeWriter(el, txt, speed = 30) {
  let i = 0;
  el.textContent = "";
  (function type() {
    if (i < txt.length) {
      el.textContent += txt[i++];
      setTimeout(type, speed);
    }
  })();
}

window.addEventListener("load", () => {
  const quoteEl = document.querySelector(".blog-hero p");
  if (quoteEl) {
    const original = quoteEl.textContent;
    setTimeout(() => typeWriter(quoteEl, original), 500);
  }
});

/* ░░ Floating particles in hero ░░ */
function createParticles() {
  const hero = document.querySelector(".blog-hero");
  if (!hero) return;

  const style = document.createElement("style");
  style.textContent = `
    @keyframes float {
      0%,100% { transform: translateY(0); }
      50%     { transform: translateY(-20px); }
    }
    @keyframes fadein {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeout {
      from { opacity: 1; transform: translateY(0); }
      to   { opacity: 0; transform: translateY(-10px); }
    }
  `;
  document.head.appendChild(style);

  for (let i = 0; i < 50; i++) {
    const p = document.createElement("div");
    Object.assign(p.style, {
      position: "absolute",
      width: "2px",
      height: "2px",
      background: "rgba(255,255,255,0.3)",
      borderRadius: "50%",
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
      animationDelay: `${Math.random() * 2}s`
    });
    hero.appendChild(p);
  }
}

window.addEventListener('load', createParticles);

// Tab switching logic for donation tabs
function showDonationTab(tab) {
  document.querySelectorAll('.donation-tab').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.donation-content').forEach(content => content.classList.remove('active'));
  if (tab === 'device') {
    // @ts-ignore
    document.querySelector('.donation-tab:nth-child(1)').classList.add('active');
    // @ts-ignore
    document.getElementById('device-donation').classList.add('active');
  } else if (tab === 'volunteer') {
    // @ts-ignore
    document.querySelector('.donation-tab:nth-child(2)').classList.add('active');
    // @ts-ignore
    document.getElementById('volunteer-donation').classList.add('active');
  } else if (tab === 'money') {
    // @ts-ignore
    document.querySelector('.donation-tab:nth-child(3)').classList.add('active');
    // @ts-ignore
    document.getElementById('money-donation').classList.add('active');
  }
}
// Copy to clipboard for donation info
function copyText(text) {
  navigator.clipboard.writeText(text);
  alert('Copied: ' + text);
}

/* ░░ Donate‑page forms → FormSubmit (AJAX, no redirect) ░░ */
document.addEventListener('DOMContentLoaded', () => {

  const FS_ENDPOINT = 'https://formsubmit.co/ajax/bojoman05@gmail.com';

  // Handle both forms with the same helper
  ['#device-form', '#volunteer-form'].forEach(sel => {
    const form = document.querySelector(sel);
    if (!form) return;

    const spin = form.querySelector('.loading-spinner');
    const ok = form.querySelector('.success-message');
    const err = form.querySelector('.error-message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      // @ts-ignore
      ok && (ok.style.display = 'none');
      // @ts-ignore
      err && (err.style.display = 'none');
      spin && spin.classList.add('spinning');

      // @ts-ignore
      const data = new FormData(form);
      /* add / override meta fields */
      data.set('_subject',
        form.id === 'device-form'
          ? 'New Device Donation'
          : 'New Volunteer Application');

      try {
        const res = await fetch(FS_ENDPOINT, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          // @ts-ignore
          form.reset();
          // @ts-ignore
          ok && (ok.style.display = 'block');
        } else {
          // @ts-ignore
          err && (err.style.display = 'block');
        }
      } catch (_) {
        // @ts-ignore
        err && (err.style.display = 'block');
      } finally {
        spin && spin.classList.remove('spinning');
      }
    });
  });
});


/* ░░ Contact‑page form → FormSubmit  (AJAX, no redirect) ░░ */
document.addEventListener('DOMContentLoaded', () => {

  const FS_ENDPOINT = 'https://formsubmit.co/ajax/bojoman05@gmail.com';

  const contactForm = document.querySelector('.contact-form form');
  if (!contactForm) return;

  /* optional inline feedback containers */
  const spinner = document.createElement('span');
  spinner.className = 'loading-spinner';
  spinner.style.cssText =
    'display:none;margin-left:.5rem;width:14px;height:14px;border:2px solid #fff;border-right-color:transparent;border-radius:50%;animation:spin .6s linear infinite;';
  // @ts-ignore
  contactForm.querySelector('button[type="submit"]').appendChild(spinner);

  const ok = document.createElement('p');
  ok.className = 'success-message';
  ok.textContent = 'Thanks! Your message has been sent.';
  ok.style.cssText = 'display:none;color:#059669;margin-top:1rem;';
  contactForm.appendChild(ok);

  const err = document.createElement('p');
  err.className = 'error-message';
  err.textContent = 'Oops, something went wrong. Please try again.';
  err.style.cssText = 'display:none;color:#dc2626;margin-top:1rem;';
  contactForm.appendChild(err);

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    ok.style.display = 'none';
    err.style.display = 'none';
    spinner.style.display = 'inline-block';

    // @ts-ignore
    const data = new FormData(contactForm);
    data.set('_subject', 'Contact Form Message');

    try {
      const res = await fetch(FS_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        // @ts-ignore
        contactForm.reset();
        ok.style.display = 'block';
      } else {
        err.style.display = 'block';
      }
    } catch (_) {
      err.style.display = 'block';
    } finally {
      spinner.style.display = 'none';
    }
  });
});

/* tiny spinner animation */
const spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
document.head.appendChild(spinStyle);
