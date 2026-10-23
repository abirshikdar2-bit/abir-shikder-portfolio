/**
 * ABIR SHIKDER PORTFOLIO - MASTER INTERACTION LOGIC
 * Live Clock (BD GMT+6) • FAQ Accordion • 1-Click WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================
  // 1. LIVE BANGLADESH LOCAL TIME (GMT+6)
  // ==========================================
  const liveClockDisplay = document.getElementById('liveClockDisplay');

  function updateLiveClock() {
    if (!liveClockDisplay) return;
    try {
      const now = new Date();
      // Format time in Asia/Dhaka (GMT+6)
      const options = {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      liveClockDisplay.textContent = formatter.format(now);
    } catch (err) {
      const now = new Date();
      liveClockDisplay.textContent = now.toLocaleTimeString();
    }
  }

  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  // ==========================================
  // 2. FAQ ACCORDION INTERACTIVITY
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-accordion-item');

  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-header-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close other items
        faqItems.forEach((other) => other.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });

  // ==========================================
  // 4. CV MODAL HANDLERS
  // ==========================================
  const cvModal = document.getElementById('cvModal');
  const viewCvBtn = document.getElementById('viewCvBtnHero');
  const closeCvModalBtn = document.getElementById('closeCvModal');

  function openCvModal() {
    if (cvModal) {
      cvModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCvModal() {
    if (cvModal) {
      cvModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (viewCvBtn) viewCvBtn.addEventListener('click', openCvModal);
  if (closeCvModalBtn) closeCvModalBtn.addEventListener('click', closeCvModal);
  if (cvModal) {
    cvModal.addEventListener('click', (e) => {
      if (e.target === cvModal) closeCvModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCvModal();
  });

  // ==========================================
  // 5. 1-CLICK COPY & EMBER TOAST NOTIFICATIONS
  // ==========================================
  const copyButtons = document.querySelectorAll('.copy-btn');
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast-msg';

    let icon = '<i class="fa-solid fa-circle-check text-emerald-400"></i>';
    if (type === 'info') icon = '<i class="fa-solid fa-circle-info text-ember"></i>';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      if (text) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Copied to clipboard: ${text}`, 'success');
        }).catch(() => {
          showToast(`Direct value: ${text}`, 'info');
        });
      }
    });
  });

  // ==========================================
  // 6. CONTACT FORM SUBMISSION
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        formFeedback.className = 'text-sm p-3 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30';
        formFeedback.textContent = 'Please fill out all required fields.';
        formFeedback.classList.remove('hidden');
        return;
      }

      formFeedback.className = 'text-sm p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      formFeedback.innerHTML = `<i class="fa-solid fa-circle-check mr-2"></i> Thank you, <strong>${name}</strong>! Your inquiry has been dispatched. I will reply via WhatsApp or email within a few hours.`;
      formFeedback.classList.remove('hidden');

      showToast('Inquiry dispatched! Opening WhatsApp/Email fallback...', 'success');

      // WhatsApp direct message fallback
      const waText = encodeURIComponent(`Hi Abir! My name is ${name} (${email}). Project scope: ${subject}. Details: ${message}`);
      const waUrl = `https://wa.me/8801734018155?text=${waText}`;
      setTimeout(() => window.open(waUrl, '_blank'), 800);

      contactForm.reset();
    });
  }

  // ==========================================
  // 7. SCROLL REVEAL (INTERSECTION OBSERVER)
  // ==========================================
  const revealCards = document.querySelectorAll(
    '.project-card-cedar, .bento-card, .process-step-card, .faq-accordion-item, .contact-channel-pill'
  );

  revealCards.forEach((card) => card.classList.add('reveal-fade-up'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  revealCards.forEach((card) => observer.observe(card));
});
