/**
 * ABIR SHIKDER PORTFOLIO - FRAMER DESIGN SYSTEM ENGINE
 * Smooth Role Switcher • Live Time Synchronization • Interactive Case Studies • CV Lightbox • Mobile Drawer
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ========================================================
  // 1. LIVE BANGLADESH TIME SYNCHRONIZER (JASHORE, BD GMT+6)
  // ========================================================
  const liveClockElement = document.getElementById('liveClock');

  function updateLiveTime() {
    if (!liveClockElement) return;
    try {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      liveClockElement.textContent = formatter.format(now);
    } catch (e) {
      const fallback = new Date();
      liveClockElement.textContent = fallback.toLocaleTimeString();
    }
  }

  updateLiveTime();
  setInterval(updateLiveTime, 1000);

  // ========================================================
  // 2. DYNAMIC ROTATING ROLE SWITCHER
  // ========================================================
  const heroRoleSwitcher = document.getElementById('heroRoleSwitcher');
  const roles = [
    'Full-Stack Web Engineering',
    'React & Next.js Architecture',
    'Creative UI/UX Design Systems',
    'High-Performance SaaS Solutions',
    'Headless E-Commerce Platforms'
  ];
  let currentRoleIndex = 0;

  if (heroRoleSwitcher) {
    setInterval(() => {
      heroRoleSwitcher.style.opacity = '0';
      heroRoleSwitcher.style.transform = 'translateY(6px)';
      
      setTimeout(() => {
        currentRoleIndex = (currentRoleIndex + 1) % roles.length;
        heroRoleSwitcher.textContent = roles[currentRoleIndex];
        heroRoleSwitcher.style.opacity = '1';
        heroRoleSwitcher.style.transform = 'translateY(0)';
      }, 250);
    }, 2800);
  }

  // ========================================================
  // 3. MOBILE NAVIGATION DRAWER
  // ========================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        if (mobileDrawer.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!mobileMenuBtn.contains(e.target) && !mobileDrawer.contains(e.target) && mobileDrawer.classList.contains('active')) {
        mobileDrawer.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });
  }

  // ========================================================
  // 4. TOAST NOTIFICATION UTILITY
  // ========================================================
  const toast = document.getElementById('vexooToast');
  const toastText = document.getElementById('toastText');
  let toastTimer = null;

  function showToast(message, duration = 3000) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // Quick Copy Email Utility
  document.querySelectorAll('.copy-email-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'abirshikdar2@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showToast('✓ Email address copied to clipboard!');
        }).catch(() => {
          fallbackCopyText(email);
        });
      } else {
        fallbackCopyText(email);
      }
    });
  });

  function fallbackCopyText(text) {
    const input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand('copy');
      showToast('✓ Email address copied to clipboard!');
    } catch (err) {
      showToast('Email: abirshikdar2@gmail.com');
    }
    document.body.removeChild(input);
  }

  // ========================================================
  // 5. CASE STUDY DATA & MODAL CONTROLLER
  // ========================================================
  const caseStudiesData = {
    analytics: {
      tag: 'Cloud SaaS • Real-Time Telemetry',
      title: 'Apex Analytics Pro — Cloud Observability Suite',
      client: 'Apex Cloud Systems, SF',
      year: '2025',
      role: 'Full-Stack Software Architect & Frontend Lead',
      image: 'assets/images/project-analytics.jpg',
      demoUrl: 'https://abir-shikder-portfolio-abir-s-squad1.vercel.app',
      githubUrl: 'https://github.com/abirshikdar2-bit',
      challenge: 'Handling real-time ingestion of over 1.2 million events per second across multi-region server clusters while rendering low-latency 60 FPS interactive visual telemetry in browser without frame drops.',
      objective: 'Build an ultra-responsive, dark-mode SaaS command console with sub-800ms initial load, zero cumulative layout shift (CLS < 0.05), and custom canvas charts.',
      solution: 'Architected with Next.js 14 App Router, Web Workers for heavy data decimation, WebSocket multiplexing for live telemetry streams, and lightweight HTML5 Canvas rendering for 100k+ point timeseries charts.',
      results: [
        '99.98% telemetry delivery reliability with zero browser tab freezing',
        'Sub-800ms initial LCP on mobile and desktop devices globally',
        'Reduced client memory consumption by 48% via off-screen canvas workers'
      ]
    },
    ecommerce: {
      tag: 'Headless E-Commerce • Next.js',
      title: 'Aether Luxury Audio — Headless Storefront',
      client: 'Aether Acoustics Inc., Berlin',
      year: '2025',
      role: 'Headless Frontend Engineer & UX Designer',
      image: 'assets/images/project-ecommerce.jpg',
      demoUrl: 'https://abir-shikder-portfolio-abir-s-squad1.vercel.app',
      githubUrl: 'https://github.com/abirshikdar2-bit',
      challenge: 'High-end luxury consumers expect boutique cinematic visual fidelity without the sluggish performance typical of asset-heavy e-commerce themes.',
      objective: 'Deliver an editorial shopping experience with instant slide-over mini bag, smooth variant switching, and multi-currency checkout under 1.2s total page load.',
      solution: 'Built with React 18, Next.js incremental static regeneration (ISR), Tailwind CSS utility tokens, custom SVG micro-interactions, and Stripe payment gateway.',
      results: [
        '34% increase in mobile checkout completion rate within 60 days',
        'Google Lighthouse scores: 100 Performance, 100 SEO, 98 Accessibility',
        'Global CDN caching with edge rendering under 40ms worldwide'
      ]
    },
    ai: {
      tag: 'Generative AI • Workflow Canvas',
      title: 'Synthesis AI Studio — Node-Based Prompt Studio',
      client: 'Synthesis Labs, London',
      year: '2025',
      role: 'Lead Frontend Technologist',
      image: 'assets/images/project-ai.jpg',
      demoUrl: 'https://abir-shikder-portfolio-abir-s-squad1.vercel.app',
      githubUrl: 'https://github.com/abirshikdar2-bit',
      challenge: 'Chaining multiple AI models (Claude 3.5, GPT-4o, Flux, Stable Diffusion) required a flexible node canvas with draggable wires and persistent state without clutter.',
      objective: 'Engineer an infinite canvas interface supporting multi-model prompts, live stream token rendering, and one-click JSON exporting.',
      solution: 'Engineered an interactive SVG/HTML5 canvas with spatial zoom/pan coordinates, reactive state management, and real-time streaming parser.',
      results: [
        'Over 12,000 workflows successfully generated during beta testing',
        'Zero-latency node dragging with 60 FPS spatial matrix transforms',
        '100% responsive support with touch zoom and desktop wheel precision'
      ]
    },
    fintech: {
      tag: 'FinTech • Digital Banking',
      title: 'Aether Pay & Neobank Web Portal',
      client: 'Aether Financial Ltd., Singapore',
      year: '2024',
      role: 'Lead UI/UX Engineer',
      image: 'assets/images/project-fintech.jpg',
      demoUrl: 'https://abir-shikder-portfolio-abir-s-squad1.vercel.app',
      githubUrl: 'https://github.com/abirshikdar2-bit',
      challenge: 'FinTech applications require uncompromising security, instant visual feedback for monetary transactions, and intuitive analytics for multi-currency wallets.',
      objective: 'Deliver a sleek titanium-themed neobank interface with virtual card controls, instant biometric simulation, and real-time spend analytics.',
      solution: 'Developed modular card management components, SVG financial charts, and end-to-end encrypted payload simulator adhering to modern security standards.',
      results: [
        'Awarded Site of the Day nominee in modern UI design category',
        'Sub-second transaction filtering across 10,000+ mock records',
        'Pixel-perfect dark mode compliance with full keyboard navigation'
      ]
    }
  };

  const caseStudyModal = document.getElementById('caseStudyModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const csTag = document.getElementById('csTag');
  const csTitle = document.getElementById('csTitle');
  const csClient = document.getElementById('csClient');
  const csYear = document.getElementById('csYear');
  const csRole = document.getElementById('csRole');
  const csImage = document.getElementById('csImage');
  const csChallenge = document.getElementById('csChallenge');
  const csObjective = document.getElementById('csObjective');
  const csSolution = document.getElementById('csSolution');
  const csResults = document.getElementById('csResults');
  const csDemoLink = document.getElementById('csDemoLink');
  const csGithubLink = document.getElementById('csGithubLink');

  function openCaseStudy(studyId) {
    const data = caseStudiesData[studyId];
    if (!data || !caseStudyModal) return;

    if (csTag) csTag.textContent = data.tag;
    if (csTitle) csTitle.textContent = data.title;
    if (csClient) csClient.textContent = data.client;
    if (csYear) csYear.textContent = data.year;
    if (csRole) csRole.textContent = data.role;
    if (csImage) {
      csImage.src = data.image;
      csImage.alt = data.title;
    }
    if (csChallenge) csChallenge.textContent = data.challenge;
    if (csObjective) csObjective.textContent = data.objective;
    if (csSolution) csSolution.textContent = data.solution;
    if (csDemoLink) csDemoLink.href = data.demoUrl;
    if (csGithubLink) csGithubLink.href = data.githubUrl;

    if (csResults) {
      csResults.innerHTML = '';
      data.results.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'flex items-start gap-2 text-slate-300 text-sm';
        li.innerHTML = `<span class="text-blue-400 mt-0.5">▹</span> <span>${item}</span>`;
        csResults.appendChild(li);
      });
    }

    caseStudyModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCaseStudy() {
    if (!caseStudyModal) return;
    caseStudyModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-case-study]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-open-case-study');
      openCaseStudy(id);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeCaseStudy);
  }

  if (caseStudyModal) {
    caseStudyModal.addEventListener('click', (e) => {
      if (e.target === caseStudyModal) {
        closeCaseStudy();
      }
    });
  }

  // ========================================================
  // 6. OFFICIAL CV LIGHTBOX MODAL
  // ========================================================
  const cvModal = document.getElementById('cvModal');
  const cvCloseBtn = document.getElementById('cvCloseBtn');
  const openCvBtns = document.querySelectorAll('.open-cv-btn');

  function openCvModal() {
    if (!cvModal) return;
    cvModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCvModal() {
    if (!cvModal) return;
    cvModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openCvBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCvModal();
    });
  });

  if (cvCloseBtn) {
    cvCloseBtn.addEventListener('click', closeCvModal);
  }

  if (cvModal) {
    cvModal.addEventListener('click', (e) => {
      if (e.target === cvModal) {
        closeCvModal();
      }
    });
  }

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCaseStudy();
      closeCvModal();
    }
  });

  // ========================================================
  // 7. INTERACTIVE PROJECT INQUIRY FORM (WHATSAPP TRIGGER)
  // ========================================================
  const inquiryForm = document.getElementById('inquiryForm');
  const projectTypePills = document.querySelectorAll('.project-type-pill');
  const budgetPills = document.querySelectorAll('.budget-pill');
  let selectedType = 'Full-Stack Web App';
  let selectedBudget = '$1k — $3k';

  projectTypePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      projectTypePills.forEach((p) => p.classList.remove('active', 'bg-blue-600', 'text-white'));
      pill.classList.add('active', 'bg-blue-600', 'text-white');
      selectedType = pill.getAttribute('data-value') || pill.textContent.trim();
    });
  });

  budgetPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      budgetPills.forEach((p) => p.classList.remove('active', 'bg-blue-600', 'text-white'));
      pill.classList.add('active', 'bg-blue-600', 'text-white');
      selectedBudget = pill.getAttribute('data-value') || pill.textContent.trim();
    });
  });

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clientName = document.getElementById('inquiryName')?.value || 'Client';
      const clientEmail = document.getElementById('inquiryEmail')?.value || '';
      const clientDetails = document.getElementById('inquiryDetails')?.value || 'New project inquiry';

      const whatsappMessage = `*New Project Inquiry for Abir Shikder*\n\n` +
        `*Name:* ${clientName}\n` +
        `*Email:* ${clientEmail}\n` +
        `*Project Scope:* ${selectedType}\n` +
        `*Budget Tier:* ${selectedBudget}\n` +
        `*Details:* ${clientDetails}`;

      const encoded = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/8801734018155?text=${encoded}`;
      
      showToast('Opening WhatsApp with your project inquiry...');
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 400);
    });
  }

  // ========================================================
  // 8. TOPBAR SCROLL STATE & ACTIVE LINK TRACKER
  // ========================================================
  const topbar = document.getElementById('topbar');
  const navItems = document.querySelectorAll('.nav-item');
  const trackedSections = document.querySelectorAll('section[id], main[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    if (topbar) {
      if (scrollY > 30) {
        topbar.classList.add('scrolled');
      } else {
        topbar.classList.remove('scrolled');
      }
    }

    trackedSections.forEach((sec) => {
      const top = sec.offsetTop - 140;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navItems.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });

});
