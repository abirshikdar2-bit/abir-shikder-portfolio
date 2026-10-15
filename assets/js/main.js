/**
 * ABIR SHIKDER PORTFOLIO - FRAMER VEXOO ENGINE
 * Smooth Morphing Typography • Mouse Spotlight • Live Time Synchronization • Interactive Case Studies • CV Lightbox
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
  // 2. DYNAMIC MORPHING TYPOGRAPHY (VEXOO HERO BACKDROP)
  // ========================================================
  const heroMorphTitle = document.getElementById('heroMorphTitle');
  const morphCards = document.querySelectorAll('[data-morph-target]');
  const DEFAULT_TITLE = 'Abir Shikder';
  let morphTimeout = null;

  if (heroMorphTitle) {
    morphCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        const targetText = card.getAttribute('data-morph-target');
        if (targetText && heroMorphTitle.textContent !== targetText) {
          clearTimeout(morphTimeout);
          heroMorphTitle.style.opacity = '0.3';
          heroMorphTitle.style.filter = 'blur(10px)';
          heroMorphTitle.style.transform = 'scale(0.97)';
          
          morphTimeout = setTimeout(() => {
            heroMorphTitle.textContent = targetText;
            heroMorphTitle.style.opacity = '1';
            heroMorphTitle.style.filter = 'blur(0px)';
            heroMorphTitle.style.transform = 'scale(1)';
          }, 120);
        }
      });

      card.addEventListener('mouseleave', () => {
        clearTimeout(morphTimeout);
        morphTimeout = setTimeout(() => {
          heroMorphTitle.style.opacity = '0.3';
          heroMorphTitle.style.filter = 'blur(10px)';
          heroMorphTitle.style.transform = 'scale(0.97)';
          setTimeout(() => {
            heroMorphTitle.textContent = DEFAULT_TITLE;
            heroMorphTitle.style.opacity = '1';
            heroMorphTitle.style.filter = 'blur(0px)';
            heroMorphTitle.style.transform = 'scale(1)';
          }, 120);
        }, 150);
      });
    });
  }

  // ========================================================
  // 3. CURSOR SPOTLIGHT TRACKER ON BENTO CARDS
  // ========================================================
  const bentoCards = document.querySelectorAll('.bento-card');
  bentoCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ========================================================
  // 4. TOAST NOTIFICATION UTILITY
  // ========================================================
  const toast = document.getElementById('vexooToast');
  const toastText = document.getElementById('toastText');
  let toastTimer = null;

  function showToast(message) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // One-Click Email Copy
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  copyEmailBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'abirshikdar2@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('✓ Email copied to clipboard: abirshikdar2@gmail.com');
      }).catch(() => {
        showToast('abirshikdar2@gmail.com');
      });
    });
  });

  // ========================================================
  // 5. CASE STUDY DATA & LIGHTBOX MODAL
  // ========================================================
  const projectDatabase = {
    'analytics': {
      title: 'Apex Analytics Pro',
      tag: 'Cloud Analytics SaaS',
      client: 'CloudTelemetry Global',
      year: '2025 - 2026',
      role: 'Lead Full-Stack Web Developer & UI Architect',
      image: 'assets/images/project-analytics.jpg',
      demoUrl: 'https://abir-shikder-portfolio-abir-s-squad1.vercel.app',
      githubUrl: 'https://github.com/abirshikder',
      challenge: 'Enterprise DevOps teams were struggling with fragmented, laggy monitoring tools that suffered from high latency and incomprehensible data visualization.',
      objective: 'Build a unified, ultra-fast real-time telemetry dashboard capable of visualizing 1.2 TB/hr ingestion with sub-second chart rendering and sub-800ms load speed.',
      solution: 'Architected a modular Next.js dashboard utilizing Tailwind CSS and WebGL charts. Implemented WebSocket data streaming with client-side canvas telemetry, reducing memory pressure by 45%.',
      results: [
        '99/100 Lighthouse Performance Score',
        'Sub-80ms WebSocket telemetry refresh latency',
        '+140% user engagement across DevOps teams',
        'Featured in top SaaS UI design showcases'
      ]
    },
    'ecommerce': {
      title: 'Aether Luxury Audio & Wearables',
      tag: 'Headless E-Commerce',
      client: 'Aether Sound Labs',
      year: '2025',
      role: 'Frontend Engineering & Interaction Design',
      image: 'assets/images/project-ecommerce.jpg',
      demoUrl: 'https://abir-shikder-portfolio-abir-s-squad1.vercel.app',
      githubUrl: 'https://github.com/abirshikder',
      challenge: 'Conventional audio store templates felt clunky and failed to capture the luxury sensory feel required for audiophile products.',
      objective: 'Create a cinematic headless shopping experience with instant drawer carting, dark-mode product showcase, and frictionless checkout.',
      solution: 'Engineered an interactive product grid with dynamic variant filtering, localized currency conversion, and hardware-accelerated image zoom.',
      results: [
        'Zero layout shifts (CLS 0.00)',
        '34% increase in cart add-rate during beta',
        'Ultra-fluid 60fps micro-interactions on mobile'
      ]
    },
    'ai': {
      title: 'Synthesis AI Studio',
      tag: 'Generative AI Workflow Suite',
      client: 'NeuralCraft Systems',
      year: '2025',
      role: 'Full-Stack Developer & AI Interface Specialist',
      image: 'assets/images/project-ai.jpg',
      demoUrl: 'https://abir-shikder-portfolio-abir-s-squad1.vercel.app',
      githubUrl: 'https://github.com/abirshikder',
      challenge: 'Generative AI interfaces were overwhelmingly text-based, leaving creative teams with cumbersome copy-paste workflows across various models.',
      objective: 'Develop a visual node-based prompt canvas connecting LLMs, image synthesis pipelines, and control networks in one collaborative board.',
      solution: 'Created an SVG/Canvas node editor with drag-and-drop connections, live preview renders, and state persistence via local storage and Cloudflare workers.',
      results: [
        'Over 10,000 generated creative workflows',
        'Render speed accelerated by 3.2x with cached prompt graph',
        'Recognized for exceptional UI ergonomics'
      ]
    },
    'fintech': {
      title: 'Aether Pay & Digital Banking',
      tag: 'FinTech Neobank Experience',
      client: 'Kairos Financial',
      year: '2024 - 2025',
      role: 'Senior UI/UX Engineer',
      image: 'assets/images/project-fintech.jpg',
      demoUrl: 'https://abir-shikder-portfolio-abir-s-squad1.vercel.app',
      githubUrl: 'https://github.com/abirshikder',
      challenge: 'Users faced unintuitive financial management tools that obscured multi-currency assets and transaction categorizations.',
      objective: 'Deliver an elite digital banking experience with biometric verification, virtual titanium card management, and automated asset allocation.',
      solution: 'Crafted a high-contrast dark OLED dashboard with responsive mobile viewports, dynamic SVG growth curves, and bank-grade security protocols.',
      results: [
        'Tested across 20+ device viewports with zero defects',
        'Seamless biometric and quick-pay integration',
        'Flawless dark-mode accessibility compliance (WCAG AAA)'
      ]
    },
    'assistant': {
      title: 'Abir AI Creative Suite',
      tag: 'AI Design Productivity',
      client: 'Self-Initiated Digital Lab',
      year: '2025',
      role: 'Creator & Lead Architect',
      image: 'assets/images/chatgpt-hero-visual.png',
      demoUrl: 'https://abir-shikder-portfolio-abir-s-squad1.vercel.app',
      githubUrl: 'https://github.com/abirshikder',
      challenge: 'Modern creators need a centralized platform that unifies design prototyping, prompt libraries, and code generation.',
      objective: 'Build an all-in-one developer productivity platform tailored for creative coders and interface designers.',
      solution: 'Integrated OpenAI APIs with custom frontend component generators, markdown renderers, and instant code export capabilities.',
      results: [
        'Built with Next.js, Tailwind CSS, and Framer-grade ergonomics',
        'Over 50+ custom design components shipped'
      ]
    }
  };

  const caseStudyModal = document.getElementById('caseStudyModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const csTitle = document.getElementById('csTitle');
  const csTag = document.getElementById('csTag');
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

  function openCaseStudy(projectId) {
    const data = projectDatabase[projectId];
    if (!data || !caseStudyModal) return;

    if (csTitle) csTitle.textContent = data.title;
    if (csTag) csTag.textContent = data.tag;
    if (csClient) csClient.textContent = data.client;
    if (csYear) csYear.textContent = data.year;
    if (csRole) csRole.textContent = data.role;
    if (csImage) csImage.src = data.image;
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
  let selectedType = 'Full-Stack Web Application';
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
  const trackedSections = document.querySelectorAll('section[id]');

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
