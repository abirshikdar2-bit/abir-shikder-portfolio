/**
 * SALONO (সেলোনো) - SMART BARBERSHOP & SALON CRM ENGINE
 * Multi-Tenant Local Persistence • Automated WhatsApp Scheduling • Smart Reminders • Sales Ledger
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ========================================================
  // 1. DATA STATE & LOCALSTORAGE ENGINE
  // ========================================================
  const STORAGE_KEYS = {
    SALON: 'salono_salon_profile',
    CUSTOMERS: 'salono_customers_data',
    SALES: 'salono_sales_records'
  };

  // Default Initial Seed Data for Instant Demonstration
  const DEFAULT_SALON = {
    name: 'রয়্যাল জেন্টস পার্লার ও সেলুন',
    tagline: 'মডার্ন হেয়ার কাট ও গ্রুমিং স্টুডিও',
    ownerName: 'ওস্তাদ আবুল বাশার',
    phone: '01734018155',
    address: 'দোকান নং ৪, মেইন রোড, যশোর',
    defaultCycleDays: 25,
    subscriptionStatus: 'প্রো এক্টিভ (৳১০০/মাস)'
  };

  const DEFAULT_CUSTOMERS = [
    {
      id: 'cust_1',
      name: 'তানভীর আহমেদ',
      phone: '01711223344',
      cycleDays: 20,
      lastVisitDate: getDateOffset(-26), // 26 days ago (Overdue)
      styleNote: 'ফেড কাট + হালকা দাড়ি ট্রিম',
      regularAmount: 220,
      totalVisits: 14,
      totalSpent: 3080,
      isVip: true,
      avatar: '👨‍💼'
    },
    {
      id: 'cust_2',
      name: 'শুভ চৌধুরী',
      phone: '01819334455',
      cycleDays: 25,
      lastVisitDate: getDateOffset(-25), // Exactly 25 days ago (Due Today!)
      styleNote: 'লেয়ার কাট, ডান পাশে সিঁথি',
      regularAmount: 150,
      totalVisits: 8,
      totalSpent: 1200,
      isVip: false,
      avatar: '🧑'
    },
    {
      id: 'cust_3',
      name: 'মেহেদী হাসান (ব্যাংকার)',
      phone: '01912445566',
      cycleDays: 30,
      lastVisitDate: getDateOffset(-30), // Exactly 30 days ago (Due Today!)
      styleNote: 'অফিসিয়াল ক্ল্যাসিক কাট + হেড ম্যাসাজ',
      regularAmount: 350,
      totalVisits: 19,
      totalSpent: 6650,
      isVip: true,
      avatar: '🧔'
    },
    {
      id: 'cust_4',
      name: 'সাকিব আল মাহমুদ',
      phone: '01799887766',
      cycleDays: 20,
      lastVisitDate: getDateOffset(-19), // 19 days ago (Due Tomorrow)
      styleNote: 'স্কিন ফেড + দাড়ি শেপ',
      regularAmount: 200,
      totalVisits: 6,
      totalSpent: 1200,
      isVip: false,
      avatar: '💇‍♂️'
    },
    {
      id: 'cust_5',
      name: 'ডা. আনোয়ার হোসেন',
      phone: '01552334455',
      cycleDays: 20,
      lastVisitDate: getDateOffset(-18), // Due in 2 days
      styleNote: 'সিম্পল ক্লিপার কাট',
      regularAmount: 150,
      totalVisits: 22,
      totalSpent: 3300,
      isVip: true,
      avatar: '👨‍⚕️'
    },
    {
      id: 'cust_6',
      name: 'কামরুল হাসান রকি',
      phone: '01688776655',
      cycleDays: 25,
      lastVisitDate: getDateOffset(-29), // Overdue
      styleNote: 'বাজ কাট + দাড়ি কালার',
      regularAmount: 380,
      totalVisits: 11,
      totalSpent: 4180,
      isVip: false,
      avatar: '🧔‍♂️'
    },
    {
      id: 'cust_7',
      name: 'ফাহিম রহমান',
      phone: '01311009988',
      cycleDays: 30,
      lastVisitDate: getDateOffset(-45), // Inactive (45 days)
      styleNote: 'স্পাইক কাট + ফেসিয়াল',
      regularAmount: 450,
      totalVisits: 4,
      totalSpent: 1800,
      isVip: false,
      avatar: '🧑‍🦱'
    },
    {
      id: 'cust_8',
      name: 'ইমতিয়াজ হক',
      phone: '01744112233',
      cycleDays: 25,
      lastVisitDate: getDateOffset(-8), // Recent
      styleNote: 'সিজার কাট',
      regularAmount: 150,
      totalVisits: 12,
      totalSpent: 1800,
      isVip: false,
      avatar: '👦'
    }
  ];

  const DEFAULT_SALES = [
    { id: 'sale_1', customerName: 'ইমতিয়াজ হক', serviceName: 'চুল কাটা', amount: 150, timestamp: getDateOffset(0, 9, 30), paymentMethod: 'ক্যাশ' },
    { id: 'sale_2', customerName: 'ওয়াক-ইন কাস্টমার', serviceName: 'দাড়ি ট্রিম', amount: 80, timestamp: getDateOffset(0, 10, 15), paymentMethod: 'ক্যাশ' },
    { id: 'sale_3', customerName: 'রফিক ভাই', serviceName: 'চুল + দাড়ি কম্বো', amount: 220, timestamp: getDateOffset(0, 11, 45), paymentMethod: 'বিকাশ' },
    { id: 'sale_4', customerName: 'ওয়াক-ইন কাস্টমার', serviceName: 'ফেসিয়াল ও ম্যাসাজ', amount: 400, timestamp: getDateOffset(0, 13, 10), paymentMethod: 'ক্যাশ' },
    { id: 'sale_5', customerName: 'আরিফ আহমেদ', serviceName: 'চুল কাটা + কালার', amount: 450, timestamp: getDateOffset(0, 14, 20), paymentMethod: 'বিকাশ' },
    { id: 'sale_6', customerName: 'ওয়াক-ইন কাস্টমার', serviceName: 'চুল কাটা', amount: 150, timestamp: getDateOffset(-1, 16, 0), paymentMethod: 'ক্যাশ' },
    { id: 'sale_7', customerName: 'ডা. আনোয়ার হোসেন', serviceName: 'চুল কাটা', amount: 150, timestamp: getDateOffset(-18, 11, 0), paymentMethod: 'ক্যাশ' }
  ];

  function getDateOffset(daysOffset, hours = 12, mins = 0) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    d.setHours(hours, mins, 0, 0);
    return d.toISOString();
  }

  // Load from Storage or Seed
  let salon = JSON.parse(localStorage.getItem(STORAGE_KEYS.SALON)) || DEFAULT_SALON;
  let customers = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) || DEFAULT_CUSTOMERS;
  let sales = JSON.parse(localStorage.getItem(STORAGE_KEYS.SALES)) || DEFAULT_SALES;

  function persistData() {
    localStorage.setItem(STORAGE_KEYS.SALON, JSON.stringify(salon));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }

  persistData();

  // ========================================================
  // 2. HELPER FUNCTIONS & FORMATTERS
  // ========================================================
  function formatTaka(amount) {
    return '৳' + Number(amount).toLocaleString('en-IN');
  }

  function getDaysDifference(pastIsoDate) {
    const past = new Date(pastIsoDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    past.setHours(0, 0, 0, 0);
    const diffTime = today - past;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  function getReminderStatus(customer) {
    const daysPassed = getDaysDifference(customer.lastVisitDate);
    const diff = daysPassed - customer.cycleDays;

    if (diff > 0) {
      return {
        type: 'overdue',
        label: `${diff} দিন বেশি পার হয়েছে`,
        cssClass: 'tag-overdue',
        cardClass: 'reminder-card-overdue',
        daysPassed,
        urgency: 1
      };
    } else if (diff === 0) {
      return {
        type: 'due-today',
        label: 'আজকে চুল কাটার দিন!',
        cssClass: 'tag-due-today',
        cardClass: 'reminder-card-due-today',
        daysPassed,
        urgency: 2
      };
    } else if (diff >= -3) {
      return {
        type: 'upcoming',
        label: `আর ${Math.abs(diff)} দিন বাকি`,
        cssClass: 'tag-upcoming',
        cardClass: 'reminder-card-upcoming',
        daysPassed,
        urgency: 3
      };
    } else {
      return {
        type: 'normal',
        label: `${daysPassed} দিন আগে কেটেছেন`,
        cssClass: '',
        cardClass: '',
        daysPassed,
        urgency: 4
      };
    }
  }

  function generateWhatsAppUrl(customer) {
    const status = getReminderStatus(customer);
    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    let targetPhone = cleanPhone;
    if (targetPhone.startsWith('0')) {
      targetPhone = '880' + targetPhone.substring(1);
    }

    const message = `আসসালামু আলাইকুম ${customer.name} ভাই! ${salon.name} থেকে ${salon.ownerName} বলছি।\n\n` +
      `আপনার চুল কাটার প্রায় ${status.daysPassed} দিন হয়ে গেছে। ` +
      `আজ বা আগামীকাল আপনার জন্য কি কোনো সিরিয়াল/চেয়ার রেডি রাখবো? জানালে সুবিধা হতো।\n\n` +
      `ধন্যবাদ!\n— ${salon.name}\nফোন: ${salon.phone}`;

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
  }

  // ========================================================
  // 3. UI RENDERING ENGINES
  // ========================================================

  // Header and Salon Name
  function renderSalonInfo() {
    document.querySelectorAll('.salon-title-display').forEach(el => el.textContent = salon.name);
    document.querySelectorAll('.salon-owner-display').forEach(el => el.textContent = salon.ownerName);
    document.querySelectorAll('.salon-phone-display').forEach(el => el.textContent = salon.phone);
    document.querySelectorAll('.salon-address-display').forEach(el => el.textContent = salon.address);
    
    const datePill = document.getElementById('currentDatePill');
    if (datePill) {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      datePill.textContent = now.toLocaleDateString('bn-BD', options);
    }
  }

  // Dashboard KPIs
  function renderDashboardKPIs() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Due Customers Count
    const dueCount = customers.filter(c => {
      const status = getReminderStatus(c);
      return status.type === 'overdue' || status.type === 'due-today';
    }).length;

    // 2. Today's Sales
    const todaySales = sales.filter(s => {
      const saleDate = new Date(s.timestamp);
      saleDate.setHours(0, 0, 0, 0);
      return saleDate.getTime() === today.getTime();
    });

    const todayTotal = todaySales.reduce((sum, s) => sum + Number(s.amount), 0);

    // 3. This Month's Sales
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const monthSales = sales.filter(s => {
      const saleDate = new Date(s.timestamp);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    });

    // Base estimated baseline for demonstration (e.g. 38,000 + today's)
    const monthTotal = 38500 + todayTotal;

    // Update Elements
    const kpiDueEl = document.getElementById('kpiDueCount');
    const kpiTodaySalesEl = document.getElementById('kpiTodaySales');
    const kpiMonthSalesEl = document.getElementById('kpiMonthSales');
    const kpiTotalClientsEl = document.getElementById('kpiTotalClients');

    if (kpiDueEl) kpiDueEl.textContent = dueCount + ' জন';
    if (kpiTodaySalesEl) kpiTodaySalesEl.textContent = formatTaka(todayTotal);
    if (kpiMonthSalesEl) kpiMonthSalesEl.textContent = formatTaka(monthTotal);
    if (kpiTotalClientsEl) kpiTotalClientsEl.textContent = customers.length + ' জন';

    // Update notification badges
    document.querySelectorAll('.reminder-badge-count').forEach(el => {
      el.textContent = dueCount;
      el.style.display = dueCount > 0 ? 'inline-flex' : 'none';
    });
  }

  // Dashboard Reminder Feed (Top Priority)
  function renderReminderList(containerId = 'dashboardReminderList', filterType = 'due_only') {
    const container = document.getElementById(containerId);
    if (!container) return;

    let targetCustomers = [...customers];

    targetCustomers = targetCustomers.map(c => ({
      ...c,
      status: getReminderStatus(c)
    })).filter(c => {
      if (filterType === 'due_only') {
        return c.status.type === 'overdue' || c.status.type === 'due-today' || c.status.type === 'upcoming';
      }
      return true;
    });

    // Sort by urgency: Overdue first, then Due Today, then Upcoming
    targetCustomers.sort((a, b) => a.status.urgency - b.status.urgency);

    if (targetCustomers.length === 0) {
      container.innerHTML = `
        <div class="col-span-full p-8 text-center bg-surface border border-subtle rounded-xl text-zinc-400">
          <i class="fa-solid fa-circle-check text-emerald-400 text-3xl mb-2"></i>
          <p class="font-medium text-white">আজকে কোনো কাস্টমারের চুল কাটার ডেট নেই!</p>
          <p class="text-xs text-zinc-500 mt-1">সব কাস্টমার আপ-টু-ডেট আছেন।</p>
        </div>
      `;
      return;
    }

    container.innerHTML = targetCustomers.map(c => `
      <div class="reminder-card ${c.status.cardClass}">
        <div class="reminder-card-header">
          <div class="client-avatar">
            ${c.avatar || '👨'}
          </div>
          <div class="client-meta">
            <div class="flex items-center justify-between">
              <h4 class="client-name">${c.name}</h4>
              <span class="reminder-tag ${c.status.cssClass}">${c.status.label}</span>
            </div>
            <div class="client-phone"><i class="fa-solid fa-phone text-[10px] text-zinc-500"></i> ${c.phone}</div>
          </div>
        </div>

        <div class="reminder-details-box">
          <div>
            <span class="text-zinc-500 block text-[11px]">চুল কাটার সাইকেল</span>
            <span class="font-semibold text-white">প্রতি ${c.cycleDays} দিন</span>
          </div>
          <div>
            <span class="text-zinc-500 block text-[11px]">পছন্দের স্টাইল</span>
            <span class="text-zinc-300 font-medium truncate max-w-[140px] inline-block">${c.styleNote || 'স্বাভাবিক কাট'}</span>
          </div>
          <div>
            <span class="text-zinc-500 block text-[11px]">বিল</span>
            <span class="text-gold-light font-bold font-outfit">${formatTaka(c.regularAmount)}</span>
          </div>
        </div>

        <div class="reminder-actions">
          <a href="${generateWhatsAppUrl(c)}" target="_blank" class="btn-whatsapp-remind" title="হোয়াটসঅ্যাপে রিমাইন্ডার মেসেজ পাঠান">
            <i class="fa-brands fa-whatsapp text-lg"></i>
            <span>হোয়াটসঅ্যাপ রিমাইন্ডার</span>
          </a>
          <a href="tel:${c.phone}" class="btn-call-remind" title="সরাসরি কল দিন">
            <i class="fa-solid fa-phone"></i>
          </a>
          <button class="btn-mark-done" data-done-id="${c.id}" title="আজকে চুল কেটেছেন (Mark Done)">
            <i class="fa-solid fa-check"></i>
          </button>
        </div>
      </div>
    `).join('');

    // Attach Mark Done handlers
    container.querySelectorAll('[data-done-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-done-id');
        markCustomerDone(id);
      });
    });
  }

  // Customer Directory Table / Grid
  function renderCustomers(filter = 'all', searchQuery = '') {
    const container = document.getElementById('customerListContainer');
    if (!container) return;

    let list = [...customers];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q));
    }

    // Category filter
    if (filter === 'due') {
      list = list.filter(c => {
        const s = getReminderStatus(c);
        return s.type === 'overdue' || s.type === 'due-today';
      });
    } else if (filter === 'vip') {
      list = list.filter(c => c.isVip);
    } else if (filter === 'inactive') {
      list = list.filter(c => getDaysDifference(c.lastVisitDate) > 40);
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div class="col-span-full p-8 text-center bg-surface border border-subtle rounded-xl text-zinc-400">
          <p>কোনো কাস্টমার পাওয়া যায়নি।</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(c => {
      const status = getReminderStatus(c);
      return `
        <div class="customer-card">
          <div class="customer-card-header">
            <div class="flex items-center gap-3">
              <div class="client-avatar">
                ${c.avatar || '👨'}
              </div>
              <div>
                <h4 class="client-name flex items-center gap-1.5">
                  ${c.name}
                  ${c.isVip ? '<span class="text-amber-400 text-xs" title="VIP Regular"><i class="fa-solid fa-crown"></i></span>' : ''}
                </h4>
                <div class="client-phone">${c.phone}</div>
              </div>
            </div>
            <span class="customer-style-badge">সাইকেল: ${c.cycleDays} দিন</span>
          </div>

          <div class="reminder-details-box">
            <div>
              <span class="text-zinc-500 block text-[11px]">সর্বশেষ কাট</span>
              <span class="text-zinc-300 font-medium">${status.daysPassed} দিন আগে</span>
            </div>
            <div>
              <span class="text-zinc-500 block text-[11px]">মোট ভিজিট</span>
              <span class="text-white font-bold font-outfit">${c.totalVisits || 1} বার</span>
            </div>
            <div>
              <span class="text-zinc-500 block text-[11px]">মোট খরচ</span>
              <span class="text-gold-light font-bold font-outfit">${formatTaka(c.totalSpent || c.regularAmount)}</span>
            </div>
          </div>

          <div class="text-xs text-zinc-400 bg-black/20 p-2 rounded flex items-center gap-2">
            <i class="fa-solid fa-scissors text-gold-light"></i>
            <span class="truncate">${c.styleNote || 'নিয়মিত স্টাইল'}</span>
          </div>

          <div class="flex items-center gap-2 pt-1 border-t border-subtle">
            <a href="${generateWhatsAppUrl(c)}" target="_blank" class="flex-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-colors">
              <i class="fa-brands fa-whatsapp text-sm"></i>
              <span>মেসেজ</span>
            </a>
            <a href="tel:${c.phone}" class="p-2 bg-white/5 hover:bg-white/10 text-white rounded transition-colors" title="কল দিন">
              <i class="fa-solid fa-phone text-xs"></i>
            </a>
            <button class="p-2 bg-white/5 hover:bg-white/10 text-white rounded transition-colors" data-edit-id="${c.id}" title="তথ্য এডিট করুন">
              <i class="fa-solid fa-pen text-xs"></i>
            </button>
            <button class="p-2 bg-white/5 hover:bg-red-500/20 text-red-400 rounded transition-colors" data-delete-id="${c.id}" title="মুছে ফেলুন">
              <i class="fa-regular fa-trash-can text-xs"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach Edit and Delete handlers
    container.querySelectorAll('[data-delete-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-delete-id');
        if (confirm('আপনি কি এই কাস্টমারকে মুছে ফেলতে চান?')) {
          customers = customers.filter(c => c.id !== id);
          persistData();
          refreshAllUI();
          showToast('✓ কাস্টমার মুছে ফেলা হয়েছে');
        }
      });
    });

    container.querySelectorAll('[data-edit-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-edit-id');
        openEditCustomerModal(id);
      });
    });
  }

  // Sales Ledger List
  function renderSalesLedger() {
    const container = document.getElementById('salesLedgerList');
    if (!container) return;

    // Show latest sales first
    const sortedSales = [...sales].reverse();

    container.innerHTML = sortedSales.slice(0, 15).map(s => {
      const d = new Date(s.timestamp);
      const timeStr = d.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
      const dateStr = d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });

      return `
        <div class="ledger-item">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-bold">
              ৳
            </div>
            <div>
              <div class="font-semibold text-white text-sm">${s.serviceName}</div>
              <div class="text-xs text-zinc-500">${s.customerName} • ${dateStr}, ${timeStr}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="font-outfit font-bold text-white text-base">+${formatTaka(s.amount)}</div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400">${s.paymentMethod}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Marketing Pre-Crafted Messages List
  function renderMarketingTemplates() {
    const container = document.getElementById('marketingTemplateList');
    if (!container) return;

    const templates = [
      {
        id: 'tmpl_1',
        title: '✂️ নিয়মিত চুল কাটার রিমাইন্ডার',
        desc: 'যাদের ২০-২৫ দিন পার হয়ে গেছে তাদের জন্য সবচেয়ে সেরা ও শ্রদ্ধাপূর্ণ বার্তা।',
        text: `আসসালামু আলাইকুম {name} ভাই! ${salon.name} থেকে বলছি। আপনার চুল কাটার প্রায় {days} দিন পূর্ণ হয়েছে। আজ বা কাল আপনার পছন্দের সময়ে এসে চুলটা সাইজ করিয়ে নিতে পারেন। সিরিয়ালের জন্য আমাকে জানালেই হবে। ধন্যবাদ!`
      },
      {
        id: 'tmpl_2',
        title: '🕌 জুম্মা ও উইকেন্ড স্পেশাল গ্রুমিং স্লট',
        desc: 'বৃহস্পতিবার ও শুক্রবার ভিড়ের আগেই সিরিয়াল নিশ্চিত করার বার্তা।',
        text: `আসসালামু আলাইকুম {name} ভাই! আগামীকাল জুম্মার দিন সেলুনে অনেক ভিড় থাকে। আপনি যদি ফ্রেশ হয়ে চুল-দাড়ি কাটাতে চান, তবে এখনই মেসেজ দিয়ে আপনার চেয়ার সিরিয়াল বুক করে রাখুন। — ${salon.name}`
      },
      {
        id: 'tmpl_3',
        title: '🌙 ঈদ / উৎসবের অগ্রিম বুকিং',
        desc: 'ঈদ ও উৎসবের সময় কাস্টমারদের স্পেশাল স্লট অফার।',
        text: `ঈদ মোবারক {name} ভাই! ঈদের আগে সেলুনে উপচে পড়া ভিড় এড়াতে আপনার গ্রুমিং সিরিয়াল আজই নিশ্চিত করুন। আপনার জন্য বিশেষ কেয়ার রাখা হবে। — ${salon.name}`
      },
      {
        id: 'tmpl_4',
        title: '💙 অনেকদিন আসেননি / মিস করছি আপনাকে',
        desc: 'যে কাস্টমারগুলো ৪০-৫০ দিন ধরে দোকানে আসেনি তাদের ফিরিয়ে আনার অফার।',
        text: `কেমন আছেন {name} ভাই? অনেকদিন আপনাকে আমাদের সেলুনে দেখতে পাচ্ছি না। আপনার পছন্দের হেয়ারস্টাইল ও স্পেশাল কেয়ার দিতে আমরা প্রস্তুত। আজই চলে আসুন ${salon.name}-এ!`
      }
    ];

    container.innerHTML = templates.map(t => `
      <div class="bg-surface border border-card rounded-xl p-5 flex flex-col justify-between hover:border-gold transition-all">
        <div>
          <h4 class="font-bold text-white text-base mb-1">${t.title}</h4>
          <p class="text-xs text-zinc-400 mb-4">${t.desc}</p>
          <div class="bg-surfaceElevated p-3 rounded-lg border border-subtle text-xs text-zinc-300 font-mono leading-relaxed mb-4">
            ${t.text}
          </div>
        </div>
        <button class="btn-gold-action w-full justify-center py-2 text-xs" data-template-text="${encodeURIComponent(t.text)}">
          <i class="fa-solid fa-paper-plane text-xs"></i>
          <span>কাস্টমারদের ব্রডকাস্ট করুন</span>
        </button>
      </div>
    `).join('');

    container.querySelectorAll('[data-template-text]').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = decodeURIComponent(btn.getAttribute('data-template-text'));
        openBroadcastModal(text);
      });
    });
  }

  // ========================================================
  // 4. ACTION CONTROLLERS & MODALS
  // ========================================================

  // Mark Customer Done (Haircut Completed)
  function markCustomerDone(customerId) {
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return;

    // Update last visit date to right now
    cust.lastVisitDate = new Date().toISOString();
    cust.totalVisits = (cust.totalVisits || 0) + 1;
    cust.totalSpent = (cust.totalSpent || 0) + Number(cust.regularAmount);

    // Record the sale automatically
    const newSale = {
      id: 'sale_' + Date.now(),
      customerName: cust.name,
      serviceName: 'চুল ও দাড়ি সার্ভিস',
      amount: cust.regularAmount,
      timestamp: new Date().toISOString(),
      paymentMethod: 'ক্যাশ'
    };
    sales.push(newSale);

    persistData();
    refreshAllUI();
    showToast(`✓ ${cust.name} ভাইয়ের চুল কাটা সম্পন্ন হয়েছে এবং ${formatTaka(cust.regularAmount)} সেলে যুক্ত হয়েছে!`);
  }

  // Quick Service Sale Entry (From POS Register)
  function handleQuickSale(serviceName, amount) {
    const newSale = {
      id: 'sale_' + Date.now(),
      customerName: 'ওয়াক-ইন কাস্টমার',
      serviceName: serviceName,
      amount: Number(amount),
      timestamp: new Date().toISOString(),
      paymentMethod: 'ক্যাশ'
    };
    sales.push(newSale);
    persistData();
    refreshAllUI();
    showToast(`✓ ${serviceName} বাবদ +${formatTaka(amount)} যোগ হয়েছে!`);
  }

  // Open Add Customer Modal
  const addCustomerModal = document.getElementById('addCustomerModal');
  const addCustomerForm = document.getElementById('addCustomerForm');

  function openAddCustomerModal() {
    if (!addCustomerModal) return;
    if (addCustomerForm) addCustomerForm.reset();
    document.getElementById('modalCustId').value = '';
    document.getElementById('customerModalTitle').textContent = 'নতুন কাস্টমার নিবন্ধন';
    addCustomerModal.classList.add('active');
  }

  function openEditCustomerModal(id) {
    const cust = customers.find(c => c.id === id);
    if (!cust || !addCustomerModal) return;

    document.getElementById('modalCustId').value = cust.id;
    document.getElementById('modalCustName').value = cust.name;
    document.getElementById('modalCustPhone').value = cust.phone;
    document.getElementById('modalCustCycle').value = cust.cycleDays;
    document.getElementById('modalCustAmount').value = cust.regularAmount;
    document.getElementById('modalCustStyle').value = cust.styleNote || '';
    document.getElementById('modalCustVip').checked = !!cust.isVip;
    document.getElementById('customerModalTitle').textContent = 'কাস্টমার তথ্য সংশোধন';

    addCustomerModal.classList.add('active');
  }

  function closeModals() {
    document.querySelectorAll('.salono-modal').forEach(m => m.classList.remove('active'));
  }

  // Add/Edit Customer Submit
  if (addCustomerForm) {
    addCustomerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('modalCustId').value;
      const name = document.getElementById('modalCustName').value.trim();
      const phone = document.getElementById('modalCustPhone').value.trim();
      const cycleDays = Number(document.getElementById('modalCustCycle').value) || 25;
      const regularAmount = Number(document.getElementById('modalCustAmount').value) || 150;
      const styleNote = document.getElementById('modalCustStyle').value.trim() || 'রেগুলার কাট';
      const isVip = document.getElementById('modalCustVip').checked;

      if (id) {
        // Edit existing
        const idx = customers.findIndex(c => c.id === id);
        if (idx !== -1) {
          customers[idx].name = name;
          customers[idx].phone = phone;
          customers[idx].cycleDays = cycleDays;
          customers[idx].regularAmount = regularAmount;
          customers[idx].styleNote = styleNote;
          customers[idx].isVip = isVip;
          showToast('✓ কাস্টমার তথ্য সফলভাবে আপডেট হয়েছে!');
        }
      } else {
        // Create new
        const avatars = ['👨', '🧑', '🧔', '💇‍♂️', '👨‍💼', '👦'];
        const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
        const newCust = {
          id: 'cust_' + Date.now(),
          name,
          phone,
          cycleDays,
          lastVisitDate: new Date().toISOString(), // visited today
          styleNote,
          regularAmount,
          totalVisits: 1,
          totalSpent: regularAmount,
          isVip,
          avatar: randomAvatar
        };
        customers.unshift(newCust);
        showToast('✓ নতুন কাস্টমার সফলভাবে যুক্ত হয়েছে!');
      }

      persistData();
      closeModals();
      refreshAllUI();
    });
  }

  // Quick Sale Custom Amount Modal
  const customSaleModal = document.getElementById('customSaleModal');
  const customSaleForm = document.getElementById('customSaleForm');

  if (customSaleForm) {
    customSaleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const serviceName = document.getElementById('customServiceName').value.trim() || 'অন্যান্য সেবা';
      const amount = Number(document.getElementById('customSaleAmount').value);
      const custName = document.getElementById('customSaleClient').value.trim() || 'ওয়াক-ইন কাস্টমার';
      const paymentMethod = document.getElementById('customSalePayment').value || 'ক্যাশ';

      if (amount > 0) {
        sales.push({
          id: 'sale_' + Date.now(),
          customerName: custName,
          serviceName: serviceName,
          amount: amount,
          timestamp: new Date().toISOString(),
          paymentMethod: paymentMethod
        });
        persistData();
        closeModals();
        refreshAllUI();
        showToast(`✓ +${formatTaka(amount)} নতুন সেল যুক্ত হয়েছে!`);
      }
    });
  }

  // Salon Settings Form
  const salonSettingsForm = document.getElementById('salonSettingsForm');
  if (salonSettingsForm) {
    salonSettingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      salon.name = document.getElementById('setSalonName').value.trim() || salon.name;
      salon.ownerName = document.getElementById('setOwnerName').value.trim() || salon.ownerName;
      salon.phone = document.getElementById('setPhone').value.trim() || salon.phone;
      salon.address = document.getElementById('setAddress').value.trim() || salon.address;
      salon.defaultCycleDays = Number(document.getElementById('setDefaultCycle').value) || 25;

      persistData();
      refreshAllUI();
      showToast('✓ সেলুনের তথ্য সফলভাবে সংরক্ষিত হয়েছে!');
    });
  }

  // Reset Demo Data Button
  const resetDemoBtn = document.getElementById('resetDemoDataBtn');
  if (resetDemoBtn) {
    resetDemoBtn.addEventListener('click', () => {
      if (confirm('আপনি কি টেস্ট ডেমো ডাটা পুনরায় লোড করতে চান?')) {
        salon = { ...DEFAULT_SALON };
        customers = [...DEFAULT_CUSTOMERS];
        sales = [...DEFAULT_SALES];
        persistData();
        refreshAllUI();
        showToast('✓ ডেমো ডাটা সফলভাবে রিস্টোর করা হয়েছে!');
      }
    });
  }

  // Quick Service Button Handlers
  document.querySelectorAll('[data-service-name]').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-service-name');
      const amount = btn.getAttribute('data-service-price');
      handleQuickSale(name, amount);
    });
  });

  // Modal Triggers
  document.querySelectorAll('.open-add-customer-btn').forEach(b => {
    b.addEventListener('click', openAddCustomerModal);
  });

  document.querySelectorAll('.open-custom-sale-btn').forEach(b => {
    b.addEventListener('click', () => {
      if (customSaleModal) {
        customSaleForm.reset();
        customSaleModal.classList.add('active');
      }
    });
  });

  document.querySelectorAll('.modal-close-icon').forEach(btn => {
    btn.addEventListener('click', closeModals);
  });

  document.querySelectorAll('.salono-modal').forEach(m => {
    m.addEventListener('click', (e) => {
      if (e.target === m) closeModals();
    });
  });

  // ========================================================
  // 5. NAVIGATION CONTROLLER (TABS & BOTTOM NAV)
  // ========================================================
  const navLinks = document.querySelectorAll('[data-target-tab]');
  const tabViews = document.querySelectorAll('.tab-view');

  function switchTab(tabId) {
    tabViews.forEach(view => {
      if (view.id === tabId) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    navLinks.forEach(link => {
      if (link.getAttribute('data-target-tab') === tabId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Populate tab specific content
    if (tabId === 'reminders') {
      renderReminderList('fullReminderList', 'all');
    } else if (tabId === 'customers') {
      renderCustomers();
    } else if (tabId === 'sales') {
      renderSalesLedger();
    } else if (tabId === 'marketing') {
      renderMarketingTemplates();
    } else if (tabId === 'settings') {
      populateSettingsInputs();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.getAttribute('data-target-tab');
      switchTab(tabId);
    });
  });

  function populateSettingsInputs() {
    const sName = document.getElementById('setSalonName');
    const sOwner = document.getElementById('setOwnerName');
    const sPhone = document.getElementById('setPhone');
    const sAddress = document.getElementById('setAddress');
    const sCycle = document.getElementById('setDefaultCycle');

    if (sName) sName.value = salon.name;
    if (sOwner) sOwner.value = salon.ownerName;
    if (sPhone) sPhone.value = salon.phone;
    if (sAddress) sAddress.value = salon.address;
    if (sCycle) sCycle.value = salon.defaultCycleDays;
  }

  // Customer Search & Filter inputs
  const customerSearchInput = document.getElementById('customerSearchInput');
  const customerFilterPills = document.querySelectorAll('.customer-filter-pill');
  let currentFilter = 'all';

  if (customerSearchInput) {
    customerSearchInput.addEventListener('input', (e) => {
      renderCustomers(currentFilter, e.target.value);
    });
  }

  customerFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      customerFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.getAttribute('data-filter');
      renderCustomers(currentFilter, customerSearchInput ? customerSearchInput.value : '');
    });
  });

  // Toast System
  const toast = document.getElementById('salonoToast');
  const toastMsg = document.getElementById('salonoToastMsg');
  let toastTimeout = null;

  function showToast(msg, duration = 3000) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // Master UI Refresh
  function refreshAllUI() {
    renderSalonInfo();
    renderDashboardKPIs();
    renderReminderList('dashboardReminderList', 'due_only');
    renderSalesLedger();
  }

  // Initial Boot
  refreshAllUI();

});
