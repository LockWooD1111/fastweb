/* =========================================
   WEBCRAFT — script.js
   ========================================= */

/* ── Sticky header ── */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });


/* ── Mobile nav ── */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
let navOpen = false;

function toggleNav(state) {
  navOpen = state ?? !navOpen;
  burger.classList.toggle('open', navOpen);
  nav.classList.toggle('open', navOpen);
  document.body.style.overflow = navOpen ? 'hidden' : '';
}

burger.addEventListener('click', () => toggleNav());

// Close nav on link click
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => toggleNav(false));
});

// Close nav on outside click
document.addEventListener('click', (e) => {
  if (navOpen && !nav.contains(e.target) && !burger.contains(e.target)) {
    toggleNav(false);
  }
});

// Close nav on resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && navOpen) toggleNav(false);
});


/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ── Smooth scrolling ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── Form validation & submission ── */
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');

function showError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  input.classList.add('error');
  error.textContent = message;
}

function clearError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  input.classList.remove('error');
  error.textContent = '';
}

// Real-time clearing
document.getElementById('name').addEventListener('input', () => clearError('name', 'nameError'));
document.getElementById('email').addEventListener('input', () => clearError('email', 'emailError'));
document.getElementById('contact').addEventListener('input', () => clearError('contact', 'contactError'));

function validateForm() {
  let valid = true;

  const name = document.getElementById('name').value.trim();
  if (!name || name.length < 2) {
    showError('name', 'nameError', 'Please enter your name (at least 2 characters)');
    valid = false;
  } else {
    clearError('name', 'nameError');
  }

  const email = document.getElementById('email').value.trim();
  if (!email || !email.includes('@')) {
    showError('email', 'emailError', 'Enter a valid email');
    valid = false;
  } else {
    clearError('email', 'emailError');
 }

  const contact = document.getElementById('contact').value.trim();
  if (!contact) {
    showError('contact', 'contactError', 'Please enter your WhatsApp number or Telegram username');
    valid = false;
  } else if (contact.length < 5) {
    showError('contact', 'contactError', 'Looks too short — double-check your contact');
    valid = false;
  } else {
    clearError('contact', 'contactError');
  }

  return valid;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  // Simulate submission
  submitBtn.disabled = true;
  btnText.textContent = 'Sending...';
  submitBtn.style.opacity = '0.7';

  await new Promise(resolve => setTimeout(resolve, 1400));

  form.style.display = 'none';
  formSuccess.classList.add('show');
});


/* ── Button ripple effect ── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255,255,255,0.15);
      border-radius: 50%;
      transform: scale(0);
      animation: rippleAnim 0.5s ease-out forwards;
      pointer-events: none;
    `;

    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

// Inject ripple keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleAnim {
    to { transform: scale(2.5); opacity: 0; }
  }
`;
document.head.appendChild(style);


/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--white)' : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));


/* ── Parallax glow on mouse move (hero only) ── */
const heroSection = document.querySelector('.hero');
const glow1 = document.querySelector('.hero__glow--1');
const glow2 = document.querySelector('.hero__glow--2');

if (heroSection && window.matchMedia('(pointer: fine)').matches) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    glow1.style.transform = `translate(${x * 30}px, ${y * 20}px)`;
    glow2.style.transform = `translate(${-x * 20}px, ${-y * 15}px)`;
  });

  heroSection.addEventListener('mouseleave', () => {
    glow1.style.transform = '';
    glow2.style.transform = '';
  });
}


/* ── Number counter animation ── */
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1600;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = entry.target.querySelectorAll('.stat__num');
      statNums.forEach(el => {
        const text = el.textContent;
        if (text.includes('48')) animateCounter(el, 48, 'h');
        else if (text.includes('30')) animateCounter(el, 30, '+');
        else if (text.includes('100')) animateCounter(el, 100, '%');
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero__stats');
if (heroStats) statsObserver.observe(heroStats);
document.getElementById('business').addEventListener('change', function() {
  const otherGroup = document.getElementById('otherGroup');
  otherGroup.style.display = this.value === 'Other' ? 'block' : 'none';
});