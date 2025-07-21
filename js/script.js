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

// Blog Post Modal Functions
const fullPosts = {
    'tradition-to-tech': {
        title: '🎙️ From Tradition to Tech: Why This Moment Sparked My Mission',
        image: 'images/young-leader-speaking.jpeg',
        date: 'December 15, 2024',
        readTime: '5 min read',
        tag: 'Leadership',
        content: `
            <p>When I stood up to speak at my Kikuyu rite of passage, I wasn't just wearing tradition—I was stepping into it. The weight of generations rested on my shoulders, but so did the future.</p>
            
            <p>At 14, I was chosen to lead my ríka (age group). It was an honor that came with responsibility. As I looked around at my peers, I noticed something striking: in this sacred space of ancient wisdom, we were disconnected from the modern world.</p>
            
            <ul>
                <li>💻 No laptops for research</li>
                <li>📶 No Wi-Fi for learning</li>
                <li>📱 No smartphones for connection</li>
            </ul>
            
            <p>This wasn't just about missing technology—it was about missing opportunities. In that moment, I realized: our traditions don't have to compete with technology. They can complement each other.</p>
            
            <p>Now, at 17, I'm leading Tech4Village to bridge this gap. We collect and distribute refurbished devices, but we do more than that. We're creating a future where tradition and technology walk hand in hand.</p>
            
            <p><strong>And I'm just getting started.</strong></p>
        `
    },
    'crawl-forward': {
        title: '🥾 Crawl Forward Anyway: Lessons from the Mud',
        image: 'images/crawling-through-the-mud.jpeg',
        date: 'December 10, 2024',
        readTime: '4 min read',
        tag: 'Resilience',
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
    'tech-hub': {
        title: '🤝 Building Dreams: Our First Tech Hub',
        image: 'images/kaggwa-team.jpeg',
        date: 'December 5, 2024',
        readTime: '6 min read',
        tag: 'Community',
        content: `
            <p>What started as a simple idea has grown into a movement. Today, we celebrated the opening of our first community tech hub in Kikuyu village.</p>
            
            <p>The space isn't just about computers—it's about connection. Students gather here not just to learn coding, but to dream bigger than they ever thought possible.</p>
            
            <h3>What makes our hub special:</h3>
            <ul>
                <li>Solar-powered workstations</li>
                <li>Community-led workshops</li>
                <li>Peer mentorship program</li>
                <li>Cultural integration</li>
            </ul>
            
            <p>We've created more than a computer lab—we've built a bridge between tradition and innovation. A place where elders share stories while youth explore digital horizons.</p>
            
            <p><strong>This is just the beginning of our tech hub network.</strong></p>
        `
    },
    'real-impact': {
        title: '🌟 Beyond Devices: The Real Impact',
        image: 'images/kagwa-speaking.jpeg',
        date: 'November 30, 2024',
        readTime: '4 min read',
        tag: 'Impact',
        content: `
            <p>Numbers tell one story, but the real impact lies in the lives changed. Meet Sarah, a 15-year-old who discovered coding through our program.</p>
            
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

function openFullPost(key) {
    const post = fullPosts[key];
    const modal = document.getElementById('fullPostModal');
    const content = `
        <article class="modal-body">
            <img src="${post.image}" alt="${post.title}" class="modal-image">
            <h1>${post.title}</h1>
            <div class="modal-meta">
                <span class="post-tag">${post.tag}</span>
                <span>${post.date}</span>
                <span>${post.readTime}</span>
            </div>
            ${post.content}
            <hr style="margin:2rem 0; border:none; border-top:1px solid var(--border);">
            <p><em>— Kaggwa Karenge<br>Founder – Tech4Village<br>📧 tech4village@gmail.com<br>💸 Donate: CashApp $karenge | M-Pesa 0722961906</em></p>
        </article>
    `;
    document.getElementById('fullPostContent').innerHTML = content;
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

function closeFullPost() {
    const modal = document.getElementById('fullPostModal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore scrolling
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('fullPostModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeFullPost();
            }
        });
      }
    });