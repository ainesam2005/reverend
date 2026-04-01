// ===== YEAR =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== MOBILE NAV =====
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== SMOOTH ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll(
  '.card, .sermon-item, .gallery-item, .contact-detail, .about-text, .about-image-wrap, .section-title, .section-label'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCount(el, target, suffix = '') {
  let current = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + suffix;
    if (current >= target) clearInterval(timer);
  }, 25);
}

const statsSection = document.getElementById('about');
let statsAnimated = false;

const statsObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    animateCount(document.getElementById('years-count'), 15, '+');
    animateCount(document.getElementById('souls-count'), 500, '+');
    animateCount(document.getElementById('prog-count'), 12, '+');
  }
}, { threshold: 0.5 });

statsObserver.observe(statsSection);

// ===== CONTACT FORM =====
const form = document.getElementById('contact-form');
const success = document.getElementById('form-success');

// ⚠️  Replace YOUR_FORM_ID below with the ID from your Formspree dashboard
//     Steps: go to formspree.io → sign up with ainesam2005@gmail.com → New Form → copy the ID
const FORMSPREE_ID = 'YOUR_FORM_ID';

form.addEventListener('submit', async e => {
  e.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  const data = {
    name:    document.getElementById('name').value.trim(),
    email:   document.getElementById('email').value.trim(),
    subject: document.getElementById('subject').value.trim() || 'Message from ST Paul Katete Website',
    message: document.getElementById('message').value.trim()
  };

  try {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      success.style.display = 'block';
      form.reset();
      setTimeout(() => success.style.display = 'none', 6000);
    } else {
      alert('Sorry, there was a problem sending your message. Please try again.');
    }
  } catch {
    alert('Network error. Please check your connection and try again.');
  }

  submitBtn.disabled = false;
  submitBtn.textContent = 'Send Message';
});

// ===== NAVBAR SHRINK ON SCROLL =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.style.padding = '10px 40px';
    navbar.style.background = 'rgba(10,10,20,0.97)';
  } else {
    navbar.style.padding = '';
    navbar.style.background = '';
  }
});
