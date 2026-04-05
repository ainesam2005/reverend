// ===== YEAR =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== MOBILE NAV =====
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

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
}, { threshold: 0.3 });

sections.forEach(s => observer.observe(s));

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll(
  '.card, .sermon-item, .gallery-item, .contact-detail, .about-text, .about-image-wrap, ' +
  '.section-title, .section-label, .timeline-item, .qualifications-list li, ' +
  '.principle-card, .book-card, .mini-sermon-item, .section-intro'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 55);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

revealEls.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCount(el, target, suffix = '') {
  let current = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + suffix;
    if (current >= target) clearInterval(timer);
  }, 22);
}

const statsSection = document.getElementById('about');
let statsAnimated = false;

const statsObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    animateCount(document.getElementById('years-count'), 17, '+');
    animateCount(document.getElementById('souls-count'), 8000, '+');
    animateCount(document.getElementById('prog-count'), 4, '');
  }
}, { threshold: 0.5 });

statsObserver.observe(statsSection);

// ===== CONTACT FORM =====
const form = document.getElementById('contact-form');
const success = document.getElementById('form-success');

// Replace YOUR_FORM_ID with your Formspree ID from formspree.io
const FORMSPREE_ID = 'YOUR_FORM_ID';

form.addEventListener('submit', async e => {
  e.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  const data = {
    name:    document.getElementById('name').value.trim(),
    email:   document.getElementById('email').value.trim(),
    subject: document.getElementById('subject').value.trim() || 'Message from St. Paul Katete Website',
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

// ===== ALL SERMONS ACCORDION =====
const toggleBtn = document.getElementById('toggle-sermons');
const allSermons = document.getElementById('all-sermons');

if (toggleBtn && allSermons) {
  toggleBtn.addEventListener('click', () => {
    const isOpen = allSermons.classList.toggle('open');
    toggleBtn.innerHTML = isOpen
      ? 'Hide Sermons &#8657;'
      : 'View All Sermons &amp; Messages &#8659;';
  });
}

// ===== GALLERY LIGHTBOX =====
const galleryItems = document.querySelectorAll('.gallery-item[data-src]');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

let currentIndex = 0;
const galleryData = Array.from(galleryItems).map(item => ({
  src: item.dataset.src,
  caption: item.dataset.caption || ''
}));

function openLightbox(index) {
  currentIndex = index;
  lightboxImg.src = galleryData[index].src;
  lightboxImg.alt = galleryData[index].caption;
  lightboxCaption.textContent = galleryData[index].caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

function showPrev() {
  currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
  lightboxImg.src = galleryData[currentIndex].src;
  lightboxCaption.textContent = galleryData[currentIndex].caption;
}

function showNext() {
  currentIndex = (currentIndex + 1) % galleryData.length;
  lightboxImg.src = galleryData[currentIndex].src;
  lightboxCaption.textContent = galleryData[currentIndex].caption;
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});

// ===== DOCUMENT VIEWER =====
const docViewer        = document.getElementById('doc-viewer');
const docViewerClose   = document.getElementById('doc-viewer-close');
const docViewerTitle   = document.getElementById('doc-viewer-title');
const docViewerAuthor  = document.getElementById('doc-viewer-author');
const docViewerDl      = document.getElementById('doc-viewer-download');
const docViewerFull    = document.getElementById('doc-viewer-fullscreen');
const docViewerFrame   = document.getElementById('doc-viewer-frame');
const docViewerLoading = document.getElementById('doc-viewer-loading');
const docNoPreview     = document.getElementById('doc-no-preview');
const docNoPreviewDl   = document.getElementById('doc-no-preview-download');
const docTypeBadge     = document.getElementById('doc-type-badge');

function getExt(url) {
  return url.split('?')[0].split('.').pop().toLowerCase();
}

function getFileIcon(ext) {
  if (ext === 'pdf')               return '📕';
  if (ext === 'docx' || ext === 'doc')  return '📘';
  if (ext === 'pptx' || ext === 'ppt')  return '📙';
  return '📄';
}

function loadInFrame(src) {
  // Remove any previous one-shot load listener, then set a new one
  const handler = () => {
    docViewerLoading.style.display = 'none';
    docViewerFrame.removeEventListener('load', handler);
  };
  docViewerFrame.addEventListener('load', handler);
  docViewerFrame.src = src;
}

function openDocViewer(filePath, title, author) {
  const ext      = getExt(filePath);
  const absUrl   = new URL(filePath, window.location.href).href;
  const isOnline = absUrl.startsWith('http');
  const isPdf    = ext === 'pdf';
  const isOffice = ['docx', 'doc', 'pptx', 'ppt'].includes(ext);

  // Populate header
  docViewerTitle.textContent  = title || 'Document';
  docViewerAuthor.textContent = author || '';
  docTypeBadge.textContent    = ext.toUpperCase();
  docTypeBadge.dataset.type   = ext;
  docViewerDl.href            = filePath;
  docViewerDl.setAttribute('download', filePath.split('/').pop());
  docViewerFull.href          = filePath;

  // Reset state
  docViewerLoading.style.display = 'flex';
  docViewerFrame.style.display   = 'none';
  docNoPreview.classList.remove('visible');

  // Open modal
  docViewer.classList.add('open');
  document.body.style.overflow = 'hidden';

  if (isPdf) {
    docViewerFrame.style.display = 'block';
    loadInFrame(filePath);
  } else if (isOffice && isOnline) {
    // Microsoft Office Online viewer for publicly-hosted files
    const viewerUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(absUrl);
    docViewerFrame.style.display = 'block';
    docViewerFull.href = viewerUrl;
    loadInFrame(viewerUrl);
  } else {
    // Local .docx / .pptx — preview not supported, show download card
    docViewerLoading.style.display = 'none';
    docNoPreview.classList.add('visible');
    docNoPreviewDl.href = filePath;
    docNoPreviewDl.setAttribute('download', filePath.split('/').pop());
    document.getElementById('doc-no-preview-icon').textContent = getFileIcon(ext);
  }
}

function closeDocViewer() {
  docViewer.classList.remove('open');
  document.body.style.overflow = '';
  // Blank the iframe after the CSS transition finishes
  setTimeout(() => { docViewerFrame.src = 'about:blank'; }, 320);
}

docViewerClose.addEventListener('click', closeDocViewer);
docViewer.addEventListener('click', e => { if (e.target === docViewer) closeDocViewer(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && docViewer.classList.contains('open')) closeDocViewer();
});

// --- Book cards: click to view instead of download ---
document.querySelectorAll('.book-card').forEach(card => {
  card.addEventListener('click', e => {
    e.preventDefault();
    const href   = card.getAttribute('href');
    const title  = card.querySelector('h4')  ? card.querySelector('h4').textContent.trim()  : 'Book';
    const author = card.querySelector('.book-info p') ? card.querySelector('.book-info p').textContent.trim() : '';
    openDocViewer(href, title, author);
  });
});

// --- Sermon items: inject a "View" button next to the Download button ---
document.querySelectorAll('.sermon-item').forEach(item => {
  const dlBtn = item.querySelector('.sermon-download-btn');
  if (!dlBtn) return;
  const href   = dlBtn.getAttribute('href');
  const title  = item.querySelector('h3')          ? item.querySelector('h3').textContent.trim()          : 'Sermon';
  const author = item.querySelector('.sermon-meta') ? item.querySelector('.sermon-meta').textContent.trim() : '';

  const viewBtn = document.createElement('button');
  viewBtn.className   = 'sermon-view-btn';
  viewBtn.textContent = '👁 View';
  viewBtn.addEventListener('click', () => openDocViewer(href, title, author));
  dlBtn.parentNode.insertBefore(viewBtn, dlBtn);
});

// --- Mini sermon items: click to view ---
document.querySelectorAll('.mini-sermon-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const href  = item.getAttribute('href');
    const title = item.querySelector('span:last-child') ? item.querySelector('span:last-child').textContent.trim() : 'Sermon';
    openDocViewer(href, title, '');
  });
});
