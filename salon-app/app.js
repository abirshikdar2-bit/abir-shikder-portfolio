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
    SALES: 'salono_sales_records',
    MONTHLY_HISTORY: 'salono_monthly_history'
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
    {
      id: 'sale_1',
      memoNo: 'SL-101',
      customerName: 'ইমতিয়াজ হক',
      customerPhone: '01744112233',
      serviceName: 'চুল কাটা',
      services: [{ name: 'চুল কাটা', price: 150 }],
      barberName: 'ওস্তাদ মো. আবুল বাশার (মালিক)',
      totalAmount: 150,
      paidAmount: 150,
      dueAmount: 0,
      timestamp: getDateOffset(0, 9, 30),
      paymentMethod: 'ক্যাশ',
      notes: ''
    },
    {
      id: 'sale_2',
      memoNo: 'SL-102',
      customerName: 'ওয়াক-ইন কাস্টমার',
      customerPhone: '',
      serviceName: 'দাড়ি ট্রিম ও শেভ',
      services: [{ name: 'দাড়ি ট্রিম ও শেভ', price: 80 }],
      barberName: 'কারিগর সুজন',
      totalAmount: 80,
      paidAmount: 80,
      dueAmount: 0,
      timestamp: getDateOffset(0, 10, 15),
      paymentMethod: 'ক্যাশ',
      notes: ''
    },
    {
      id: 'sale_3',
      memoNo: 'SL-103',
      customerName: 'মো. রফিকুল ইসলাম',
      customerPhone: '01911223344',
      serviceName: 'চুল + দাড়ি কম্বো',
      services: [{ name: 'চুল + দাড়ি কম্বো', price: 220 }],
      barberName: 'ওস্তাদ মো. আবুল বাশার (মালিক)',
      totalAmount: 220,
      paidAmount: 220,
      dueAmount: 0,
      timestamp: getDateOffset(0, 11, 45),
      paymentMethod: 'বিকাশ',
      notes: ''
    },
    {
      id: 'sale_4',
      memoNo: 'SL-104',
      customerName: 'ওয়াক-ইন কাস্টমার',
      customerPhone: '',
      serviceName: 'ফেসিয়াল ও ম্যাসাজ',
      services: [{ name: 'হার্বাল ফেসিয়াল', price: 300 }, { name: 'হেড ম্যাসাজ', price: 100 }],
      barberName: 'কারিগর রনি',
      totalAmount: 400,
      paidAmount: 400,
      dueAmount: 0,
      timestamp: getDateOffset(0, 13, 10),
      paymentMethod: 'ক্যাশ',
      notes: ''
    },
    {
      id: 'sale_5',
      memoNo: 'SL-105',
      customerName: 'আরিফ আহমেদ',
      customerPhone: '01822334455',
      serviceName: 'চুল কাটা + কালার',
      services: [{ name: 'চুল কাটা', price: 150 }, { name: 'হেয়ার কালার', price: 250 }],
      barberName: 'ওস্তাদ মো. আবুল বাশার (মালিক)',
      totalAmount: 400,
      paidAmount: 400,
      dueAmount: 0,
      timestamp: getDateOffset(0, 14, 20),
      paymentMethod: 'বিকাশ',
      notes: ''
    },
    {
      id: 'sale_6',
      memoNo: 'SL-106',
      customerName: 'ওয়াক-ইন কাস্টমার',
      customerPhone: '',
      serviceName: 'চুল কাটা',
      services: [{ name: 'চুল কাটা', price: 150 }],
      barberName: 'কারিগর সুজন',
      totalAmount: 150,
      paidAmount: 150,
      dueAmount: 0,
      timestamp: getDateOffset(-1, 16, 0),
      paymentMethod: 'ক্যাশ',
      notes: ''
    },
    {
      id: 'sale_7',
      memoNo: 'SL-107',
      customerName: 'ডা. আনোয়ার হোসেন',
      customerPhone: '01511223344',
      serviceName: 'চুল কাটা ও স্পেশাল শেভ',
      services: [{ name: 'চুল কাটা', price: 150 }, { name: 'দাড়ি ট্রিম', price: 80 }],
      barberName: 'ওস্তাদ মো. আবুল বাশার (মালিক)',
      totalAmount: 230,
      paidAmount: 230,
      dueAmount: 0,
      timestamp: getDateOffset(-18, 11, 0),
      paymentMethod: 'ক্যাশ',
      notes: ''
    }
  ];

  // Default Monthly Income Historical Data for Salon Performance Comparison
  const DEFAULT_MONTHLY_HISTORY = [
    {
      id: 'month_current',
      key: '2026-10',
      name: 'অক্টোবর ২০২৬',
      label: 'চলতি মাস (অক্টোবর ২০২৬)',
      isCurrent: true,
      baseIncome: 38500,
      totalClients: 248,
      avgDaily: 1420,
      badgeText: 'চলমান লাইভ',
      badgeClass: 'bg-emerald-500/20 text-emerald-300'
    },
    {
      id: 'month_last',
      key: '2026-09',
      name: 'সেপ্টেম্বর ২০২৬',
      label: 'গত মাস (সেপ্টেম্বর ২০২৬)',
      isCurrent: false,
      baseIncome: 42350,
      totalClients: 274,
      avgDaily: 1411,
      badgeText: 'গত মাস ক্লোজড',
      badgeClass: 'bg-goldPrimary/20 text-goldLight'
    },
    {
      id: 'month_older',
      key: '2026-08',
      name: 'আগস্ট ২০২৬',
      label: 'তার আগের মাস (আগস্ট ২০২৬)',
      isCurrent: false,
      baseIncome: 39800,
      totalClients: 256,
      avgDaily: 1284,
      badgeText: '২ মাস আগে ক্লোজড',
      badgeClass: 'bg-purple-500/20 text-purple-300'
    },
    {
      id: 'month_oldest',
      key: '2026-07',
      name: 'জুলাই ২০২৬',
      label: '৩ মাস আগে (জুলাই ২০২৬)',
      isCurrent: false,
      baseIncome: 36400,
      totalClients: 235,
      avgDaily: 1174,
      badgeText: '৩ মাস আগে ক্লোজড',
      badgeClass: 'bg-blue-500/20 text-blue-300'
    }
  ];

  function getDateOffset(daysOffset, hours = 12, mins = 0) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    d.setHours(hours, mins, 0, 0);
    return d.toISOString();
  }

  // Global Date Anchors for Strict Past-Date-Blocking
  const globalTodayDateObj = new Date();
  const globalYyyy = globalTodayDateObj.getFullYear();
  const globalMm = String(globalTodayDateObj.getMonth() + 1).padStart(2, '0');
  const globalDd = String(globalTodayDateObj.getDate()).padStart(2, '0');
  const localTodayStr = `${globalYyyy}-${globalMm}-${globalDd}`;

  // Load from Storage or Seed
  let salon = JSON.parse(localStorage.getItem(STORAGE_KEYS.SALON)) || DEFAULT_SALON;
  let customers = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) || DEFAULT_CUSTOMERS;
  let sales = JSON.parse(localStorage.getItem(STORAGE_KEYS.SALES)) || DEFAULT_SALES;
  let monthlyHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.MONTHLY_HISTORY)) || DEFAULT_MONTHLY_HISTORY;

  // Auto-upgrade legacy sales if missing fields
  sales = sales.map((s, idx) => ({
    id: s.id || ('sale_' + (Date.now() - idx * 1000)),
    memoNo: s.memoNo || ('SL-' + String(idx + 101).padStart(3, '0')),
    customerName: s.customerName || 'ওয়াক-ইন কাস্টমার',
    customerPhone: s.customerPhone || '',
    serviceName: s.serviceName || 'সেলুন সার্ভিস',
    services: s.services || [{ name: s.serviceName || 'সেলুন সার্ভিস', price: s.amount || s.totalAmount || 150 }],
    barberName: s.barberName || salon.ownerName || 'ওস্তাদ মো. আবুল বাশার (মালিক)',
    totalAmount: Number(s.totalAmount || s.amount || 0),
    paidAmount: Number(s.paidAmount || s.amount || s.totalAmount || 0),
    dueAmount: Number(s.dueAmount || 0),
    timestamp: s.timestamp || new Date().toISOString(),
    paymentMethod: s.paymentMethod || 'ক্যাশ',
    notes: s.notes || ''
  }));

  function persistData() {
    localStorage.setItem(STORAGE_KEYS.SALON, JSON.stringify(salon));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    localStorage.setItem(STORAGE_KEYS.MONTHLY_HISTORY, JSON.stringify(monthlyHistory));
  }

  persistData();

  // ========================================================
  // 2. HELPER FUNCTIONS & FORMATTERS
  // ========================================================
  function formatTaka(amount) {
    return '৳' + Number(amount || 0).toLocaleString('en-IN');
  }

  function isSameDay(d1, d2) {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  function formatBengaliDate(isoOrDate, mode = 'short') {
    const d = new Date(isoOrDate);
    if (isNaN(d.getTime())) return '';

    if (mode === 'timeOnly') {
      return d.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
    }
    if (mode === 'dateOnly') {
      return d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    if (mode === 'dateMonth') {
      return d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long' });
    }
    if (mode === 'dateMonthYear') {
      return d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    if (mode === 'shortDate') {
      return d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });
    }
    if (mode === 'full') {
      const weekday = d.toLocaleDateString('bn-BD', { weekday: 'long' });
      const datePart = d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
      const timePart = d.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
      return `${datePart} (${weekday}), ${timePart}`;
    }
    // Default: 'short' with full date, month, year and time
    return `${d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}, ${d.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}`;
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

  // Dashboard KPIs (Today, Current Month, Last Month, Previous Month, Dues, Clients)
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

    const todayTotal = todaySales.reduce((sum, s) => sum + Number(s.paidAmount || s.totalAmount || s.amount || 0), 0);

    // 3. Monthly Incomes (Current Month, Last Month, Month Before Last)
    const currentMonth = monthlyHistory.find(m => m.id === 'month_current') || DEFAULT_MONTHLY_HISTORY[0];
    const lastMonth = monthlyHistory.find(m => m.id === 'month_last') || DEFAULT_MONTHLY_HISTORY[1];
    const olderMonth = monthlyHistory.find(m => m.id === 'month_older') || DEFAULT_MONTHLY_HISTORY[2];

    const currentMonthTotal = currentMonth.baseIncome + todayTotal;

    // Update Elements
    const kpiTodaySalesEl = document.getElementById('kpiTodaySales');
    const kpiMonthSalesEl = document.getElementById('kpiMonthSales');
    const kpiLastMonthSalesEl = document.getElementById('kpiLastMonthSales');
    const kpiOlderMonthSalesEl = document.getElementById('kpiOlderMonthSales');
    const kpiDueEl = document.getElementById('kpiDueCount');
    const kpiTotalClientsEl = document.getElementById('kpiTotalClients');

    const kpiMonthLabel = document.getElementById('kpiMonthLabel');
    const kpiLastMonthLabel = document.getElementById('kpiLastMonthLabel');
    const kpiOlderMonthLabel = document.getElementById('kpiOlderMonthLabel');

    if (kpiTodaySalesEl) kpiTodaySalesEl.textContent = formatTaka(todayTotal);
    if (kpiMonthSalesEl) kpiMonthSalesEl.textContent = formatTaka(currentMonthTotal);
    if (kpiLastMonthSalesEl) kpiLastMonthSalesEl.textContent = formatTaka(lastMonth.baseIncome);
    if (kpiOlderMonthSalesEl) kpiOlderMonthSalesEl.textContent = formatTaka(olderMonth.baseIncome);
    if (kpiDueEl) kpiDueEl.textContent = dueCount + ' জন';
    if (kpiTotalClientsEl) kpiTotalClientsEl.textContent = customers.length + ' জন';

    if (kpiMonthLabel) kpiMonthLabel.textContent = `চলতি মাস: ${currentMonth.name}`;
    if (kpiLastMonthLabel) kpiLastMonthLabel.textContent = `গত মাস: ${lastMonth.name}`;
    if (kpiOlderMonthLabel) kpiOlderMonthLabel.textContent = `তার আগের মাস: ${olderMonth.name}`;

    // Update notification badges
    document.querySelectorAll('.reminder-badge-count').forEach(el => {
      el.textContent = dueCount;
      el.style.display = dueCount > 0 ? 'inline-flex' : 'none';
    });

    // Render comparison cards
    renderMonthlyHistoryCards(todayTotal);
  }

  // Render Monthly Income Comparison Cards
  function renderMonthlyHistoryCards(todaySalesTotal = 0) {
    const container = document.getElementById('monthlyHistoryCardsContainer');
    if (!container) return;

    const currentMonth = monthlyHistory.find(m => m.id === 'month_current') || DEFAULT_MONTHLY_HISTORY[0];
    const lastMonth = monthlyHistory.find(m => m.id === 'month_last') || DEFAULT_MONTHLY_HISTORY[1];
    const olderMonth = monthlyHistory.find(m => m.id === 'month_older') || DEFAULT_MONTHLY_HISTORY[2];
    const oldestMonth = monthlyHistory.find(m => m.id === 'month_oldest') || DEFAULT_MONTHLY_HISTORY[3];

    const currentTotal = currentMonth.baseIncome + todaySalesTotal;
    const currentClients = currentMonth.totalClients + (sales.length > 0 ? 1 : 0);

    const cardsData = [
      {
        id: 'current',
        title: 'চলতি মাস (অক্টোবর ২০২৬)',
        income: currentTotal,
        clients: currentClients,
        avgDaily: Math.round(currentTotal / 25),
        badge: '● লাইভ চলমান',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        note: 'আজকের বিক্রিকৃত টাকাসহ লাইভ আপডেট',
        isCurrent: true
      },
      {
        id: 'last',
        title: 'গত মাস (সেপ্টেম্বর ২০২৬)',
        income: lastMonth.baseIncome,
        clients: lastMonth.totalClients,
        avgDaily: lastMonth.avgDaily,
        badge: 'গত মাস ক্লোজড',
        badgeColor: 'bg-goldPrimary/20 text-goldLight border-goldPrimary/30',
        note: 'গত ৩০ দিনের চূড়ান্ত সর্বমোট আয়',
        isCurrent: false
      },
      {
        id: 'older',
        title: 'তার আগের মাস (আগস্ট ২০২৬)',
        income: olderMonth.baseIncome,
        clients: olderMonth.totalClients,
        avgDaily: olderMonth.avgDaily,
        badge: '২ মাস আগে ক্লোজড',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        note: 'পূর্ববর্তী ৩১ দিনের সমাপ্ত আয় খাতা',
        isCurrent: false
      },
      {
        id: 'oldest',
        title: '৩ মাস আগে (জুলাই ২০২৬)',
        income: oldestMonth.baseIncome,
        clients: oldestMonth.totalClients,
        avgDaily: oldestMonth.avgDaily,
        badge: '৩ মাস আগে ক্লোজড',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        note: 'পূর্ববর্তী ৩১ দিনের সংরক্ষিত রেকর্ড',
        isCurrent: false
      }
    ];

    container.innerHTML = cardsData.map(c => `
      <div class="monthly-history-card ${c.isCurrent ? 'is-current' : ''}" data-month-card-id="${c.id}">
        <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-subtle">
          <span class="text-xs font-bold text-white font-bangla">${c.title}</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full border font-mono font-medium ${c.badgeColor}">
            ${c.badge}
          </span>
        </div>

        <div class="space-y-0.5 mb-2.5">
          <div class="text-[11px] text-zinc-400">সর্বমোট ইনকাম / সেল:</div>
          <div class="font-outfit font-extrabold text-xl ${c.isCurrent ? 'text-goldLight' : 'text-white'}">
            ${formatTaka(c.income)}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-2 border-t border-subtle/50 text-[11px]">
          <div>
            <span class="text-zinc-500 block">কাস্টমার সংখ্যা</span>
            <span class="text-zinc-300 font-semibold font-outfit">${c.clients} জন</span>
          </div>
          <div>
            <span class="text-zinc-500 block">গড় দৈনিক আয়</span>
            <span class="text-emerald-400 font-semibold font-outfit">${formatTaka(c.avgDaily)}</span>
          </div>
        </div>

        <div class="text-[10px] text-zinc-400 mt-2.5 bg-black/20 px-2 py-1 rounded flex items-center gap-1">
          <i class="fa-solid fa-circle-check text-[9px] text-goldPrimary"></i>
          <span class="truncate">${c.note}</span>
        </div>
      </div>
    `).join('');

    // Wire Monthly Comparison Selector
    const monthSelect = document.getElementById('monthlyComparisonSelect');
    if (monthSelect) {
      monthSelect.onchange = (e) => {
        const val = e.target.value;
        const targetCard = container.querySelector(`[data-month-card-id="${val}"]`);
        if (targetCard) {
          container.querySelectorAll('.monthly-history-card').forEach(c => c.classList.remove('ring-2', 'ring-goldPrimary'));
          targetCard.classList.add('ring-2', 'ring-goldPrimary');
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          const selText = e.target.options[e.target.selectedIndex].text;
          showToast(`✓ ${selText} এর সম্পূর্ণ হিসাব দেখানো হচ্ছে`);
        }
      };
    }
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

  // ========================================================
  // 3. DAILY SALES & CASH REGISTERS
  // ========================================================
  let currentLedgerPeriod = 'today';
  let modalSelectedChips = [];
  let activeReceiptSale = null;

  // Render Dashboard Today's Live Sales Sector
  function renderDashboardTodaySales() {
    const listContainer = document.getElementById('dashTodaySalesList');
    const totalEl = document.getElementById('dashTodayTotal');
    const clientsEl = document.getElementById('dashTodayClients');
    const cashEl = document.getElementById('dashTodayCash');
    const digitalEl = document.getElementById('dashTodayDigital');
    const dateLabelEl = document.getElementById('dashSalesDateLabel');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter today's sales
    const todaySales = sales.filter(s => {
      const d = new Date(s.timestamp);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });

    const totalAmount = todaySales.reduce((sum, s) => sum + Number(s.paidAmount || s.totalAmount || s.amount || 0), 0);
    const cashAmount = todaySales.filter(s => s.paymentMethod === 'ক্যাশ').reduce((sum, s) => sum + Number(s.paidAmount || s.totalAmount || s.amount || 0), 0);
    const digitalAmount = totalAmount - cashAmount;

    if (totalEl) totalEl.textContent = formatTaka(totalAmount);
    if (clientsEl) clientsEl.textContent = todaySales.length + ' জন';
    if (cashEl) cashEl.textContent = formatTaka(cashAmount);
    if (digitalEl) digitalEl.textContent = formatTaka(digitalAmount);
    if (dateLabelEl) dateLabelEl.textContent = `আজকের তারিখ: ${formatBengaliDate(new Date(), 'dateOnly')} (লাইভ হিসাব)`;

    if (!listContainer) return;

    if (todaySales.length === 0) {
      listContainer.innerHTML = `
        <div class="p-8 text-center bg-surfaceElevated border border-subtle rounded-xl text-zinc-400">
          <i class="fa-solid fa-cash-register text-goldPrimary text-3xl mb-2"></i>
          <p class="font-medium text-white">আজকে এখনো কোনো সেল এন্ট্রি করা হয়নি!</p>
          <p class="text-xs text-zinc-500 mt-1">উপরের দ্রুত ক্যাশ বোতাম চাপুন বা নতুন এন্ট্রি দিন।</p>
        </div>
      `;
      return;
    }

    // Sort newest first
    const sortedToday = [...todaySales].reverse();

    // Responsive Desktop Table & Mobile Cards
    listContainer.innerHTML = `
      <!-- Desktop Table -->
      <div class="hidden md:block sales-table-wrapper">
        <table class="sales-table">
          <thead>
            <tr>
              <th>তারিখ, মাস ও সময়</th>
              <th>কাস্টমারের নাম ও মোবাইল</th>
              <th>সেবা সমূহ</th>
              <th>কে কেটেছে (কারিগর)</th>
              <th>বিল ও পরিশোধ</th>
              <th>মাধ্যম</th>
              <th class="text-right">রশিদ ও অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            ${sortedToday.map(s => `
              <tr>
                <td>
                  <div class="sale-date-badge-box">
                    <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-goldPrimary/10 border border-goldPrimary/30 text-xs font-bold text-goldLight">
                      <i class="fa-regular fa-calendar-days text-goldPrimary text-xs"></i>
                      <span>তারিখ: ${formatBengaliDate(s.timestamp, 'dateMonthYear')}</span>
                    </div>
                    <div class="inline-flex items-center gap-1.5 text-[11px] text-zinc-300 font-mono mt-1 pl-0.5">
                      <span class="text-zinc-400">সময়:</span>
                      <span class="text-white font-bold">${formatBengaliDate(s.timestamp, 'timeOnly')}</span>
                      <span class="text-zinc-600">•</span>
                      <span class="text-goldLight">#${s.memoNo || 'SL-100'}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="font-semibold text-white flex items-center gap-1.5">
                    <span>${s.customerName}</span>
                  </div>
                  ${s.customerPhone ? `<div class="text-xs text-zinc-400 font-mono">${s.customerPhone}</div>` : '<div class="text-[10px] text-zinc-500">ওয়াক-ইন গ্রাহক</div>'}
                </td>
                <td>
                  <span class="inline-block px-2.5 py-1 rounded bg-white/5 border border-subtle text-xs text-zinc-200 font-medium">
                    ${s.serviceName}
                  </span>
                </td>
                <td>
                  <div class="text-xs text-zinc-300 flex items-center gap-1">
                    <i class="fa-solid fa-user-gear text-[10px] text-blue-400"></i>
                    <span>${s.barberName || salon.ownerName}</span>
                  </div>
                </td>
                <td>
                  <div class="font-outfit font-bold text-emeraldLight text-base">+${formatTaka(s.paidAmount || s.totalAmount || s.amount)}</div>
                  ${s.dueAmount > 0 ? `<div class="text-[10px] text-red-400 font-bold">বকেয়া: ${formatTaka(s.dueAmount)}</div>` : ''}
                </td>
                <td>
                  <span class="text-[11px] font-medium px-2 py-0.5 rounded ${s.paymentMethod === 'ক্যাশ' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}">
                    ${s.paymentMethod}
                  </span>
                </td>
                <td class="text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button class="btn-view-receipt text-xs bg-goldPrimary/10 hover:bg-goldPrimary/20 text-goldLight px-2.5 py-1.5 rounded-lg border border-goldPrimary/30 transition-all" data-receipt-id="${s.id}" title="ডিজিটাল রসিদ দেখুন">
                      <i class="fa-solid fa-receipt text-xs"></i>
                      <span>রশিদ</span>
                    </button>
                    <button class="btn-delete-sale text-xs text-zinc-500 hover:text-red-400 p-1.5 rounded hover:bg-white/5 transition-all" data-delete-sale-id="${s.id}" title="রেকর্ড মুছুন">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden mobile-sales-cards">
        ${sortedToday.map(s => `
          <div class="sale-card-single">
            <div class="p-2 rounded-lg bg-surfaceElevated border border-subtle mb-2.5 flex items-center justify-between flex-wrap gap-1.5">
              <div class="flex items-center gap-1.5 text-xs font-bold text-goldLight">
                <i class="fa-regular fa-calendar-days text-goldPrimary text-xs"></i>
                <span>তারিখ ও মাস: ${formatBengaliDate(s.timestamp, 'dateMonthYear')}</span>
              </div>
              <div class="text-xs font-mono text-zinc-300 flex items-center gap-1">
                <i class="fa-regular fa-clock text-zinc-400 text-[10px]"></i>
                <span>সময়: ${formatBengaliDate(s.timestamp, 'timeOnly')}</span>
              </div>
            </div>

            <div class="flex items-center justify-between pb-2 border-b border-subtle gap-2">
              <span class="text-[11px] text-zinc-400 font-mono">মেমো নং: #${s.memoNo || 'SL-100'}</span>
              <div class="text-right">
                <span class="font-outfit font-bold text-emeraldLight text-base">+${formatTaka(s.paidAmount || s.totalAmount || s.amount)}</span>
                <span class="text-[10px] ml-1 px-1.5 py-0.5 rounded ${s.paymentMethod === 'ক্যাশ' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-400'}">${s.paymentMethod}</span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2">
              <div>
                <h4 class="font-bold text-white text-sm">${s.customerName}</h4>
                <div class="text-xs text-goldLight mt-0.5">✂️ ${s.serviceName}</div>
                <div class="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
                  <i class="fa-solid fa-user-gear text-[10px] text-blue-400"></i>
                  <span>${s.barberName || salon.ownerName}</span>
                </div>
              </div>

              <div class="flex flex-col gap-1 items-end">
                <button class="btn-view-receipt text-xs bg-goldPrimary/10 hover:bg-goldPrimary/20 text-goldLight px-3 py-1.5 rounded-lg border border-goldPrimary/30" data-receipt-id="${s.id}">
                  <i class="fa-solid fa-receipt text-xs mr-1"></i> রসিদ
                </button>
                <button class="btn-delete-sale text-[11px] text-zinc-500 hover:text-red-400 py-1" data-delete-sale-id="${s.id}">
                  <i class="fa-solid fa-trash-can text-[10px]"></i> মুছুন
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Attach receipt and delete handlers
    listContainer.querySelectorAll('[data-receipt-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        openReceiptModal(btn.getAttribute('data-receipt-id'));
      });
    });

    listContainer.querySelectorAll('[data-delete-sale-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        deleteSale(btn.getAttribute('data-delete-sale-id'));
      });
    });
  }

  // Render Comprehensive Multi-Date Sales Ledger (in Tab 4: Sales)
  function renderComprehensiveSalesLedger() {
    const container = document.getElementById('comprehensiveSalesLedger');
    const totalEl = document.getElementById('ledgerPeriodTotal');
    const clientsEl = document.getElementById('ledgerPeriodClients');
    const cashEl = document.getElementById('ledgerPeriodCash');
    const digitalEl = document.getElementById('ledgerPeriodDigital');
    const headingEl = document.getElementById('ledgerListHeading');
    const countEl = document.getElementById('ledgerListCount');

    const now = new Date();
    const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let filtered = [...sales];
    let headingText = 'আজকের বিস্তারিত ক্যাশ বিবরণী';

    if (currentLedgerPeriod === 'today') {
      filtered = filtered.filter(s => {
        const d = new Date(s.timestamp);
        return isSameDay(d, now);
      });
      headingText = `আজকের সেল বিবরণী (${formatBengaliDate(now, 'dateMonthYear')})`;
    } else if (currentLedgerPeriod === 'tomorrow') {
      const tomorrow = new Date(todayZero.getTime() + 24 * 60 * 60 * 1000);
      filtered = filtered.filter(s => {
        const d = new Date(s.timestamp);
        return isSameDay(d, tomorrow);
      });
      headingText = `আগামীকালের হিসাব (${formatBengaliDate(tomorrow, 'dateMonthYear')})`;
    } else if (currentLedgerPeriod === 'next3') {
      const tomorrow = new Date(todayZero.getTime() + 24 * 60 * 60 * 1000);
      const end3 = new Date(todayZero.getTime() + 4 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(s => {
        const d = new Date(s.timestamp);
        return d >= tomorrow && d < end3;
      });
      headingText = 'পরশু ও আগামী ৩ দিনের বুকিং ও হিসাব';
    } else if (currentLedgerPeriod === 'week') {
      const endWeek = new Date(todayZero.getTime() + 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(s => {
        const d = new Date(s.timestamp);
        return d >= todayZero && d <= endWeek;
      });
      headingText = 'চলতি সপ্তাহ (আজ ও আগামী ৭ দিন)';
    } else if (currentLedgerPeriod === 'all') {
      headingText = 'সকল বিক্রয় ও আয় বিবরণী';
    } else if (currentLedgerPeriod.includes('-')) {
      // Specific date format: YYYY-MM-DD
      const targetDate = new Date(currentLedgerPeriod + 'T00:00:00');
      filtered = filtered.filter(s => {
        const d = new Date(s.timestamp);
        return isSameDay(d, targetDate);
      });
      headingText = `${formatBengaliDate(targetDate, 'dateMonthYear')}-এর সেল বিবরণী`;
    }

    const totalAmount = filtered.reduce((sum, s) => sum + Number(s.paidAmount || s.totalAmount || s.amount || 0), 0);
    const cashAmount = filtered.filter(s => s.paymentMethod === 'ক্যাশ').reduce((sum, s) => sum + Number(s.paidAmount || s.totalAmount || s.amount || 0), 0);
    const digitalAmount = totalAmount - cashAmount;

    if (totalEl) totalEl.textContent = formatTaka(totalAmount);
    if (clientsEl) clientsEl.textContent = filtered.length + ' জন';
    if (cashEl) cashEl.textContent = formatTaka(cashAmount);
    if (digitalEl) digitalEl.textContent = formatTaka(digitalAmount);
    if (headingEl) headingEl.textContent = headingText;
    if (countEl) countEl.textContent = filtered.length + ' টি এন্ট্রি';

    if (!container) return;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center bg-surface border border-card rounded-xl text-zinc-400">
          <i class="fa-solid fa-receipt text-zinc-600 text-3xl mb-2"></i>
          <p class="font-medium text-white">এই তারিখ বা সময়ে কোনো সেল এন্ট্রি পাওয়া যায়নি।</p>
          <p class="text-xs text-zinc-500 mt-1">ক্যালেন্ডার থেকে আজ বা আগামী দিনগুলো নির্বাচন করুন অথবা নতুন হিসাব যোগ করুন।</p>
        </div>
      `;
      return;
    }

    const sorted = [...filtered].reverse();

    container.innerHTML = `
      <!-- Desktop View Table -->
      <div class="hidden md:block sales-table-wrapper">
        <table class="sales-table">
          <thead>
            <tr>
              <th>তারিখ, মাস ও সময়</th>
              <th>কাস্টমারের নাম ও মোবাইল</th>
              <th>সেবা</th>
              <th>কারিগর</th>
              <th>বিল ও পরিশোধ</th>
              <th>মাধ্যম</th>
              <th class="text-right">রশিদ ও অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            ${sorted.map(s => `
              <tr>
                <td>
                  <div class="sale-date-badge-box">
                    <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-goldPrimary/10 border border-goldPrimary/30 text-xs font-bold text-goldLight">
                      <i class="fa-regular fa-calendar-days text-goldPrimary text-xs"></i>
                      <span>তারিখ: ${formatBengaliDate(s.timestamp, 'dateMonthYear')}</span>
                    </div>
                    <div class="inline-flex items-center gap-1.5 text-[11px] text-zinc-300 font-mono mt-1 pl-0.5">
                      <span class="text-zinc-400">সময়:</span>
                      <span class="text-white font-bold">${formatBengaliDate(s.timestamp, 'timeOnly')}</span>
                      <span class="text-zinc-600">•</span>
                      <span class="text-goldLight">#${s.memoNo || 'SL-100'}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="font-semibold text-white">${s.customerName}</div>
                  ${s.customerPhone ? `<div class="text-xs text-zinc-400 font-mono">${s.customerPhone}</div>` : '<div class="text-[10px] text-zinc-500">ওয়াক-ইন</div>'}
                </td>
                <td>
                  <span class="inline-block px-2.5 py-1 rounded bg-white/5 border border-subtle text-xs text-zinc-200">
                    ${s.serviceName}
                  </span>
                </td>
                <td>
                  <div class="text-xs text-zinc-300 flex items-center gap-1">
                    <i class="fa-solid fa-user-gear text-[10px] text-blue-400"></i>
                    <span>${s.barberName || salon.ownerName}</span>
                  </div>
                </td>
                <td>
                  <div class="font-outfit font-bold text-emeraldLight text-base">+${formatTaka(s.paidAmount || s.totalAmount || s.amount)}</div>
                  ${s.dueAmount > 0 ? `<div class="text-[10px] text-red-400 font-bold">বকেয়া: ${formatTaka(s.dueAmount)}</div>` : ''}
                </td>
                <td>
                  <span class="text-[11px] font-medium px-2 py-0.5 rounded ${s.paymentMethod === 'ক্যাশ' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}">
                    ${s.paymentMethod}
                  </span>
                </td>
                <td class="text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button class="btn-view-receipt text-xs bg-goldPrimary/10 hover:bg-goldPrimary/20 text-goldLight px-2.5 py-1.5 rounded-lg border border-goldPrimary/30 transition-all" data-receipt-id="${s.id}">
                      <i class="fa-solid fa-receipt text-xs"></i>
                      <span>রশিদ</span>
                    </button>
                    <button class="btn-delete-sale text-xs text-zinc-500 hover:text-red-400 p-1.5 rounded hover:bg-white/5 transition-all" data-delete-sale-id="${s.id}" title="মুছুন">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Mobile View Cards -->
      <div class="md:hidden mobile-sales-cards">
        ${sorted.map(s => `
          <div class="sale-card-single">
            <div class="p-2 rounded-lg bg-surfaceElevated border border-subtle mb-2.5 flex items-center justify-between flex-wrap gap-1.5">
              <div class="flex items-center gap-1.5 text-xs font-bold text-goldLight">
                <i class="fa-regular fa-calendar-days text-goldPrimary text-xs"></i>
                <span>তারিখ ও মাস: ${formatBengaliDate(s.timestamp, 'dateMonthYear')}</span>
              </div>
              <div class="text-xs font-mono text-zinc-300 flex items-center gap-1">
                <i class="fa-regular fa-clock text-zinc-400 text-[10px]"></i>
                <span>সময়: ${formatBengaliDate(s.timestamp, 'timeOnly')}</span>
              </div>
            </div>

            <div class="flex items-center justify-between pb-2 border-b border-subtle gap-2">
              <span class="text-[11px] text-zinc-400 font-mono">মেমো নং: #${s.memoNo || 'SL-100'}</span>
              <div class="text-right">
                <span class="font-outfit font-bold text-emeraldLight text-base">+${formatTaka(s.paidAmount || s.totalAmount || s.amount)}</span>
                <span class="text-[10px] ml-1 px-1.5 py-0.5 rounded ${s.paymentMethod === 'ক্যাশ' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-400'}">${s.paymentMethod}</span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2">
              <div>
                <h4 class="font-bold text-white text-sm">${s.customerName}</h4>
                <div class="text-xs text-goldLight mt-0.5">✂️ ${s.serviceName}</div>
                <div class="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
                  <i class="fa-solid fa-user-gear text-[10px] text-blue-400"></i>
                  <span>${s.barberName || salon.ownerName}</span>
                </div>
              </div>

              <div class="flex flex-col gap-1 items-end">
                <button class="btn-view-receipt text-xs bg-goldPrimary/10 hover:bg-goldPrimary/20 text-goldLight px-3 py-1.5 rounded-lg border border-goldPrimary/30" data-receipt-id="${s.id}">
                  <i class="fa-solid fa-receipt text-xs mr-1"></i> রশিদ
                </button>
                <button class="btn-delete-sale text-[11px] text-zinc-500 hover:text-red-400 py-1" data-delete-sale-id="${s.id}">
                  <i class="fa-solid fa-trash-can text-[10px]"></i> মুছুন
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.querySelectorAll('[data-receipt-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        openReceiptModal(btn.getAttribute('data-receipt-id'));
      });
    });

    container.querySelectorAll('[data-delete-sale-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        deleteSale(btn.getAttribute('data-delete-sale-id'));
      });
    });
  }

  // Delete a sale
  function deleteSale(saleId) {
    const sale = sales.find(s => s.id === saleId);
    if (!sale) return;

    if (confirm(`আপনি কি #${sale.memoNo || 'SL-100'} এর "${sale.serviceName}" এন্ট্রিটি মুছে ফেলতে চান?`)) {
      sales = sales.filter(s => s.id !== saleId);
      persistData();
      refreshAllUI();
      showToast('✓ সেলের রেকর্ডটি সফলভাবে মুছে ফেলা হয়েছে!');
    }
  }

  // Open Receipt Modal
  const receiptModal = document.getElementById('receiptModal');
  const receiptPaper = document.getElementById('receiptPaper');
  const printReceiptBtn = document.getElementById('printReceiptBtn');
  const whatsappReceiptBtn = document.getElementById('whatsappReceiptBtn');

  function openReceiptModal(saleId) {
    const sale = sales.find(s => s.id === saleId);
    if (!sale || !receiptModal || !receiptPaper) return;

    activeReceiptSale = sale;

    const formattedDate = formatBengaliDate(sale.timestamp, 'full');
    const memoNo = sale.memoNo || ('SL-' + sale.id.slice(-4));
    const barber = sale.barberName || salon.ownerName;
    const total = Number(sale.totalAmount || sale.amount || 0);
    const paid = Number(sale.paidAmount || sale.amount || 0);
    const due = Number(sale.dueAmount || 0);

    // Itemized list if available
    const servicesList = (sale.services && sale.services.length > 0)
      ? sale.services
      : [{ name: sale.serviceName, price: total }];

    receiptPaper.innerHTML = `
      <div class="text-center pb-3">
        <div class="text-2xl font-black text-goldLight tracking-wider mb-1">${salon.name}</div>
        <div class="text-xs text-zinc-400">${salon.address}</div>
        <div class="text-xs text-zinc-400">মোবাইল: ${salon.phone}</div>
        <div class="mt-2 inline-block px-3 py-0.5 rounded bg-white/10 text-[11px] font-bold text-white tracking-widest uppercase">
          ক্যাশ মেমো / রসিদ
        </div>
      </div>

      <div class="receipt-dashed-line"></div>

      <div class="text-xs space-y-1.5 font-mono">
        <div class="flex justify-between">
          <span class="text-zinc-400">মেমো নং:</span>
          <span class="font-bold text-white">#${memoNo}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-zinc-400">তারিখ ও মাস:</span>
          <span class="font-bold text-white">${formatBengaliDate(sale.timestamp, 'dateMonthYear')}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-zinc-400">লেনদেনের সময়:</span>
          <span class="text-goldLight font-bold">${formatBengaliDate(sale.timestamp, 'timeOnly')}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-zinc-400">কাস্টমার:</span>
          <span class="font-bold text-white">${sale.customerName}</span>
        </div>
        ${sale.customerPhone ? `
          <div class="flex justify-between">
            <span class="text-zinc-400">মোবাইল:</span>
            <span class="text-white">${sale.customerPhone}</span>
          </div>
        ` : ''}
        <div class="flex justify-between">
          <span class="text-zinc-400">কারিগর / বারবার:</span>
          <span class="text-goldLight font-bold">${barber}</span>
        </div>
      </div>

      <div class="receipt-dashed-line"></div>

      <!-- Itemized Services Table -->
      <div class="mb-3">
        <div class="flex justify-between text-xs font-bold text-zinc-400 mb-2 border-b border-subtle pb-1">
          <span>সেবার বিবরণ</span>
          <span>মূল্য (৳)</span>
        </div>
        ${servicesList.map(srv => `
          <div class="receipt-item-row text-xs">
            <span class="text-zinc-200">✂️ ${srv.name}</span>
            <span class="font-mono font-bold text-white">${formatTaka(srv.price)}</span>
          </div>
        `).join('')}
      </div>

      <div class="receipt-dashed-line"></div>

      <!-- Totals -->
      <div class="space-y-1.5 text-xs font-mono">
        <div class="flex justify-between text-sm">
          <span class="font-bold text-white">সর্বমোট বিল:</span>
          <span class="font-bold text-goldLight font-outfit text-base">${formatTaka(total)}</span>
        </div>
        <div class="flex justify-between text-emerald-400 font-bold">
          <span>পরিশোধ (${sale.paymentMethod}):</span>
          <span class="font-outfit text-base">${formatTaka(paid)}</span>
        </div>
        ${due > 0 ? `
          <div class="flex justify-between text-red-400 font-bold">
            <span>বকেয়া / বাকি:</span>
            <span class="font-outfit text-base">${formatTaka(due)}</span>
          </div>
        ` : `
          <div class="flex justify-between text-zinc-400 text-[11px]">
            <span>বকেয়া:</span>
            <span>৳০ (সম্পূর্ণ পরিশোধিত)</span>
          </div>
        `}
      </div>

      <div class="receipt-dashed-line"></div>

      <div class="text-center pt-2">
        <p class="text-xs text-zinc-300 font-bangla">আপনার সুন্দর লুক আমাদের সন্তুষ্টি।</p>
        <p class="text-[11px] text-zinc-500 font-bangla mt-0.5">ধন্যবাদ, আবার আসবেন!</p>
        <div class="mt-3 text-[10px] text-zinc-600 font-mono tracking-widest">
          •••••••• SALONO SMART POS ••••••••
        </div>
      </div>
    `;

    receiptModal.classList.add('active');
  }

  // Print Receipt
  if (printReceiptBtn) {
    printReceiptBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // WhatsApp Receipt
  if (whatsappReceiptBtn) {
    whatsappReceiptBtn.addEventListener('click', () => {
      if (!activeReceiptSale) return;
      const s = activeReceiptSale;
      const phone = s.customerPhone ? s.customerPhone.replace(/[^0-9]/g, '') : '';
      let targetPhone = phone;
      if (targetPhone.startsWith('0')) targetPhone = '880' + targetPhone.substring(1);

      const msg = `আসসালামু আলাইকুম ${s.customerName} ভাই! ${salon.name} থেকে আপনার সেবার ডিজিটাল রসিদ:\n\n` +
        `মেমো নং: #${s.memoNo || 'SL-100'}\n` +
        `তারিখ ও সময়: ${formatBengaliDate(s.timestamp, 'short')}\n` +
        `সেবা: ${s.serviceName}\n` +
        `কারিগর: ${s.barberName || salon.ownerName}\n` +
        `মোট বিল: ${formatTaka(s.totalAmount || s.amount)}\n` +
        `পরিশোধ: ${formatTaka(s.paidAmount || s.amount)} (${s.paymentMethod})\n` +
        (s.dueAmount > 0 ? `বকেয়া: ${formatTaka(s.dueAmount)}\n` : '') +
        `\nআমাদের সেলুনে আসার জন্য আপনাকে ধন্যবাদ! আবার আসবেন।\n— ${salon.name} (${salon.phone})`;

      if (targetPhone) {
        window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`, '_blank');
      } else {
        navigator.clipboard.writeText(msg);
        showToast('✓ কাস্টমারের ফোন নম্বর নেই, মেমো টেক্সট কপি করা হয়েছে!');
      }
    });
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

    cust.lastVisitDate = new Date().toISOString();
    cust.totalVisits = (cust.totalVisits || 0) + 1;
    cust.totalSpent = (cust.totalSpent || 0) + Number(cust.regularAmount);

    const saleAmount = Number(cust.regularAmount);
    const newSale = {
      id: 'sale_' + Date.now(),
      memoNo: 'SL-' + String(sales.length + 101).padStart(3, '0'),
      customerName: cust.name,
      customerPhone: cust.phone,
      serviceName: cust.styleNote || 'চুল ও দাড়ি সার্ভিস',
      services: [{ name: cust.styleNote || 'চুল ও দাড়ি সার্ভিস', price: saleAmount }],
      barberName: salon.ownerName || 'ওস্তাদ মো. আবুল বাশার (মালিক)',
      totalAmount: saleAmount,
      paidAmount: saleAmount,
      dueAmount: 0,
      timestamp: new Date().toISOString(),
      paymentMethod: 'ক্যাশ',
      notes: ''
    };
    sales.push(newSale);

    persistData();
    refreshAllUI();
    showToast(`✓ ${cust.name} ভাইয়ের চুল কাটা সম্পন্ন হয়েছে এবং ${formatTaka(saleAmount)} সেলে যুক্ত হয়েছে!`);
    openReceiptModal(newSale.id);
  }

  // Quick Service Sale Entry (From POS Register)
  function handleQuickSale(serviceName, amount) {
    const numAmount = Number(amount);
    const now = new Date();
    const dateFormatted = formatBengaliDate(now, 'dateMonthYear');
    const timeFormatted = formatBengaliDate(now, 'timeOnly');
    const newSale = {
      id: 'sale_' + Date.now(),
      memoNo: 'SL-' + String(sales.length + 101).padStart(3, '0'),
      customerName: 'ওয়াক-ইন কাস্টমার',
      customerPhone: '',
      serviceName: serviceName,
      services: [{ name: serviceName, price: numAmount }],
      barberName: salon.ownerName || 'ওস্তাদ মো. আবুল বাশার (মালিক)',
      totalAmount: numAmount,
      paidAmount: numAmount,
      dueAmount: 0,
      timestamp: now.toISOString(),
      paymentMethod: 'ক্যাশ',
      notes: ''
    };
    sales.push(newSale);
    persistData();
    refreshAllUI();
    showToast(`✓ ${serviceName} বাবদ +${formatTaka(amount)} যোগ হয়েছে! [📅 ${dateFormatted} | ⏰ ${timeFormatted}]`);
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
        const avatars = ['👨', '🧑', '🧔', '💇‍♂️', '👨‍💼', '👦'];
        const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
        const newCust = {
          id: 'cust_' + Date.now(),
          name,
          phone,
          cycleDays,
          lastVisitDate: new Date().toISOString(),
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

  // Smart Custom Sale Modal & Multi-Select Chips
  const customSaleModal = document.getElementById('customSaleModal');
  const customSaleForm = document.getElementById('customSaleForm');
  const saleDateTimeInput = document.getElementById('saleDateTime');
  const saleCustomerSelect = document.getElementById('saleCustomerSelect');
  const saleCustomerInput = document.getElementById('saleCustomerInput');
  const saleCustomerPhone = document.getElementById('saleCustomerPhone');
  const saleBarberName = document.getElementById('saleBarberName');
  const saleTotalAmount = document.getElementById('saleTotalAmount');
  const salePaidAmount = document.getElementById('salePaidAmount');
  const saleDueAmount = document.getElementById('saleDueAmount');
  const salePaymentMethod = document.getElementById('salePaymentMethod');
  const saleCustomServiceName = document.getElementById('saleCustomServiceName');
  const selectedServicesCount = document.getElementById('selectedServicesCount');
  const modalServiceChips = document.getElementById('modalServiceChips');

  // Live Bengali Date & Time Preview for Modal Header
  function updateModalDateDisplay(dateObj) {
    const d = dateObj || new Date();
    const dateBengali = d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
    const weekdayBengali = d.toLocaleDateString('bn-BD', { weekday: 'long' });
    const timeBengali = d.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });

    const liveDateEl = document.getElementById('modalLiveDateDisplay');
    const liveTimeEl = document.getElementById('modalLiveTimeDisplay');
    const previewEl = document.getElementById('saleDateTimePreview');

    if (liveDateEl) liveDateEl.textContent = `${dateBengali} (${weekdayBengali})`;
    if (liveTimeEl) liveTimeEl.textContent = timeBengali;
    if (previewEl) {
      previewEl.innerHTML = `
        <i class="fa-solid fa-calendar-check text-emerald-400 text-[10px]"></i>
        <span>📅 নির্বাচিত: <strong class="text-white">${dateBengali}</strong> | ⏰ সময়: <strong class="text-white">${timeBengali}</strong></span>
      `;
    }
  }

  function openSmartSaleModal() {
    if (!customSaleModal || !customSaleForm) return;
    customSaleForm.reset();
    modalSelectedChips = [];

    // 1. Auto-populate Local Datetime and strictly block past dates
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60000;
    const localIso = new Date(now.getTime() - offsetMs).toISOString().slice(0, 16);
    if (saleDateTimeInput) {
      saleDateTimeInput.value = localIso;
      saleDateTimeInput.min = `${localTodayStr}T00:00`;
    }
    updateModalDateDisplay(now);

    // 2. Populate Customers dropdown
    if (saleCustomerSelect) {
      saleCustomerSelect.innerHTML = `
        <option value="">-- রেজিস্টার্ড কাস্টমার তালিকা --</option>
        ${customers.map(c => `
          <option value="${c.id}" data-phone="${c.phone}" data-name="${c.name}" data-amount="${c.regularAmount}">
            ${c.name} (${c.phone})
          </option>
        `).join('')}
      `;
    }

    // 3. Reset chips selection
    if (modalServiceChips) {
      modalServiceChips.querySelectorAll('.service-chip').forEach(c => c.classList.remove('selected'));
    }
    if (selectedServicesCount) selectedServicesCount.textContent = '০ টি নির্বাচিত';
    if (saleTotalAmount) saleTotalAmount.value = '';
    if (salePaidAmount) salePaidAmount.value = '';
    if (saleDueAmount) saleDueAmount.value = '0';

    customSaleModal.classList.add('active');
  }

  // Real-time listener for datetime input in modal (Blocking past and updating display)
  if (saleDateTimeInput) {
    saleDateTimeInput.addEventListener('input', (e) => {
      const selectedVal = e.target.value;
      if (selectedVal) {
        const selectedDateStr = selectedVal.slice(0, 10);
        if (selectedDateStr < localTodayStr) {
          const now = new Date();
          const offsetMs = now.getTimezoneOffset() * 60000;
          saleDateTimeInput.value = new Date(now.getTime() - offsetMs).toISOString().slice(0, 16);
          showToast('⚠️ পেছনের কোনো তারিখ বা মাস সিলেক্ট করা যাবে না! শুধুমাত্র আজ ও ভবিষ্যৎ প্রযোজ্য।');
          updateModalDateDisplay(now);
          return;
        }
        updateModalDateDisplay(new Date(selectedVal));
      }
    });
  }

  // Customer dropdown change handler
  if (saleCustomerSelect) {
    saleCustomerSelect.addEventListener('change', () => {
      const selectedOpt = saleCustomerSelect.selectedOptions[0];
      if (selectedOpt && selectedOpt.value) {
        if (saleCustomerInput) saleCustomerInput.value = selectedOpt.getAttribute('data-name');
        if (saleCustomerPhone) saleCustomerPhone.value = selectedOpt.getAttribute('data-phone');
        if (modalSelectedChips.length === 0 && saleTotalAmount) {
          const regAmount = selectedOpt.getAttribute('data-amount') || '150';
          saleTotalAmount.value = regAmount;
          if (salePaidAmount) salePaidAmount.value = regAmount;
          if (saleDueAmount) saleDueAmount.value = '0';
        }
      }
    });
  }

  // Interactive Chip Selection
  if (modalServiceChips) {
    modalServiceChips.querySelectorAll('.service-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const name = chip.getAttribute('data-chip-name');
        const price = Number(chip.getAttribute('data-chip-price'));

        const existingIdx = modalSelectedChips.findIndex(c => c.name === name);
        if (existingIdx > -1) {
          modalSelectedChips.splice(existingIdx, 1);
          chip.classList.remove('selected');
        } else {
          modalSelectedChips.push({ name, price });
          chip.classList.add('selected');
        }

        // Recalculate Total
        const chipTotal = modalSelectedChips.reduce((sum, c) => sum + c.price, 0);
        if (saleTotalAmount) saleTotalAmount.value = chipTotal > 0 ? chipTotal : '';
        if (salePaidAmount) salePaidAmount.value = chipTotal > 0 ? chipTotal : '';
        if (saleDueAmount) saleDueAmount.value = '0';
        if (selectedServicesCount) selectedServicesCount.textContent = modalSelectedChips.length + ' টি নির্বাচিত';

        // Auto update custom service text input if empty
        if (saleCustomServiceName) {
          saleCustomServiceName.placeholder = modalSelectedChips.map(c => c.name).join(' + ') || 'অন্যান্য কাস্টম সেবার নাম';
        }
      });
    });
  }

  // Live Due Calculation
  function updateDueAmount() {
    const total = Number(saleTotalAmount.value) || 0;
    const paid = Number(salePaidAmount.value) || 0;
    const due = Math.max(0, total - paid);
    if (saleDueAmount) saleDueAmount.value = due;
  }

  if (saleTotalAmount) saleTotalAmount.addEventListener('input', updateDueAmount);
  if (salePaidAmount) salePaidAmount.addEventListener('input', updateDueAmount);

  // Submit Smart Sale Form
  if (customSaleForm) {
    customSaleForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const dt = saleDateTimeInput && saleDateTimeInput.value ? new Date(saleDateTimeInput.value).toISOString() : new Date().toISOString();
      const barber = saleBarberName ? saleBarberName.value : (salon.ownerName || 'ওস্তাদ মো. আবুল বাশার (মালিক)');
      const custName = (saleCustomerInput && saleCustomerInput.value.trim()) || 'ওয়াক-ইন কাস্টমার';
      const custPhone = (saleCustomerPhone && saleCustomerPhone.value.trim()) || '';
      const total = Number(saleTotalAmount.value) || 0;
      const paid = Number(salePaidAmount.value) || 0;
      const due = Number(saleDueAmount.value) || 0;
      const paymentMethod = salePaymentMethod ? salePaymentMethod.value : 'ক্যাশ';
      const customName = saleCustomServiceName ? saleCustomServiceName.value.trim() : '';

      // Determine service name and services array
      let services = [...modalSelectedChips];
      if (customName) {
        services.push({ name: customName, price: total - modalSelectedChips.reduce((s, c) => s + c.price, 0) });
      }
      if (services.length === 0) {
        services = [{ name: customName || 'সাধারণ সেলুন সেবা', price: total }];
      }

      const serviceName = services.map(s => s.name).join(' + ');

      if (total > 0) {
        const newSale = {
          id: 'sale_' + Date.now(),
          memoNo: 'SL-' + String(sales.length + 101).padStart(3, '0'),
          customerName: custName,
          customerPhone: custPhone,
          serviceName: serviceName,
          services: services,
          barberName: barber,
          totalAmount: total,
          paidAmount: paid,
          dueAmount: due,
          timestamp: dt,
          paymentMethod: paymentMethod,
          notes: document.getElementById('saleNotes') ? document.getElementById('saleNotes').value.trim() : ''
        };

        sales.push(newSale);
        persistData();
        closeModals();
        refreshAllUI();
        showToast(`✓ #${newSale.memoNo} সেলের হিসাব সফলভাবে যুক্ত হয়েছে!`);
        openReceiptModal(newSale.id);
      }
    });
  }

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
      renderComprehensiveSalesLedger();
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

  // Sales Period Filter Pills & Calendar Setup (Blocking Past Dates)
  const salesFilterPills = document.querySelectorAll('.sales-filter-pill');
  const salesLedgerDatePicker = document.getElementById('salesLedgerDatePicker');
  const clearDatePickerBtn = document.getElementById('clearDatePickerBtn');

  // Interactive Day Navigation Strip with Past Dates Strictly Blocked
  function renderQuickDayNavStrip() {
    const strip = document.getElementById('quickDayNavStrip');
    if (!strip) return;

    const days = [
      { offset: -2, label: 'গত পরশু', isPast: true },
      { offset: -1, label: 'গতকাল', isPast: true },
      { offset: 0, label: 'আজকের দিন', isToday: true },
      { offset: 1, label: 'আগামীকাল', isFuture: true },
      { offset: 2, label: 'পরশু', isFuture: true },
      { offset: 3, label: 'পরশুর পর', isFuture: true },
      { offset: 4, label: '৪ দিন পর', isFuture: true },
      { offset: 5, label: '৫ দিন পর', isFuture: true },
      { offset: 6, label: '৬ দিন পর', isFuture: true },
      { offset: 7, label: '১ সপ্তাহ পর', isFuture: true }
    ];

    const todayDate = new Date();

    strip.innerHTML = days.map(d => {
      const targetDate = new Date(todayDate.getTime() + d.offset * 24 * 60 * 60 * 1000);
      const isoYMD = targetDate.toISOString().slice(0, 10);
      const dateBengali = targetDate.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });

      if (d.isPast) {
        return `
          <button type="button" class="day-pill locked" data-blocked-date="${isoYMD}" title="পেছনের তারিখ নির্বাচন করা যাবে না (ব্লকড)">
            <span class="day-pill-label flex items-center gap-1 text-zinc-400">
              <i class="fa-solid fa-lock text-[10px] text-red-400"></i>
              <span>${d.label}</span>
            </span>
            <span class="day-pill-sub text-red-400/80">${dateBengali} (ব্লক)</span>
          </button>
        `;
      } else if (d.isToday) {
        const isActive = (currentLedgerPeriod === 'today' || currentLedgerPeriod === isoYMD);
        return `
          <button type="button" class="day-pill ${isActive ? 'active' : ''}" data-day-period="today" data-date-str="${isoYMD}">
            <span class="day-pill-label flex items-center gap-1">
              <i class="fa-solid fa-star text-[10px]"></i>
              <span>${d.label}</span>
            </span>
            <span class="day-pill-sub">${dateBengali} (সক্রিয়)</span>
          </button>
        `;
      } else {
        const isActive = (currentLedgerPeriod === isoYMD || (d.offset === 1 && currentLedgerPeriod === 'tomorrow') || (d.offset === 2 && currentLedgerPeriod === 'next3'));
        return `
          <button type="button" class="day-pill ${isActive ? 'active' : ''}" data-day-period="${isoYMD}" data-date-str="${isoYMD}">
            <span class="day-pill-label">${d.label}</span>
            <span class="day-pill-sub">${dateBengali}</span>
          </button>
        `;
      }
    }).join('');

    // Attach click events to past locked days
    strip.querySelectorAll('.day-pill.locked').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('⚠️ পেছনের কোনো তারিখ বা মাস সিলেক্ট করা যাবে না! শুধুমাত্র আজ এবং ভবিষ্যতের তারিখ গ্রহণযোগ্য।');
      });
    });

    // Attach click events to active & future days
    strip.querySelectorAll('.day-pill:not(.locked)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const period = btn.getAttribute('data-day-period');
        currentLedgerPeriod = period;

        // sync with filter pills and date picker
        salesFilterPills.forEach(p => {
          if (p.getAttribute('data-period') === period) p.classList.add('active');
          else p.classList.remove('active');
        });

        if (salesLedgerDatePicker) {
          if (period === 'today') {
            salesLedgerDatePicker.value = '';
          } else if (period.includes('-')) {
            salesLedgerDatePicker.value = period;
          }
        }

        renderQuickDayNavStrip();
        renderComprehensiveSalesLedger();
      });
    });
  }

  // Block previous/past dates in calendar picker
  if (salesLedgerDatePicker) {
    salesLedgerDatePicker.min = localTodayStr;
    const handleDatePickerChange = (e) => {
      if (e.target.value) {
        if (e.target.value < localTodayStr) {
          e.target.value = localTodayStr;
          showToast('⚠️ পেছনের কোনো তারিখ বা মাস নির্বাচন করা যাবে না! শুধুমাত্র আজ ও ভবিষ্যৎ প্রযোজ্য।');
        }
        currentLedgerPeriod = e.target.value;
        salesFilterPills.forEach(p => p.classList.remove('active'));
        if (clearDatePickerBtn) clearDatePickerBtn.classList.remove('hidden');
        renderQuickDayNavStrip();
        renderComprehensiveSalesLedger();
      }
    };
    salesLedgerDatePicker.addEventListener('change', handleDatePickerChange);
    salesLedgerDatePicker.addEventListener('input', handleDatePickerChange);
  }

  salesFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      salesFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentLedgerPeriod = pill.getAttribute('data-period');
      if (salesLedgerDatePicker) salesLedgerDatePicker.value = '';
      if (clearDatePickerBtn) clearDatePickerBtn.classList.add('hidden');
      renderQuickDayNavStrip();
      renderComprehensiveSalesLedger();
    });
  });

  if (clearDatePickerBtn) {
    clearDatePickerBtn.addEventListener('click', () => {
      if (salesLedgerDatePicker) salesLedgerDatePicker.value = '';
      clearDatePickerBtn.classList.add('hidden');
      currentLedgerPeriod = 'today';
      salesFilterPills.forEach(p => {
        if (p.getAttribute('data-period') === 'today') p.classList.add('active');
        else p.classList.remove('active');
      });
      renderQuickDayNavStrip();
      renderComprehensiveSalesLedger();
    });
  }

  // Trigger Smart Sale Modal
  document.querySelectorAll('.open-custom-sale-btn').forEach(btn => {
    btn.addEventListener('click', openSmartSaleModal);
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
    renderDashboardTodaySales();
    renderQuickDayNavStrip();
    renderComprehensiveSalesLedger();
  }

  // Initial Boot
  refreshAllUI();

});

