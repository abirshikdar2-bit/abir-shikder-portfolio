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
    MONTHLY_HISTORY: 'salono_monthly_history',
    BOOKINGS: 'salono_bookings_records',
    TENANTS: 'salono_tenants_registry',
    ACTIVE_TENANT: 'salono_active_tenant_id'
  };

  // Default Initial Seed Data for Multi-Salon Tenants
  const DEFAULT_TENANTS = [
    {
      id: 'tenant_royal',
      name: 'রয়্যাল জেন্টস পার্লার ও সেলুন',
      ownerName: 'ওস্তাদ আবুল বাশার',
      phone: '01734018155',
      address: 'দোকান নং ৪, মেইন রোড, যশোর',
      plan: 'বাৎসরিক ভিআইপি (৳৬০০)',
      status: 'active',
      createdAt: '2026-01-10'
    },
    {
      id: 'tenant_dream',
      name: 'ড্রিম কাট সেলুন অ্যান্ড স্পা',
      ownerName: 'মো. মামুন রশীদ',
      phone: '01712345678',
      address: 'বাজার মোড়, চৌরাস্তা, যশোর',
      plan: 'মাসিক স্ট্যান্ডার্ড (৳১৫০)',
      status: 'active',
      createdAt: '2026-06-15'
    }
  ];

  // Default Initial Seed Data for Instant Demonstration
  const DEFAULT_SALON = {
    name: 'রয়্যাল জেন্টস পার্লার ও সেলুন',
    tagline: 'মডার্ন হেয়ার কাট ও গ্রুমিং স্টুডিও',
    ownerName: 'ওস্তাদ আবুল বাশার',
    phone: '01734018155',
    address: 'দোকান নং ৪, মেইন রোড, যশোর',
    defaultCycleDays: 25,
    subscriptionStatus: 'ভিআইপি প্রো এক্টিভ (৳৬০০/বছর)'
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
    },
    {
      id: 'sale_8',
      memoNo: 'SL-108',
      customerName: 'তানভীর আহমেদ',
      customerPhone: '01711223344',
      serviceName: 'চুল কাটা + স্পেশাল ফেড',
      services: [{ name: 'চুল কাটা', price: 150 }, { name: 'হেড ম্যাসাজ', price: 70 }],
      barberName: 'ওস্তাদ মো. আবুল বাশার (মালিক)',
      totalAmount: 220,
      paidAmount: 220,
      dueAmount: 0,
      timestamp: getDateOffset(-2, 15, 30),
      paymentMethod: 'ক্যাশ',
      notes: ''
    },
    {
      id: 'sale_9',
      memoNo: 'SL-109',
      customerName: 'মেহেদী হাসান (ব্যাংকার)',
      customerPhone: '01912445566',
      serviceName: 'হেড ম্যাসাজ ও ফেসিয়াল',
      services: [{ name: 'হার্বাল ফেসিয়াল', price: 300 }, { name: 'দাড়ি শেভ', price: 80 }],
      barberName: 'কারিগর সুজন',
      totalAmount: 380,
      paidAmount: 380,
      dueAmount: 0,
      timestamp: getDateOffset(-3, 17, 10),
      paymentMethod: 'বিকাশ',
      notes: ''
    }
  ];

  // Default Monthly Income Historical Data: 10 Past Completed Months + 1 Running Active Month
  const DEFAULT_MONTHLY_HISTORY = [
    {
      id: 'month_current',
      key: '2026-10',
      monthNumber: 0,
      name: 'অক্টোবর ২০২৬',
      label: 'চলতি মাস (অক্টোবর ২০২৬)',
      periodTitle: 'চলতি রানিং মাস (অক্টোবর ২০২৬)',
      isCurrent: true,
      baseIncome: 38500,
      totalClients: 248,
      avgDaily: 1420,
      badgeText: '● লাইভ রানিং',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      note: 'আজকের বিক্রিকৃত টাকাসহ লাইভ আপডেট'
    },
    {
      id: 'month_past_1',
      key: '2026-09',
      monthNumber: 1,
      name: 'সেপ্টেম্বর ২০২৬',
      label: '১ মাস আগে (সেপ্টেম্বর ২০২৬)',
      periodTitle: 'গত মাস: সেপ্টেম্বর ২০২৬ (১ মাস আগে)',
      isCurrent: false,
      baseIncome: 42350,
      totalClients: 274,
      avgDaily: 1411,
      badgeText: 'গত মাস ক্লোজড',
      badgeClass: 'bg-goldPrimary/20 text-goldLight border-goldPrimary/30',
      note: 'গত ৩০ দিনের চূড়ান্ত সর্বমোট আয়'
    },
    {
      id: 'month_past_2',
      key: '2026-08',
      monthNumber: 2,
      name: 'আগস্ট ২০২৬',
      label: '২ মাস আগে (আগস্ট ২০২৬)',
      periodTitle: 'আগস্ট ২০২৬ (২ মাস আগে সমাপ্ত)',
      isCurrent: false,
      baseIncome: 39800,
      totalClients: 256,
      avgDaily: 1284,
      badgeText: '২ মাস আগে ক্লোজড',
      badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      note: 'পূর্ববর্তী ৩১ দিনের সমাপ্ত আয় খাতা'
    },
    {
      id: 'month_past_3',
      key: '2026-07',
      monthNumber: 3,
      name: 'জুলাই ২০২৬',
      label: '৩ মাস আগে (জুলাই ২০২৬)',
      periodTitle: 'জুলাই ২০২৬ (৩ মাস আগে সমাপ্ত)',
      isCurrent: false,
      baseIncome: 36400,
      totalClients: 235,
      avgDaily: 1174,
      badgeText: '৩ মাস আগে ক্লোজড',
      badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      note: 'পূর্ববর্তী ৩১ দিনের সংরক্ষিত রেকর্ড'
    },
    {
      id: 'month_past_4',
      key: '2026-06',
      monthNumber: 4,
      name: 'জুন ২০২৬',
      label: '৪ মাস আগে (জুন ২০২৬)',
      periodTitle: 'জুন ২০২৬ (৪ মাস আগে সমাপ্ত)',
      isCurrent: false,
      baseIncome: 41200,
      totalClients: 262,
      avgDaily: 1373,
      badgeText: '৪ মাস আগে ক্লোজড',
      badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      note: 'পূর্ববর্তী ৩০ দিনের সমাপ্ত আয় খাতা'
    },
    {
      id: 'month_past_5',
      key: '2026-05',
      monthNumber: 5,
      name: 'মে ২০২৬',
      label: '৫ মাস আগে (মে ২০২৬)',
      periodTitle: 'মে ২০২৬ (৫ মাস আগে - ঈদ মৌসুম)',
      isCurrent: false,
      baseIncome: 45600,
      totalClients: 295,
      avgDaily: 1470,
      badgeText: '৫ মাস আগে (ঈদ স্পেশাল)',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      note: 'ঈদুল আজহা মৌসুমের বাম্পার সেলস'
    },
    {
      id: 'month_past_6',
      key: '2026-04',
      monthNumber: 6,
      name: 'এপ্রিল ২০২৬',
      label: '৬ মাস আগে (এপ্রিল ২০২৬)',
      periodTitle: 'এপ্রিল ২০২৬ (৬ মাস আগে সমাপ্ত)',
      isCurrent: false,
      baseIncome: 38200,
      totalClients: 245,
      avgDaily: 1273,
      badgeText: '৬ মাস আগে ক্লোজড',
      badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      note: 'পূর্ববর্তী ৩০ দিনের সংরক্ষিত রেকর্ড'
    },
    {
      id: 'month_past_7',
      key: '2026-03',
      monthNumber: 7,
      name: 'মার্চ ২০২৬',
      label: '৭ মাস আগে (মার্চ ২০২৬)',
      periodTitle: 'মার্চ ২০২৬ (৭ মাস আগে সমাপ্ত)',
      isCurrent: false,
      baseIncome: 35900,
      totalClients: 228,
      avgDaily: 1158,
      badgeText: '৭ মাস আগে ক্লোজড',
      badgeClass: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      note: 'পূর্ববর্তী ৩১ দিনের সমাপ্ত আয় খাতা'
    },
    {
      id: 'month_past_8',
      key: '2026-02',
      monthNumber: 8,
      name: 'ফেব্রুয়ারি ২০২৬',
      label: '৮ মাস আগে (ফেব্রুয়ারি ২০২৬)',
      periodTitle: 'ফেব্রুয়ারি ২০২৬ (৮ মাস আগে সমাপ্ত)',
      isCurrent: false,
      baseIncome: 33400,
      totalClients: 212,
      avgDaily: 1193,
      badgeText: '৮ মাস আগে ক্লোজড',
      badgeClass: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      note: 'পূর্ববর্তী ২৮ দিনের সংরক্ষিত রেকর্ড'
    },
    {
      id: 'month_past_9',
      key: '2026-01',
      monthNumber: 9,
      name: 'জানুয়ারি ২০২৬',
      label: '৯ মাস আগে (জানুয়ারি ২০২৬)',
      periodTitle: 'জানুয়ারি ২০২৬ (৯ মাস আগে সমাপ্ত)',
      isCurrent: false,
      baseIncome: 36100,
      totalClients: 231,
      avgDaily: 1164,
      badgeText: '৯ মাস আগে ক্লোজড',
      badgeClass: 'bg-blue-600/20 text-blue-300 border-blue-600/30',
      note: 'পূর্ববর্তী ৩১ দিনের শীতকালীন গ্রুমিং'
    },
    {
      id: 'month_past_10',
      key: '2025-12',
      monthNumber: 10,
      name: 'ডিসেম্বর ২০২৫',
      label: '১০ মাস আগে (ডিসেম্বর ২০২৫)',
      periodTitle: 'ডিসেম্বর ২০২৫ (১০ মাস আগে সমাপ্ত)',
      isCurrent: false,
      baseIncome: 37850,
      totalClients: 244,
      avgDaily: 1220,
      badgeText: '১০ মাস আগে ক্লোজড',
      badgeClass: 'bg-emerald-600/20 text-emerald-300 border-emerald-600/30',
      note: 'বিগত বছরের সমাপ্ত চূড়ান্ত খাতা'
    }
  ];

  function getDateOffset(daysOffset, hours = 12, mins = 0) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    d.setHours(hours, mins, 0, 0);
    return d.toISOString();
  }

  // Global Date Anchors
  const globalTodayDateObj = new Date();
  const globalYyyy = globalTodayDateObj.getFullYear();
  const globalMm = String(globalTodayDateObj.getMonth() + 1).padStart(2, '0');
  const globalDd = String(globalTodayDateObj.getDate()).padStart(2, '0');
  const localTodayStr = `${globalYyyy}-${globalMm}-${globalDd}`;

  // Default Initial Seed Data for Advance Bookings (৳30 Advance Fee System)
  const DEFAULT_BOOKINGS = [
    {
      id: 'book_101',
      tokenNo: 'BK-101',
      customerName: 'মেহেদী হাসান (ব্যাংকার)',
      customerPhone: '01912445566',
      date: localTodayStr,
      timeSlot: '11:30 AM',
      barberName: 'ওস্তাদ মো. আবুল বাশার (মালিক)',
      chairNo: 'চেয়ার ১',
      services: [
        { name: 'চুল কাটা', duration: 30, price: 150 },
        { name: 'দাড়ি শেভ / ট্রিম', duration: 15, price: 80 },
        { name: 'ফেস ওয়াশ ও স্ক্রাব', duration: 15, price: 100 }
      ],
      totalDuration: 60,
      totalEstimatedAmount: 330, // মোট বিল ৩৩০৳
      advancePaid: 30, // অগ্রিম জমা ৩০৳
      payableAmount: 300, // আর পাওয়া যাবে (Payable): ৩০০৳
      advanceMethod: 'বিকাশ (01734018155)',
      trxId: 'BK78X902',
      status: 'confirmed',
      createdAt: getDateOffset(0, 8, 30)
    },
    {
      id: 'book_102',
      tokenNo: 'BK-102',
      customerName: 'সাকিব আল মাহমুদ',
      customerPhone: '01799887766',
      date: localTodayStr,
      timeSlot: '05:00 PM',
      barberName: 'কারিগর সুজন',
      chairNo: 'চেয়ার ২',
      services: [
        { name: 'চুল কাটা', duration: 30, price: 150 },
        { name: 'হার্বাল ফেসিয়াল', duration: 35, price: 300 }
      ],
      totalDuration: 65,
      totalEstimatedAmount: 450,
      advancePaid: 30,
      payableAmount: 420,
      advanceMethod: 'নগদ (01734018155)',
      trxId: 'NG44K118',
      status: 'confirmed',
      createdAt: getDateOffset(0, 9, 15)
    },
    {
      id: 'book_103',
      tokenNo: 'BK-103',
      customerName: 'রাশেদুল ইসলাম (অনলাইন রিকোয়েস্ট)',
      customerPhone: '01711998877',
      date: getDateOffset(1).slice(0, 10),
      timeSlot: '12:15 PM',
      barberName: 'ওস্তাদ মো. আবুল বাশার (মালিক)',
      chairNo: 'চেয়ার ১',
      services: [
        { name: 'চুল কাটা', duration: 30, price: 150 },
        { name: 'দাড়ি শেভ / ট্রিম', duration: 15, price: 80 }
      ],
      totalDuration: 45,
      totalEstimatedAmount: 230,
      advancePaid: 30,
      payableAmount: 200,
      advanceMethod: 'বিকাশ (01734018155)',
      trxId: 'BK99Q331',
      status: 'pending', // নতুন বুকিং রিকোয়েস্ট (Pending)
      createdAt: getDateOffset(0, 10, 0)
    }
  ];

  // Load from Storage or Seed
  let salon = JSON.parse(localStorage.getItem(STORAGE_KEYS.SALON)) || DEFAULT_SALON;
  let customers = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) || DEFAULT_CUSTOMERS;
  let sales = JSON.parse(localStorage.getItem(STORAGE_KEYS.SALES)) || DEFAULT_SALES;
  let monthlyHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.MONTHLY_HISTORY)) || DEFAULT_MONTHLY_HISTORY;
  let bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS)) || DEFAULT_BOOKINGS;

  // Auto-upgrade legacy bookings with payableAmount and correct statuses
  bookings = bookings.map(b => {
    const total = Number(b.totalEstimatedAmount || 200);
    const advance = Number(b.advancePaid || 30);
    return {
      ...b,
      totalEstimatedAmount: total,
      advancePaid: advance,
      payableAmount: Number(b.payableAmount !== undefined ? b.payableAmount : Math.max(0, total - advance)),
      status: b.status || 'confirmed'
    };
  });
  let tenants = JSON.parse(localStorage.getItem(STORAGE_KEYS.TENANTS)) || DEFAULT_TENANTS;
  let activeTenantId = localStorage.getItem(STORAGE_KEYS.ACTIVE_TENANT) || 'tenant_royal';

  // Auto-upgrade monthly history if missing the full 10 past months
  if (!Array.isArray(monthlyHistory) || monthlyHistory.length < 11) {
    monthlyHistory = DEFAULT_MONTHLY_HISTORY;
    localStorage.setItem(STORAGE_KEYS.MONTHLY_HISTORY, JSON.stringify(monthlyHistory));
  }

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
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(tenants));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TENANT, activeTenantId);
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

  // Check if a sale date is within the current running week (up to today)
  function isWithinRunningWeek(isoOrDate) {
    const d = new Date(isoOrDate);
    if (isNaN(d.getTime())) return false;
    const now = new Date();
    // Monday as start of running week (common for business rosters)
    const day = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday, 0, 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return d >= startOfWeek && d <= endOfToday;
  }

  // Check if a sale date is within the current running month (October 2026)
  function isWithinRunningMonth(isoOrDate) {
    const d = new Date(isoOrDate);
    if (isNaN(d.getTime())) return false;
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
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

  // Dashboard KPIs (Today, Running Week, Running Month, Last Month, Dues, Clients)
  function renderDashboardKPIs() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Due Customers Count
    const dueCount = customers.filter(c => {
      const status = getReminderStatus(c);
      return status.type === 'overdue' || status.type === 'due-today';
    }).length;

    // 2. Today's Live Sales (Running Day)
    const todaySales = sales.filter(s => {
      const saleDate = new Date(s.timestamp);
      saleDate.setHours(0, 0, 0, 0);
      return saleDate.getTime() === today.getTime();
    });
    const todayTotal = todaySales.reduce((sum, s) => sum + Number(s.paidAmount || s.totalAmount || s.amount || 0), 0);
    const todayClients = todaySales.length;

    // 3. Running Week's Sales
    const weekSales = sales.filter(s => isWithinRunningWeek(s.timestamp));
    const weekTotal = weekSales.reduce((sum, s) => sum + Number(s.paidAmount || s.totalAmount || s.amount || 0), 0);
    const weekClients = weekSales.length;

    // 4. Running Month's Sales (Current Month: October 2026)
    const currentMonth = monthlyHistory.find(m => m.id === 'month_current') || DEFAULT_MONTHLY_HISTORY[0];
    const lastMonth = monthlyHistory.find(m => m.id === 'month_past_1') || DEFAULT_MONTHLY_HISTORY[1];

    const currentMonthTotal = (currentMonth.baseIncome || 38500) + todayTotal;
    const currentMonthClients = (currentMonth.totalClients || 248) + todayClients;

    // Update Elements
    const kpiTodaySalesEl = document.getElementById('kpiTodaySales');
    const kpiTodaySub = document.getElementById('kpiTodaySub');
    const kpiWeekSalesEl = document.getElementById('kpiWeekSales');
    const kpiWeekSub = document.getElementById('kpiWeekSub');
    const kpiMonthSalesEl = document.getElementById('kpiMonthSales');
    const kpiMonthLabel = document.getElementById('kpiMonthLabel');
    const kpiLastMonthSalesEl = document.getElementById('kpiLastMonthSales');
    const kpiLastMonthLabel = document.getElementById('kpiLastMonthLabel');
    const kpiDueEl = document.getElementById('kpiDueCount');
    const kpiTotalClientsEl = document.getElementById('kpiTotalClients');

    if (kpiTodaySalesEl) kpiTodaySalesEl.textContent = formatTaka(todayTotal);
    if (kpiTodaySub) {
      kpiTodaySub.innerHTML = `<i class="fa-solid fa-arrow-trend-up text-[10px]"></i> <span>রানিং দিন: <strong>${todayClients} জন</strong> কাস্টমার</span>`;
    }

    if (kpiWeekSalesEl) kpiWeekSalesEl.textContent = formatTaka(weekTotal);
    if (kpiWeekSub) {
      kpiWeekSub.innerHTML = `<i class="fa-solid fa-calendar-week text-[10px]"></i> <span>রানিং সপ্তাহ: <strong>${weekClients} জন</strong> কাস্টমার</span>`;
    }

    if (kpiMonthSalesEl) kpiMonthSalesEl.textContent = formatTaka(currentMonthTotal);
    if (kpiMonthLabel) {
      kpiMonthLabel.innerHTML = `<i class="fa-solid fa-calendar-day text-[10px]"></i> <span>রানিং মাস (${currentMonth.name}) • <strong>${currentMonthClients} জন</strong></span>`;
    }

    if (kpiLastMonthSalesEl) kpiLastMonthSalesEl.textContent = formatTaka(lastMonth.baseIncome);
    if (kpiLastMonthLabel) {
      kpiLastMonthLabel.innerHTML = `<i class="fa-solid fa-history text-[10px]"></i> <span>গত মাস (${lastMonth.name}) • <strong>${lastMonth.totalClients} জন</strong> (ক্লোজড)</span>`;
    }

    if (kpiDueEl) kpiDueEl.textContent = dueCount + ' জন';
    if (kpiTotalClientsEl) kpiTotalClientsEl.textContent = customers.length + ' জন';

    // Update notification badges
    document.querySelectorAll('.reminder-badge-count').forEach(el => {
      el.textContent = dueCount;
      el.style.display = dueCount > 0 ? 'inline-flex' : 'none';
    });

    // Render monthly history cards and full 10-month comparison table
    renderMonthlyHistoryCards(todayTotal);
    renderTenMonthsSummaryTable();
  }

  // Render Monthly Income Comparison Cards (Dynamic for all 10 Past Months + Running Month)
  function renderMonthlyHistoryCards(todaySalesTotal = 0) {
    const container = document.getElementById('monthlyHistoryCardsContainer');
    if (!container) return;

    const currentMonth = monthlyHistory.find(m => m.id === 'month_current') || DEFAULT_MONTHLY_HISTORY[0];
    const currentTotal = (currentMonth.baseIncome || 38500) + todaySalesTotal;
    const currentClients = (currentMonth.totalClients || 248) + (sales.length > 0 ? 1 : 0);

    // Show 4 primary featured cards: Current Month + Past 3 Months
    const featuredMonths = [
      {
        ...currentMonth,
        calculatedIncome: currentTotal,
        calculatedClients: currentClients,
        calculatedDailyAvg: Math.round(currentTotal / 25),
        badge: '● লাইভ রানিং',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      },
      ...monthlyHistory.filter(m => !m.isCurrent).slice(0, 3).map(m => ({
        ...m,
        calculatedIncome: m.baseIncome,
        calculatedClients: m.totalClients,
        calculatedDailyAvg: m.avgDaily,
        badge: m.badgeText || 'সমাপ্ত ক্লোজড',
        badgeColor: m.badgeClass || 'bg-goldPrimary/20 text-goldLight border-goldPrimary/30'
      }))
    ];

    container.innerHTML = featuredMonths.map(c => `
      <div class="monthly-history-card ${c.isCurrent ? 'is-current' : ''}" data-month-card-id="${c.id}">
        <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-subtle">
          <span class="text-xs font-bold text-white font-bangla">${c.label || c.name}</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full border font-mono font-medium ${c.badgeColor}">
            ${c.badge}
          </span>
        </div>

        <div class="space-y-0.5 mb-2.5">
          <div class="text-[11px] text-zinc-400">সর্বমোট ইনকাম / সেল:</div>
          <div class="font-outfit font-extrabold text-xl ${c.isCurrent ? 'text-goldLight' : 'text-white'}">
            ${formatTaka(c.calculatedIncome)}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-2 border-t border-subtle/50 text-[11px]">
          <div>
            <span class="text-zinc-500 block">কাস্টমার সংখ্যা</span>
            <span class="text-zinc-300 font-semibold font-outfit">${c.calculatedClients} জন</span>
          </div>
          <div>
            <span class="text-zinc-500 block">গড় দৈনিক আয়</span>
            <span class="text-emerald-400 font-semibold font-outfit">${formatTaka(c.calculatedDailyAvg)}</span>
          </div>
        </div>

        <div class="text-[10px] text-zinc-400 mt-2.5 bg-black/20 px-2 py-1 rounded flex items-center gap-1">
          <i class="fa-solid fa-circle-check text-[9px] text-goldPrimary"></i>
          <span class="truncate">${c.note || 'মাসের সংরক্ষিত হিসাব'}</span>
        </div>
      </div>
    `).join('');

    // Wire Monthly Comparison Selector (All 10 Months)
    const monthSelect = document.getElementById('monthlyComparisonSelect');
    if (monthSelect) {
      monthSelect.onchange = (e) => {
        const val = e.target.value;
        const selectedMonth = monthlyHistory.find(m => m.id === val);
        if (selectedMonth) {
          showToast(`✓ ${selectedMonth.name}: মোট আয় ${formatTaka(selectedMonth.isCurrent ? currentTotal : selectedMonth.baseIncome)}, কাস্টমার ${selectedMonth.totalClients} জন`);
          
          // If in table, highlight row
          const tableContainer = document.getElementById('tenMonthsSummaryTableContainer');
          if (tableContainer) {
            tableContainer.querySelectorAll('tr').forEach(r => r.classList.remove('bg-goldPrimary/10'));
            const row = tableContainer.querySelector(`[data-month-row-id="${val}"]`);
            if (row) {
              row.classList.add('bg-goldPrimary/10');
              row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }
        }
      };
    }
  }

  // Render Full 10-Month Performance Table
  function renderTenMonthsSummaryTable() {
    const container = document.getElementById('tenMonthsSummaryTableContainer');
    if (!container) return;

    const past10Months = monthlyHistory.filter(m => !m.isCurrent);
    const total10MonthsIncome = past10Months.reduce((sum, m) => sum + m.baseIncome, 0);
    const total10MonthsClients = past10Months.reduce((sum, m) => sum + m.totalClients, 0);

    container.innerHTML = `
      <div class="rounded-xl border border-subtle bg-surfaceElevated p-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2.5 border-b border-subtle">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-goldPrimary/10 flex items-center justify-center text-goldLight text-xs">
              <i class="fa-solid fa-book-bookmark"></i>
            </div>
            <div>
              <h4 class="text-xs sm:text-sm font-bold text-white font-bangla">বিগত ১০ মাসের ধারাবাহিক সমাপ্ত খাতা (10 Completed Months)</h4>
              <p class="text-[11px] text-zinc-400">প্রতিটি মাসের চূড়ান্ত সেলস, গ্রাহক সংখ্যা ও দৈনিক গড় হিসাব</p>
            </div>
          </div>
          <div class="flex items-center gap-3 text-xs font-mono">
            <span class="text-zinc-400">১০ মাসের মোট আয়: <strong class="text-goldLight">${formatTaka(total10MonthsIncome)}</strong></span>
            <span class="text-zinc-500">•</span>
            <span class="text-zinc-400">মোট কাস্টমার: <strong class="text-white">${total10MonthsClients} জন</strong></span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-subtle text-zinc-400 font-semibold">
                <th class="py-2.5 px-3">ক্রমিক ও মাস</th>
                <th class="py-2.5 px-3">সর্বমোট আয় (বিক্রয়)</th>
                <th class="py-2.5 px-3">মোট কাস্টমার</th>
                <th class="py-2.5 px-3">দৈনিক গড় ইনকাম</th>
                <th class="py-2.5 px-3 text-right">মাসের স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-subtle/40">
              ${past10Months.map((m, idx) => `
                <tr class="hover:bg-white/5 transition-colors cursor-pointer" data-month-row-id="${m.id}">
                  <td class="py-2.5 px-3">
                    <div class="flex items-center gap-2">
                      <span class="w-5 h-5 rounded-full bg-white/5 text-[10px] font-mono text-zinc-400 flex items-center justify-center">${idx + 1}</span>
                      <div>
                        <div class="font-bold text-white">${m.name}</div>
                        <div class="text-[10px] text-zinc-500">${m.periodTitle}</div>
                      </div>
                    </div>
                  </td>
                  <td class="py-2.5 px-3">
                    <span class="font-outfit font-bold text-goldLight text-sm">${formatTaka(m.baseIncome)}</span>
                  </td>
                  <td class="py-2.5 px-3">
                    <span class="font-outfit text-white font-semibold">${m.totalClients} জন</span>
                  </td>
                  <td class="py-2.5 px-3">
                    <span class="font-outfit text-emerald-400 font-medium">${formatTaka(m.avgDaily)}</span>
                  </td>
                  <td class="py-2.5 px-3 text-right">
                    <span class="text-[10px] px-2 py-0.5 rounded-full border font-mono font-medium ${m.badgeClass || 'bg-white/5 text-zinc-400'}">
                      ${m.badgeText || 'সমাপ্ত'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Row click listener to sync with selector
    container.querySelectorAll('[data-month-row-id]').forEach(row => {
      row.addEventListener('click', () => {
        const id = row.getAttribute('data-month-row-id');
        const sel = document.getElementById('monthlyComparisonSelect');
        if (sel) {
          sel.value = id;
          sel.dispatchEvent(new Event('change'));
        }
      });
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

    // Responsive Desktop Table & Mobile Cards (Customer Name & Phone FIRST, Date & Time SECOND)
    listContainer.innerHTML = `
      <!-- Desktop Table -->
      <div class="hidden md:block sales-table-wrapper">
        <table class="sales-table">
          <thead>
            <tr>
              <th>কাস্টমারের নাম ও মোবাইল</th>
              <th>তারিখ, মাস ও সময়</th>
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
                  <div class="font-bold text-white text-sm flex items-center gap-1.5">
                    <span>${s.customerName}</span>
                  </div>
                  ${s.customerPhone ? `<div class="text-xs text-goldLight font-mono mt-0.5"><i class="fa-solid fa-phone text-[10px] text-zinc-500 mr-1"></i>${s.customerPhone}</div>` : '<div class="text-[10px] text-zinc-500 mt-0.5">ওয়াক-ইন গ্রাহক</div>'}
                </td>
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

      <!-- Mobile Cards: Customer Name & Phone FIRST, Date & Time SECOND -->
      <div class="md:hidden mobile-sales-cards">
        ${sortedToday.map(s => `
          <div class="sale-card-single">
            <!-- 1. Customer Name and Phone Number (সবার আগে) -->
            <div class="p-2.5 rounded-lg bg-surfaceElevated border border-subtle mb-2">
              <div class="flex items-center justify-between">
                <h4 class="font-bold text-white text-base">${s.customerName}</h4>
                <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold ${s.paymentMethod === 'ক্যাশ' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'}">${s.paymentMethod}</span>
              </div>
              <div class="text-xs text-goldLight font-mono mt-0.5 flex items-center gap-1">
                <i class="fa-solid fa-phone text-[10px] text-zinc-400"></i>
                <span>${s.customerPhone || 'সাধারণ / ওয়াক-ইন গ্রাহক'}</span>
              </div>
            </div>

            <!-- 2. Date, Month, Year & Time (কাস্টমারের নাম ও নাম্বারের পরে) -->
            <div class="p-2 rounded-lg bg-black/20 border border-subtle mb-2.5 flex items-center justify-between flex-wrap gap-1.5 text-xs">
              <div class="flex items-center gap-1.5 font-bold text-zinc-200">
                <i class="fa-regular fa-calendar-days text-goldPrimary text-xs"></i>
                <span>তারিখ: ${formatBengaliDate(s.timestamp, 'dateMonthYear')}</span>
              </div>
              <div class="font-mono text-goldLight flex items-center gap-1">
                <i class="fa-regular fa-clock text-zinc-400 text-[10px]"></i>
                <span>সময়: ${formatBengaliDate(s.timestamp, 'timeOnly')}</span>
              </div>
            </div>

            <div class="flex items-center justify-between pb-2 border-b border-subtle gap-2">
              <span class="text-[11px] text-zinc-400 font-mono">মেমো নং: #${s.memoNo || 'SL-100'}</span>
              <div class="text-right">
                <span class="font-outfit font-bold text-emeraldLight text-base">+${formatTaka(s.paidAmount || s.totalAmount || s.amount)}</span>
                ${s.dueAmount > 0 ? `<div class="text-[10px] text-red-400 font-bold">বকেয়া: ${formatTaka(s.dueAmount)}</div>` : ''}
              </div>
            </div>

            <div class="flex items-center justify-between pt-2">
              <div>
                <div class="text-xs text-zinc-200 font-medium">✂️ ${s.serviceName}</div>
                <div class="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
                  <i class="fa-solid fa-user-gear text-[10px] text-blue-400"></i>
                  <span>${s.barberName || salon.ownerName}</span>
                </div>
              </div>

              <div class="flex items-center gap-1.5">
                <button class="btn-view-receipt text-xs bg-goldPrimary/10 hover:bg-goldPrimary/20 text-goldLight px-3 py-1.5 rounded-lg border border-goldPrimary/30" data-receipt-id="${s.id}">
                  <i class="fa-solid fa-receipt text-xs mr-1"></i> রশিদ
                </button>
                <button class="btn-delete-sale text-[11px] text-zinc-500 hover:text-red-400 p-1.5 rounded" data-delete-sale-id="${s.id}" title="মুছুন">
                  <i class="fa-solid fa-trash-can text-xs"></i>
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

    let filtered = [...sales];
    let headingText = 'আজকের বিস্তারিত ক্যাশ বিবরণী';
    let isPastMonthScope = false;
    let pastMonthObj = null;

    if (currentLedgerPeriod === 'today') {
      filtered = filtered.filter(s => {
        const d = new Date(s.timestamp);
        return isSameDay(d, now);
      });
      headingText = `আজকের রানিং দিন (${formatBengaliDate(now, 'dateMonthYear')})`;
    } else if (currentLedgerPeriod === 'tomorrow') {
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      filtered = filtered.filter(s => isSameDay(new Date(s.timestamp), tomorrow));
      headingText = `আগামীকাল (${formatBengaliDate(tomorrow, 'dateMonthYear')})-এর অগ্রিম সেল ও শিডিউল`;
    } else if (currentLedgerPeriod === 'next3') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 23, 59, 59);
      filtered = filtered.filter(s => {
        const t = new Date(s.timestamp).getTime();
        return t >= start.getTime() && t <= end.getTime();
      });
      headingText = 'পরশু ও আগামী ৩ দিনের বুকিং শিডিউল তালিকা';
    } else if (currentLedgerPeriod === 'next_week') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59, 59);
      filtered = filtered.filter(s => {
        const t = new Date(s.timestamp).getTime();
        return t >= start.getTime() && t <= end.getTime();
      });
      headingText = 'আগামী ৭ দিনের বুকিং ও সেল শিডিউল';
    } else if (currentLedgerPeriod === 'running_month' || currentLedgerPeriod === 'month') {
      filtered = filtered.filter(s => isWithinRunningMonth(s.timestamp));
      headingText = 'চলতি মাস (অক্টোবর ২০২৬)-এর বিক্রয় রেকর্ড';
    } else if (currentLedgerPeriod === 'next_month') {
      filtered = filtered.filter(s => {
        const d = new Date(s.timestamp);
        return d.getMonth() === 10 && d.getFullYear() === 2026;
      });
      headingText = 'আগামী মাস: নভেম্বর ২০২৬-এর শিডিউল ও বুকিং খাতা';
    } else if (currentLedgerPeriod === 'month_dec') {
      filtered = filtered.filter(s => {
        const d = new Date(s.timestamp);
        return d.getMonth() === 11 && d.getFullYear() === 2026;
      });
      headingText = 'পরবর্তী মাস: ডিসেম্বর ২০২৬-এর শিডিউল ও বুকিং খাতা';
    } else if (currentLedgerPeriod === 'month_jan27') {
      filtered = filtered.filter(s => {
        const d = new Date(s.timestamp);
        return d.getMonth() === 0 && d.getFullYear() === 2027;
      });
      headingText = 'নতুন বছর: জানুয়ারি ২০২৭-এর শিডিউল ও বুকিং';
    } else if (currentLedgerPeriod === 'running_week' || currentLedgerPeriod === 'week') {
      filtered = filtered.filter(s => isWithinRunningWeek(s.timestamp));
      headingText = 'চলতি রানিং সপ্তাহের বিক্রয় বিবরণী';
    } else if (currentLedgerPeriod === 'past_10_months') {
      isPastMonthScope = true;
      headingText = 'বিগত ১০ মাসের ধারাবাহিক সমাপ্ত খাতা (10 Months Ledger)';
    } else if (currentLedgerPeriod.startsWith('month_past_')) {
      isPastMonthScope = true;
      pastMonthObj = monthlyHistory.find(m => m.id === currentLedgerPeriod);
      headingText = pastMonthObj ? `${pastMonthObj.name}-এর সমাপ্ত মাসিক খাতা` : 'অতীত মাসের হিসাব';
    } else if (currentLedgerPeriod === 'all') {
      headingText = 'সকল বিক্রয় ও শিডিউল রেকর্ড';
    } else if (currentLedgerPeriod.includes('-')) {
      const targetDate = new Date(currentLedgerPeriod + 'T00:00:00');
      filtered = filtered.filter(s => isSameDay(new Date(s.timestamp), targetDate));
      headingText = `${formatBengaliDate(targetDate, 'dateMonthYear')}-এর সেল ও শিডিউল বিবরণী`;
    }

    // Special view for Past 10 Months & Individual Past Months
    if (isPastMonthScope) {
      if (currentLedgerPeriod === 'past_10_months') {
        const past10 = monthlyHistory.filter(m => !m.isCurrent);
        const totalInc = past10.reduce((sum, m) => sum + m.baseIncome, 0);
        const totalCli = past10.reduce((sum, m) => sum + m.totalClients, 0);

        if (totalEl) totalEl.textContent = formatTaka(totalInc);
        if (clientsEl) clientsEl.textContent = totalCli + ' জন';
        if (cashEl) cashEl.textContent = formatTaka(Math.round(totalInc * 0.72));
        if (digitalEl) digitalEl.textContent = formatTaka(Math.round(totalInc * 0.28));
        if (headingEl) headingEl.textContent = headingText;
        if (countEl) countEl.textContent = '১০ টি সমাপ্ত মাস';

        if (!container) return;

        container.innerHTML = `
          <div class="space-y-4">
            <div class="p-4 rounded-xl bg-goldPrimary/10 border border-goldPrimary/30 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h5 class="font-bold text-white text-sm">বিগত ১০ মাসের সমন্বিত হিসাব খাতা</h5>
                <p class="text-xs text-zinc-400 mt-0.5">যেসব মাস সমাপ্ত হয়ে গেছে শুধুমাত্র তাদের চূড়ান্ত হিসাব এখানে সংকলিত</p>
              </div>
              <span class="text-xs px-3 py-1 rounded-full bg-surfaceElevated border border-goldPrimary/40 text-goldLight font-mono">
                ১০ মাস ক্লোজড
              </span>
            </div>

            <div class="overflow-x-auto rounded-xl border border-subtle bg-surface">
              <table class="sales-table">
                <thead>
                  <tr>
                    <th>ক্রম ও সমাপ্ত মাস</th>
                    <th>মোট আয় (বিক্রয়)</th>
                    <th>মোট কাস্টমার</th>
                    <th>দৈনিক গড় আয়</th>
                    <th class="text-right">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody>
                  ${past10.map((m, idx) => `
                    <tr>
                      <td>
                        <div class="flex items-center gap-2">
                          <span class="w-6 h-6 rounded-full bg-white/5 border border-subtle text-xs font-mono font-bold text-goldLight flex items-center justify-center">${idx + 1}</span>
                          <div>
                            <span class="font-bold text-white text-sm block">${m.name}</span>
                            <span class="text-[10px] text-zinc-500 font-mono">${m.periodTitle}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="font-outfit font-bold text-goldLight text-base">${formatTaka(m.baseIncome)}</span>
                      </td>
                      <td>
                        <span class="font-outfit text-white font-semibold">${m.totalClients} জন</span>
                      </td>
                      <td>
                        <span class="font-outfit text-emerald-400 font-medium">${formatTaka(m.avgDaily)}</span>
                      </td>
                      <td class="text-right">
                        <span class="text-[10px] px-2.5 py-1 rounded-full border font-mono font-medium ${m.badgeClass || 'bg-white/5 text-zinc-400'}">
                          ${m.badgeText || 'সমাপ্ত ক্লোজড'}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
        return;
      } else if (pastMonthObj) {
        if (totalEl) totalEl.textContent = formatTaka(pastMonthObj.baseIncome);
        if (clientsEl) clientsEl.textContent = pastMonthObj.totalClients + ' জন';
        if (cashEl) cashEl.textContent = formatTaka(Math.round(pastMonthObj.baseIncome * 0.75));
        if (digitalEl) digitalEl.textContent = formatTaka(Math.round(pastMonthObj.baseIncome * 0.25));
        if (headingEl) headingEl.textContent = headingText;
        if (countEl) countEl.textContent = '১ টি সমাপ্ত মাস';

        if (!container) return;

        container.innerHTML = `
          <div class="p-6 rounded-2xl bg-surface border border-goldPrimary/30 shadow-card">
            <div class="flex items-center justify-between pb-4 border-b border-subtle mb-4">
              <div>
                <span class="text-xs font-bold text-goldLight uppercase tracking-wider block font-mono">সমাপ্ত মাসের ফাইনাল স্টেটমেন্ট</span>
                <h3 class="text-xl font-bold text-white font-bangla mt-0.5">${pastMonthObj.name}</h3>
                <p class="text-xs text-zinc-400">${pastMonthObj.periodTitle}</p>
              </div>
              <span class="px-3 py-1.5 rounded-full text-xs font-mono font-bold ${pastMonthObj.badgeClass || 'bg-white/10 text-white'}">
                ${pastMonthObj.badgeText || 'ক্লোজড রেকর্ড'}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div class="p-4 rounded-xl bg-surfaceElevated border border-subtle">
                <span class="text-xs text-zinc-400 block mb-1">এই মাসের সর্বমোট আয়:</span>
                <span class="text-2xl font-black font-outfit text-goldLight">${formatTaka(pastMonthObj.baseIncome)}</span>
              </div>
              <div class="p-4 rounded-xl bg-surfaceElevated border border-subtle">
                <span class="text-xs text-zinc-400 block mb-1">মোট সেবা গ্রহণকারী:</span>
                <span class="text-2xl font-black font-outfit text-white">${pastMonthObj.totalClients} জন</span>
              </div>
              <div class="p-4 rounded-xl bg-surfaceElevated border border-subtle">
                <span class="text-xs text-zinc-400 block mb-1">দৈনিক গড় আয়:</span>
                <span class="text-2xl font-black font-outfit text-emerald-400">${formatTaka(pastMonthObj.avgDaily)}</span>
              </div>
            </div>

            <div class="p-3.5 rounded-xl bg-black/20 border border-subtle flex items-center justify-between text-xs text-zinc-400">
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-lock text-goldLight"></i>
                <span>${pastMonthObj.note || 'এই মাসের পূর্ণাঙ্গ অডিট ও সমাপ্ত ব্যালেন্স সংরক্ষিত রয়েছে।'}</span>
              </div>
              <button class="text-xs text-goldLight hover:underline font-bold" id="viewAllTenMonthsBtn">
                সকল ১০ মাসের তালিকা দেখুন →
              </button>
            </div>
          </div>
        `;

        const viewAllBtn = document.getElementById('viewAllTenMonthsBtn');
        if (viewAllBtn) {
          viewAllBtn.onclick = () => {
            currentLedgerPeriod = 'past_10_months';
            salesFilterPills.forEach(p => {
              if (p.getAttribute('data-period') === 'past_10_months') p.classList.add('active');
              else p.classList.remove('active');
            });
            renderQuickDayNavStrip();
            renderComprehensiveSalesLedger();
          };
        }
        return;
      }
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
      const isFutureScope = (currentLedgerPeriod === 'tomorrow' || currentLedgerPeriod === 'next3' || currentLedgerPeriod === 'next_week' || currentLedgerPeriod === 'next_month' || currentLedgerPeriod === 'month_dec' || (currentLedgerPeriod.includes('-') && currentLedgerPeriod > localTodayStr));
      container.innerHTML = `
        <div class="p-8 text-center bg-surface border border-card rounded-xl text-zinc-400">
          <div class="w-12 h-12 rounded-full bg-goldPrimary/10 border border-goldPrimary/30 flex items-center justify-center text-goldLight text-xl mx-auto mb-3">
            <i class="${isFutureScope ? 'fa-regular fa-calendar-plus' : 'fa-solid fa-receipt'}"></i>
          </div>
          <p class="font-bold text-white text-base">${isFutureScope ? 'এই তারিখে এখনো কোনো অগ্রিম বুকিং বা সেল এন্ট্রি নেই' : 'এই ফিল্টারে কোনো সেল এন্ট্রি পাওয়া যায়নি।'}</p>
          <p class="text-xs text-zinc-400 mt-1 mb-4">${isFutureScope ? 'আগামী দিনের কাস্টমারের জন্য এখনই অগ্রিম সার্ভিস বা বুকিং এন্ট্রি যোগ করতে পারেন।' : 'নতুন ক্যাশ এন্ট্রি দিতে নিচের বাটনে চাপুন।'}</p>
          <button class="btn-gold-action mx-auto open-custom-sale-btn text-xs py-2 px-4" data-prefill-date="${currentLedgerPeriod}">
            <i class="fa-solid fa-plus text-xs"></i>
            <span>${isFutureScope ? 'এই তারিখে অগ্রিম এন্ট্রি দিন' : 'নতুন সেল এন্ট্রি দিন'}</span>
          </button>
        </div>
      `;

      container.querySelectorAll('.open-custom-sale-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const prefill = btn.getAttribute('data-prefill-date') || null;
          openSmartSaleModal(prefill);
        });
      });
      return;
    }

    const sorted = [...filtered].reverse();

    container.innerHTML = `
      <!-- Desktop View Table (Customer Name & Phone FIRST, Date & Time SECOND) -->
      <div class="hidden md:block sales-table-wrapper">
        <table class="sales-table">
          <thead>
            <tr>
              <th>কাস্টমারের নাম ও মোবাইল</th>
              <th>তারিখ, মাস ও সময়</th>
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
                  <div class="font-bold text-white text-sm flex items-center gap-1.5">
                    <span>${s.customerName}</span>
                  </div>
                  ${s.customerPhone ? `<div class="text-xs text-goldLight font-mono mt-0.5"><i class="fa-solid fa-phone text-[10px] text-zinc-500 mr-1"></i>${s.customerPhone}</div>` : '<div class="text-[10px] text-zinc-500 mt-0.5">ওয়াক-ইন</div>'}
                </td>
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

      <!-- Mobile View Cards: Customer Name & Phone FIRST, Date & Time SECOND -->
      <div class="md:hidden mobile-sales-cards">
        ${sorted.map(s => `
          <div class="sale-card-single">
            <!-- 1. Customer Name and Phone Number (সবার আগে) -->
            <div class="p-2.5 rounded-lg bg-surfaceElevated border border-subtle mb-2">
              <div class="flex items-center justify-between">
                <h4 class="font-bold text-white text-base">${s.customerName}</h4>
                <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold ${s.paymentMethod === 'ক্যাশ' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'}">${s.paymentMethod}</span>
              </div>
              <div class="text-xs text-goldLight font-mono mt-0.5 flex items-center gap-1">
                <i class="fa-solid fa-phone text-[10px] text-zinc-400"></i>
                <span>${s.customerPhone || 'সাধারণ / ওয়াক-ইন গ্রাহক'}</span>
              </div>
            </div>

            <!-- 2. Date, Month, Year & Time (কাস্টমারের নাম ও নাম্বারের পরে) -->
            <div class="p-2 rounded-lg bg-black/20 border border-subtle mb-2.5 flex items-center justify-between flex-wrap gap-1.5 text-xs">
              <div class="flex items-center gap-1.5 font-bold text-zinc-200">
                <i class="fa-regular fa-calendar-days text-goldPrimary text-xs"></i>
                <span>তারিখ: ${formatBengaliDate(s.timestamp, 'dateMonthYear')}</span>
              </div>
              <div class="font-mono text-goldLight flex items-center gap-1">
                <i class="fa-regular fa-clock text-zinc-400 text-[10px]"></i>
                <span>সময়: ${formatBengaliDate(s.timestamp, 'timeOnly')}</span>
              </div>
            </div>

            <div class="flex items-center justify-between pb-2 border-b border-subtle gap-2">
              <span class="text-[11px] text-zinc-400 font-mono">মেমো নং: #${s.memoNo || 'SL-100'}</span>
              <div class="text-right">
                <span class="font-outfit font-bold text-emeraldLight text-base">+${formatTaka(s.paidAmount || s.totalAmount || s.amount)}</span>
                ${s.dueAmount > 0 ? `<div class="text-[10px] text-red-400 font-bold">বকেয়া: ${formatTaka(s.dueAmount)}</div>` : ''}
              </div>
            </div>

            <div class="flex items-center justify-between pt-2">
              <div>
                <div class="text-xs text-zinc-200 font-medium">✂️ ${s.serviceName}</div>
                <div class="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
                  <i class="fa-solid fa-user-gear text-[10px] text-blue-400"></i>
                  <span>${s.barberName || salon.ownerName}</span>
                </div>
              </div>

              <div class="flex items-center gap-1.5">
                <button class="btn-view-receipt text-xs bg-goldPrimary/10 hover:bg-goldPrimary/20 text-goldLight px-3 py-1.5 rounded-lg border border-goldPrimary/30" data-receipt-id="${s.id}">
                  <i class="fa-solid fa-receipt text-xs mr-1"></i> রশিদ
                </button>
                <button class="btn-delete-sale text-[11px] text-zinc-500 hover:text-red-400 py-1" data-delete-sale-id="${s.id}" title="মুছুন">
                  <i class="fa-solid fa-trash-can text-xs"></i>
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

  // Open Receipt Modal (Customer Details FIRST, Date & Time SECOND)
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

      <!-- SECTOR 1: CUSTOMER NAME & PHONE NUMBER FIRST (সবার আগে) -->
      <div class="receipt-customer-block bg-white/5 p-2.5 rounded-lg border border-subtle mb-3">
        <div class="flex justify-between items-center text-xs mb-1">
          <span class="text-zinc-400 font-mono">কাস্টমারের নাম:</span>
          <span class="font-bold text-white text-sm">${sale.customerName}</span>
        </div>
        <div class="flex justify-between items-center text-xs">
          <span class="text-zinc-400 font-mono">মোবাইল নম্বর:</span>
          <span class="font-bold text-goldLight font-mono">${sale.customerPhone || 'সাধারণ / ওয়াক-ইন গ্রাহক'}</span>
        </div>
      </div>

      <!-- SECTOR 2: DATE, MONTH, YEAR & TIME (কাস্টমারের নাম ও নাম্বারের পরের সেক্টরে) -->
      <div class="text-xs space-y-1.5 font-mono mb-2">
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
  // MARKETING WHATSAPP BROADCAST MODAL
  // ========================================================
  let activeBroadcastTemplate = '';
  const broadcastModal = document.getElementById('broadcastModal');
  const broadcastPreview = document.getElementById('broadcastPreviewText');
  const broadcastCustSelect = document.getElementById('broadcastCustomerSelect');
  const sendBroadcastBtn = document.getElementById('sendBroadcastWhatsAppBtn');
  const copyBroadcastBtn = document.getElementById('copyBroadcastBtn');

  function openBroadcastModal(templateText) {
    if (!broadcastModal) return;
    activeBroadcastTemplate = templateText || '';

    if (broadcastCustSelect) {
      broadcastCustSelect.innerHTML = `
        <option value="">-- যেকোনো একজন কাস্টমার নির্বাচন করুন --</option>
        ${customers.map(c => `
          <option value="${c.id}" data-phone="${c.phone}" data-name="${c.name}">
            ${c.name} (${c.phone || 'নম্বর নেই'})
          </option>
        `).join('')}
      `;
    }

    updateBroadcastPreview();
    broadcastModal.classList.add('active');
  }

  function updateBroadcastPreview() {
    if (!broadcastPreview) return;
    let text = activeBroadcastTemplate;
    const selectedOpt = broadcastCustSelect ? broadcastCustSelect.selectedOptions[0] : null;
    const name = (selectedOpt && selectedOpt.value) ? selectedOpt.getAttribute('data-name') : 'সম্মানিত ভাই';
    const processedText = text.replace(/\{name\}/g, name).replace(/\{days\}/g, '২৫');
    broadcastPreview.textContent = processedText;
  }

  if (broadcastCustSelect) {
    broadcastCustSelect.addEventListener('change', updateBroadcastPreview);
  }

  if (sendBroadcastBtn) {
    sendBroadcastBtn.addEventListener('click', () => {
      const selectedOpt = broadcastCustSelect ? broadcastCustSelect.selectedOptions[0] : null;
      if (!selectedOpt || !selectedOpt.value) {
        showToast('⚠️ অনুগ্রহ করে ড্রপডাউন থেকে একজন কাস্টমার নির্বাচন করুন!');
        return;
      }
      const rawPhone = selectedOpt.getAttribute('data-phone') || '';
      let phone = rawPhone.replace(/[^0-9]/g, '');
      if (phone.startsWith('0')) phone = '880' + phone.substring(1);

      const msg = broadcastPreview ? broadcastPreview.textContent : activeBroadcastTemplate;
      if (phone) {
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
      } else {
        navigator.clipboard.writeText(msg);
        showToast('✓ কাস্টমারের ফোন নম্বর নেই, টেক্সট ক্লিপবোর্ডে কপি করা হয়েছে!');
      }
    });
  }

  if (copyBroadcastBtn) {
    copyBroadcastBtn.addEventListener('click', () => {
      const msg = broadcastPreview ? broadcastPreview.textContent : activeBroadcastTemplate;
      navigator.clipboard.writeText(msg);
      showToast('✓ মেসেজ বার্তা সফলভাবে কপি হয়েছে!');
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

  function openSmartSaleModal(prefillDateStr = null) {
    if (!customSaleModal || !customSaleForm) return;
    customSaleForm.reset();
    modalSelectedChips = [];

    // 1. Auto-populate Local Datetime (block past dates, strictly allow today and future dates)
    const now = new Date();
    let initialDate = now;
    if (prefillDateStr) {
      if (prefillDateStr === 'tomorrow') {
        initialDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      } else if (prefillDateStr.includes('-')) {
        const parsed = new Date(prefillDateStr + 'T12:00:00');
        if (!isNaN(parsed.getTime())) initialDate = parsed;
      }
    }
    const offsetMs = initialDate.getTimezoneOffset() * 60000;
    const localIso = new Date(initialDate.getTime() - offsetMs).toISOString().slice(0, 16);
    if (saleDateTimeInput) {
      saleDateTimeInput.value = localIso;
      saleDateTimeInput.min = `${localTodayStr}T00:00`; // Strictly block past dates!
      saleDateTimeInput.removeAttribute('max'); // Today and future dates/months fully allowed!
    }
    updateModalDateDisplay(initialDate);

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

  // Real-time listener for datetime input in modal (Blocking past entries, allowing today & future)
  if (saleDateTimeInput) {
    saleDateTimeInput.addEventListener('input', (e) => {
      const selectedVal = e.target.value;
      if (selectedVal) {
        const selectedDateStr = selectedVal.slice(0, 10);
        if (selectedDateStr < localTodayStr) {
          const now = new Date();
          const offsetMs = now.getTimezoneOffset() * 60000;
          saleDateTimeInput.value = new Date(now.getTime() - offsetMs).toISOString().slice(0, 16);
          showToast('⚠️ পেছনের কোনো তারিখ বা মাস সিলেক্ট করা যাবে না (ব্লকড)! শুধুমাত্র আজ এবং আগামী দিনগুলো প্রযোজ্য।');
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
    } else if (tabId === 'bookings') {
      renderBookingSlots();
      renderBookingsTable();
    } else if (tabId === 'pricing') {
      // Pricing tab view
    } else if (tabId === 'history') {
      renderMonthlyHistoryCards();
      renderTenMonthsSummaryTable();
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

  // Interactive Day & Month Navigation Strip (Past Days Blocked 🔒 • Today & Upcoming Days/Months Available)
  function renderQuickDayNavStrip() {
    const strip = document.getElementById('quickDayNavStrip');
    if (!strip) return;

    const todayDate = new Date();

    const items = [
      // 1. Past Days (Strictly Blocked / Locked)
      { type: 'day', offset: -2, label: 'গত পরশু', isPast: true },
      { type: 'day', offset: -1, label: 'গতকাল', isPast: true },
      // 2. Today (Active / Available)
      { type: 'day', offset: 0, periodId: 'today', label: '⭐ আজকের দিন', isToday: true },
      // 3. Upcoming Future Days (Fully Available & Selectable)
      { type: 'day', offset: 1, periodId: 'tomorrow', label: 'আগামীকাল', isFuture: true },
      { type: 'day', offset: 2, periodId: 'day_2', label: 'পরশু', isFuture: true },
      { type: 'day', offset: 3, periodId: 'day_3', label: 'পরশুর পর', isFuture: true },
      { type: 'day', offset: 4, periodId: 'day_4', label: '৪ দিন পর', isFuture: true },
      { type: 'day', offset: 5, periodId: 'day_5', label: '৫ দিন পর', isFuture: true },
      { type: 'day', offset: 6, periodId: 'day_6', label: '৬ দিন পর', isFuture: true },
      { type: 'day', offset: 7, periodId: 'day_7', label: '১ সপ্তাহ পর', isFuture: true },
      // 4. Upcoming Future Months (যেসব মাস আসতেছে - Fully Available & Selectable)
      { type: 'month', periodId: 'running_month', label: 'চলতি মাস (অক্টোবর)', sub: 'রানিং ২০২৬', isCurrentMonth: true },
      { type: 'month', periodId: 'next_month', label: 'আগামী মাস (নভেম্বর)', sub: 'আসন্ন ২০২৬', isFutureMonth: true },
      { type: 'month', periodId: 'month_dec', label: 'পরবর্তী মাস (ডিসেম্বর)', sub: 'আসন্ন ২০২৬', isFutureMonth: true },
      { type: 'month', periodId: 'month_jan27', label: 'নতুন বছর (জানুয়ারি)', sub: 'আসন্ন ২০২৭', isFutureMonth: true }
    ];

    strip.innerHTML = items.map(item => {
      if (item.isPast) {
        const targetDate = new Date(todayDate.getTime() + item.offset * 24 * 60 * 60 * 1000);
        const dateBengali = targetDate.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });
        return `
          <button type="button" class="day-pill locked" title="পেছনের দিন নির্বাচন করা যাবে না (ব্লক করা হয়েছে)">
            <span class="day-pill-label flex items-center gap-1 text-zinc-400">
              <i class="fa-solid fa-lock text-[10px] text-red-400"></i>
              <span>${item.label}</span>
            </span>
            <span class="day-pill-sub text-red-400/80">${dateBengali} (ব্লক)</span>
          </button>
        `;
      } else if (item.isToday) {
        const isoYMD = todayDate.toISOString().slice(0, 10);
        const dateBengali = todayDate.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });
        const isActive = (currentLedgerPeriod === 'today' || currentLedgerPeriod === isoYMD);
        return `
          <button type="button" class="day-pill ${isActive ? 'active' : ''}" data-day-period="today" data-date-str="${isoYMD}">
            <span class="day-pill-label flex items-center gap-1">
              <i class="fa-solid fa-star text-[10px]"></i>
              <span>${item.label}</span>
            </span>
            <span class="day-pill-sub">${dateBengali} (সক্রিয়)</span>
          </button>
        `;
      } else if (item.type === 'day' && item.isFuture) {
        const targetDate = new Date(todayDate.getTime() + item.offset * 24 * 60 * 60 * 1000);
        const isoYMD = targetDate.toISOString().slice(0, 10);
        const dateBengali = targetDate.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });
        const isActive = (currentLedgerPeriod === item.periodId || currentLedgerPeriod === isoYMD);
        return `
          <button type="button" class="day-pill ${isActive ? 'active' : ''}" data-day-period="${isoYMD}" data-date-str="${isoYMD}">
            <span class="day-pill-label flex items-center gap-1">
              <i class="fa-regular fa-calendar text-[10px] text-blue-400"></i>
              <span>${item.label}</span>
            </span>
            <span class="day-pill-sub text-zinc-300">${dateBengali}</span>
          </button>
        `;
      } else if (item.type === 'month') {
        const isActive = (currentLedgerPeriod === item.periodId);
        return `
          <button type="button" class="day-pill ${isActive ? 'active' : ''}" data-day-period="${item.periodId}">
            <span class="day-pill-label flex items-center gap-1">
              <i class="fa-regular fa-calendar-days text-[10px] text-purple-400"></i>
              <span>${item.label}</span>
            </span>
            <span class="day-pill-sub text-zinc-300">${item.sub}</span>
          </button>
        `;
      }
    }).join('');

    // Attach click events to locked past days
    strip.querySelectorAll('.day-pill.locked').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('⚠️ পেছনের কোনো তারিখ বা মাস নির্বাচন করা যাবে না (ব্লক করা হয়েছে)! শুধুমাত্র আজ এবং আগামী দিনগুলো প্রযোজ্য।');
      });
    });

    // Attach click events to active & future days and months
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
            if (clearDatePickerBtn) clearDatePickerBtn.classList.add('hidden');
          } else if (period.includes('-')) {
            salesLedgerDatePicker.value = period;
            if (clearDatePickerBtn) clearDatePickerBtn.classList.remove('hidden');
          } else {
            salesLedgerDatePicker.value = '';
            if (clearDatePickerBtn) clearDatePickerBtn.classList.add('hidden');
          }
        }

        renderQuickDayNavStrip();
        renderComprehensiveSalesLedger();
      });
    });
  }

  // Calendar picker for selecting a specific date (Past dates blocked, today and upcoming dates available)
  if (salesLedgerDatePicker) {
    salesLedgerDatePicker.min = localTodayStr; // Past dates strictly blocked in picker!
    salesLedgerDatePicker.removeAttribute('max'); // Today and future dates fully enabled!
    const handleDatePickerChange = (e) => {
      if (e.target.value) {
        if (e.target.value < localTodayStr) {
          e.target.value = localTodayStr;
          showToast('⚠️ পেছনের কোনো তারিখ বা মাস নির্বাচন করা যাবে না (ব্লক করা হয়েছে)! শুধুমাত্র আজ ও আগামী দিনগুলো প্রযোজ্য।');
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

  // 1. Add Customer Buttons across all tabs & headers
  document.querySelectorAll('.open-add-customer-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openAddCustomerModal();
    });
  });

  // 2. Trigger Smart Sale Modal
  document.querySelectorAll('.open-custom-sale-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openSmartSaleModal();
    });
  });

  // 3. One-Click POS Service Touchpad Buttons (Register & Dashboard)
  document.querySelectorAll('.service-btn[data-service-name]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const sName = btn.getAttribute('data-service-name');
      const sPrice = Number(btn.getAttribute('data-service-price')) || 150;
      handleQuickSale(sName, sPrice);
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

  // 4. Salon Settings Form Submission
  const salonSettingsForm = document.getElementById('salonSettingsForm');
  if (salonSettingsForm) {
    salonSettingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const sName = document.getElementById('setSalonName');
      const sOwner = document.getElementById('setOwnerName');
      const sPhone = document.getElementById('setPhone');
      const sAddress = document.getElementById('setAddress');
      const sCycle = document.getElementById('setDefaultCycle');

      if (sName && sName.value.trim()) salon.name = sName.value.trim();
      if (sOwner && sOwner.value.trim()) salon.ownerName = sOwner.value.trim();
      if (sPhone && sPhone.value.trim()) salon.phone = sPhone.value.trim();
      if (sAddress && sAddress.value.trim()) salon.address = sAddress.value.trim();
      if (sCycle && sCycle.value) salon.defaultCycleDays = Number(sCycle.value) || 25;

      persistData();
      refreshAllUI();
      showToast('✓ সেলুনের তথ্য ও সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
    });
  }

  // 5. Reset Demo Data Button
  const resetDemoDataBtn = document.getElementById('resetDemoDataBtn');
  if (resetDemoDataBtn) {
    resetDemoDataBtn.addEventListener('click', () => {
      if (confirm('আপনি কি সত্যিই ডেমো ডেটা রিসেট করতে চান? আপনার আগের এন্ট্রি রিসেট হয়ে ডিফল্ট ডাটা লোড হবে।')) {
        localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
        localStorage.removeItem(STORAGE_KEYS.SALES);
        localStorage.removeItem(STORAGE_KEYS.MONTHLY_HISTORY);
        localStorage.removeItem(STORAGE_KEYS.SALON);
        showToast('✓ ডেমো ডেটা সফলভাবে রিসেট হয়েছে! পেজ রিলোড হচ্ছে...');
        setTimeout(() => window.location.reload(), 600);
      }
    });
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

  // ========================================================
  // 6. ADVANCE BOOKINGS & LIVE CHAIR SLOTS ENGINE (৳30 FEE)
  // ========================================================
  const TIME_SLOTS = [
    { time: '10:00 AM', label: '১০:০০ AM (সকাল)' },
    { time: '10:45 AM', label: '১০:৪৫ AM (সকাল)' },
    { time: '11:30 AM', label: '১১:৩০ AM (দুপুর)' },
    { time: '12:15 PM', label: '১২:১৫ PM (দুপুর)' },
    { time: '01:00 PM', label: '০১:০০ PM (দুপুর)' },
    { time: '03:00 PM', label: '০৩:০০ PM (বিকাল)' },
    { time: '04:00 PM', label: '০৪:০০ PM (বিকাল)' },
    { time: '05:00 PM', label: '০৫:০০ PM (সন্ধ্যা)' },
    { time: '06:00 PM', label: '০৬:০০ PM (সন্ধ্যা)' },
    { time: '07:00 PM', label: '০৭:০০ PM (রাত)' },
    { time: '08:00 PM', label: '০৮:০০ PM (রাত)' },
    { time: '08:45 PM', label: '০৮:৪৫ PM (রাত)' }
  ];

  const bookingScheduleDateInput = document.getElementById('bookingScheduleDate');
  const bookingScheduleBarberSelect = document.getElementById('bookingScheduleBarber');
  const chairSlotsGrid = document.getElementById('chairSlotsGrid');
  const selectedBookingDateTitle = document.getElementById('selectedBookingDateTitle');
  const bookingSlotCountSummary = document.getElementById('bookingSlotCountSummary');
  const bookingsTableBody = document.getElementById('bookingsTableBody');
  const bookingSearchInput = document.getElementById('bookingSearchInput');

  // Initialize booking date input
  if (bookingScheduleDateInput) {
    bookingScheduleDateInput.min = localTodayStr;
    if (!bookingScheduleDateInput.value) bookingScheduleDateInput.value = localTodayStr;
    bookingScheduleDateInput.addEventListener('change', () => {
      renderBookingSlots();
    });
  }

  if (bookingScheduleBarberSelect) {
    bookingScheduleBarberSelect.addEventListener('change', () => {
      renderBookingSlots();
    });
  }

  if (bookingSearchInput) {
    bookingSearchInput.addEventListener('input', (e) => {
      renderBookingsTable(e.target.value.trim());
    });
  }

  function updateBookingBadges() {
    const activeConfirmedCount = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;
    const navBadge = document.getElementById('navBookingBadge');
    const bottomBadge = document.getElementById('bottomBookingBadge');
    if (navBadge) navBadge.textContent = activeConfirmedCount;
    if (bottomBadge) bottomBadge.textContent = activeConfirmedCount;
  }

  function renderBookingSlots(forceDate = null, forceBarber = null) {
    if (!chairSlotsGrid) return;

    const selectedDate = forceDate || (bookingScheduleDateInput ? bookingScheduleDateInput.value : localTodayStr) || localTodayStr;
    const selectedBarber = forceBarber || (bookingScheduleBarberSelect ? bookingScheduleBarberSelect.value : 'all') || 'all';

    if (selectedBookingDateTitle) {
      selectedBookingDateTitle.textContent = `${formatBengaliDate(selectedDate, 'dateMonthYear')} এর চেয়ার সিডিউল`;
    }

    let bookedCount = 0;
    let completedCount = 0;
    let availableCount = 0;

    const visibleSlotsHtml = TIME_SLOTS.map(slot => {
      // Find all bookings for this slot and date
      const slotBookings = bookings.filter(b => {
        if (!b) return false;
        const bDate = (b.date || '').trim();
        const bTime = (b.timeSlot || '').trim().toUpperCase();
        const sTime = slot.time.trim().toUpperCase();

        if (bDate !== selectedDate.trim()) return false;
        if (bTime !== sTime) return false;

        if (selectedBarber !== 'all') {
          const barberMatch = b.barberName && (
            b.barberName.trim() === selectedBarber.trim() ||
            b.barberName.includes(selectedBarber) ||
            selectedBarber.includes(b.barberName)
          );
          if (!barberMatch) return false;
        }

        return true;
      });

      // Status classification
      const activeCompleted = slotBookings.find(b => b.status === 'completed');
      const activeConfirmed = slotBookings.find(b => b.status === 'confirmed');
      const activePending = slotBookings.find(b => b.status === 'pending');

      // 1. IF COMPLETED: Omit completely from slots grid as instructed ("বিল করা হয়ে যাওয়ার পরে ওই সিটটা একেবারেই বাদ দিয়ে দিবা। showই হবে না")
      if (activeCompleted) {
        completedCount++;
        return '';
      }

      // 2. IF CONFIRMED: Show RED / BUSY / BOOKED!
      if (activeConfirmed) {
        bookedCount++;
        const b = activeConfirmed;
        const srvNames = (b.services && b.services.length) ? b.services.map(s => s.name).join(' + ') : 'সেলুন সার্ভিস';
        const totalBill = b.totalEstimatedAmount || 200;
        const advance = b.advancePaid || 30;
        const payable = b.payableAmount !== undefined ? b.payableAmount : Math.max(0, totalBill - advance);

        return `
          <div class="slot-card booked border-2 border-rose-500/50 bg-gradient-to-b from-rose-950/30 via-surfaceElevated to-surface shadow-md">
            <div>
              <div class="flex items-center justify-between mb-2.5 pb-2 border-b border-rose-500/25">
                <span class="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                  <i class="fa-solid fa-lock text-rose-400"></i>
                  <span>${slot.label}</span>
                </span>
                <span class="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-rose-500/25 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 shadow-sm">
                  <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <span>🔴 সিট নিশ্চিত বুকড (লকড 🔒)</span>
                </span>
              </div>

              <!-- Visual Red Warning Alert -->
              <div class="mb-2.5 px-2.5 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-[11px] text-rose-200 flex items-center gap-2">
                <i class="fa-solid fa-ban text-rose-400 text-xs"></i>
                <span class="font-semibold">এই সিটটি অলরেডি বুকড। বুকিং গ্রহণ বন্ধ।</span>
              </div>

              <!-- Customer & Service Details -->
              <div class="space-y-1.5 mb-3 text-xs">
                <div class="flex items-center justify-between">
                  <span class="text-zinc-400">বুককারী:</span>
                  <span class="font-bold text-white"><span class="text-goldLight font-mono mr-1">#${b.tokenNo}</span>${b.customerName}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-zinc-400">মোবাইল:</span>
                  <span class="text-zinc-200 font-mono">${b.customerPhone || 'উপলব্ধ নয়'}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-zinc-400">কারিগর:</span>
                  <span class="text-blue-300 font-medium">${b.barberName}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-zinc-400">সেবা:</span>
                  <span class="text-zinc-200 font-medium truncate max-w-[170px]" title="${srvNames}">✂️ ${srvNames}</span>
                </div>
                
                <!-- Financial Breakdown -->
                <div class="grid grid-cols-2 gap-1.5 pt-1.5 text-[11px]">
                  <div class="bg-surface border border-subtle p-1.5 rounded-lg">
                    <div class="text-[10px] text-zinc-400">অগ্রিম জমা:</div>
                    <div class="font-bold text-emerald-400 font-mono">৳${advance} <span class="text-[9px] text-zinc-400">(${b.advanceMethod ? b.advanceMethod.split(' ')[0] : 'বিকাশ'})</span></div>
                  </div>
                  <div class="bg-amber-500/15 border border-amber-500/35 p-1.5 rounded-lg">
                    <div class="text-[10px] text-amber-300 font-bold">বাকি বিল (Payable):</div>
                    <div class="font-extrabold text-amber-400 font-mono text-xs">৳${payable}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Owner Action Buttons: Convert to Sale, WhatsApp, Cancel, Delete (NO Book Button) -->
            <div class="pt-2 border-t border-rose-500/20 flex items-center gap-1.5">
              <button type="button" class="btn-convert-booking flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-all shadow-sm" data-booking-id="${b.id}" title="কাস্টমার আসলে ক্যাশ মেমোতে নিন (৩০৳ বাদ দিয়ে বাকি ${payable}৳ আদায় হবে)">
                <i class="fa-solid fa-cash-register text-[10px]"></i>
                <span>বিল মেমো নিন</span>
              </button>
              <button type="button" class="btn-whatsapp-booking p-1.5 rounded-lg bg-emerald-700/30 hover:bg-emerald-700/60 text-emerald-400 border border-emerald-500/30 text-[11px] transition-all" data-booking-id="${b.id}" title="হোয়াটসঅ্যাপে নিশ্চিতকরণ মেমো পাঠান">
                <i class="fa-brands fa-whatsapp"></i>
              </button>
              <button type="button" class="btn-cancel-booking p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-subtle text-[11px] transition-all" data-booking-id="${b.id}" title="বুকিং বাতিল করুন">
                <i class="fa-solid fa-ban"></i>
              </button>
              <button type="button" class="btn-delete-booking p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-subtle text-[11px] transition-all" data-booking-id="${b.id}" title="রেকর্ড মুছে ফেলুন">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        `;
      }

      // 3. IF PENDING: Show AMBER / PENDING RESERVATION!
      if (activePending) {
        bookedCount++;
        const b = activePending;
        const srvNames = (b.services && b.services.length) ? b.services.map(s => s.name).join(' + ') : 'সেলুন সার্ভিস';
        const totalBill = b.totalEstimatedAmount || 200;
        const advance = b.advancePaid || 30;
        const payable = b.payableAmount !== undefined ? b.payableAmount : Math.max(0, totalBill - advance);

        return `
          <div class="slot-card border-2 border-amber-500/50 bg-gradient-to-b from-amber-950/25 via-surfaceElevated to-surface shadow-md">
            <div>
              <div class="flex items-center justify-between mb-2.5 pb-2 border-b border-amber-500/25">
                <span class="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                  <i class="fa-regular fa-clock text-amber-400"></i>
                  <span>${slot.label}</span>
                </span>
                <span class="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/25 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-sm animate-pulse">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>⏳ পেন্ডিং রিকোয়েস্ট (লকড 🔒)</span>
                </span>
              </div>

              <!-- Notice: Pending Approval -->
              <div class="mb-2.5 px-2.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-[11px] text-amber-200 flex items-center gap-2">
                <i class="fa-solid fa-hourglass-half text-amber-400 text-xs"></i>
                <span class="font-semibold">অনলাইন রিকোয়েস্ট জমা হয়েছে। আসনটি সাময়িকভাবে রিজার্ভড।</span>
              </div>

              <!-- Customer & Service Details -->
              <div class="space-y-1.5 mb-3 text-xs">
                <div class="flex items-center justify-between">
                  <span class="text-zinc-400">বুককারী:</span>
                  <span class="font-bold text-white"><span class="text-goldLight font-mono mr-1">#${b.tokenNo}</span>${b.customerName}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-zinc-400">মোবাইল:</span>
                  <span class="text-zinc-200 font-mono">${b.customerPhone || 'উপলব্ধ নয়'}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-zinc-400">কারিগর:</span>
                  <span class="text-blue-300 font-medium">${b.barberName}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-zinc-400">সেবা:</span>
                  <span class="text-zinc-200 font-medium truncate max-w-[170px]" title="${srvNames}">✂️ ${srvNames}</span>
                </div>
                
                <!-- Financial Breakdown -->
                <div class="grid grid-cols-2 gap-1.5 pt-1.5 text-[11px]">
                  <div class="bg-surface border border-subtle p-1.5 rounded-lg">
                    <div class="text-[10px] text-zinc-400">অগ্রিম জমা:</div>
                    <div class="font-bold text-emerald-400 font-mono">৳${advance} <span class="text-[9px] text-zinc-400">(${b.advanceMethod ? b.advanceMethod.split(' ')[0] : 'বিকাশ'})</span></div>
                  </div>
                  <div class="bg-amber-500/15 border border-amber-500/35 p-1.5 rounded-lg">
                    <div class="text-[10px] text-amber-300 font-bold">বাকি বিল (Payable):</div>
                    <div class="font-extrabold text-amber-400 font-mono text-xs">৳${payable}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Owner Action Buttons: Confirm, WhatsApp, Cancel, Delete -->
            <div class="pt-2 border-t border-amber-500/20 flex items-center gap-1.5">
              <button type="button" class="btn-confirm-booking flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-all shadow-sm" data-booking-id="${b.id}" title="বুকিং নিশ্চিত করুন">
                <i class="fa-solid fa-check text-[10px]"></i>
                <span>নিশ্চিত করুন</span>
              </button>
              <button type="button" class="btn-whatsapp-booking p-1.5 rounded-lg bg-emerald-700/30 hover:bg-emerald-700/60 text-emerald-400 border border-emerald-500/30 text-[11px] transition-all" data-booking-id="${b.id}" title="হোয়াটসঅ্যাপে পাঠান">
                <i class="fa-brands fa-whatsapp"></i>
              </button>
              <button type="button" class="btn-cancel-booking p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 text-[11px] font-bold transition-all" data-booking-id="${b.id}" title="বাতিল করুন">
                <i class="fa-solid fa-xmark"></i>
              </button>
              <button type="button" class="btn-delete-booking p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-subtle text-[11px] transition-all" data-booking-id="${b.id}" title="রেকর্ড মুছে ফেলুন">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        `;
      }

      // 4. IF FREE: Show GREEN / AVAILABLE!
      availableCount++;
      return `
        <div class="slot-card available border-2 border-emerald-500/35 bg-gradient-to-b from-emerald-950/20 via-surfaceElevated to-surface shadow-md">
          <div>
            <div class="flex items-center justify-between mb-2.5 pb-2 border-b border-emerald-500/20">
              <span class="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <i class="fa-regular fa-clock text-emerald-400"></i>
                <span>${slot.label}</span>
              </span>
              <span class="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>🟢 সম্পূর্ণ ফাঁকা (বুকিংযোগ্য)</span>
              </span>
            </div>

            <div class="py-3 text-center space-y-1">
              <div class="text-2xl">💺</div>
              <p class="text-xs font-semibold text-zinc-200">চেয়ার সম্পূর্ণ ফাঁকা আছে</p>
              <p class="text-[11px] text-zinc-400">৩০৳ বিকাশ/নগদ অগ্রিম টোকেন ফি দিয়ে এখনই আসনটি নিশ্চিত করুন</p>
            </div>
          </div>

          <button type="button" class="btn-book-slot w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md mt-2" data-slot-date="${selectedDate}" data-slot-time="${slot.time}">
            <i class="fa-solid fa-calendar-check text-xs"></i>
            <span>এই স্লটটি বুক করুন (৩০৳ ফি)</span>
          </button>
        </div>
      `;
    }).filter(html => html !== '').join('');

    chairSlotsGrid.innerHTML = visibleSlotsHtml;

    const summaryText = `🟢 ফাঁকা: <strong class="text-emerald-400">${availableCount}</strong> টি | 🔴 বুকড/পেন্ডিং: <strong class="text-rose-400">${bookedCount}</strong> টি${completedCount > 0 ? ` | ✓ সম্পন্ন: <strong class="text-blue-400">${completedCount}</strong> টি` : ''}`;
    if (bookingSlotCountSummary) {
      bookingSlotCountSummary.innerHTML = summaryText;
    }

    // Attach listeners to available slot book buttons
    chairSlotsGrid.querySelectorAll('.btn-book-slot').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = btn.getAttribute('data-slot-date');
        const t = btn.getAttribute('data-slot-time');
        openAdvanceBookingModal(d, t, selectedBarber === 'all' ? 'ওস্তাদ মো. আবুল বাশার (মালিক)' : selectedBarber);
      });
    });

    // Attach listeners to confirm, convert, cancel, whatsapp, and delete buttons
    chairSlotsGrid.querySelectorAll('.btn-confirm-booking').forEach(btn => {
      btn.addEventListener('click', () => {
        confirmBooking(btn.getAttribute('data-booking-id'));
      });
    });

    chairSlotsGrid.querySelectorAll('.btn-convert-booking').forEach(btn => {
      btn.addEventListener('click', () => {
        convertBookingToSale(btn.getAttribute('data-booking-id'));
      });
    });

    chairSlotsGrid.querySelectorAll('.btn-cancel-booking').forEach(btn => {
      btn.addEventListener('click', () => {
        cancelBooking(btn.getAttribute('data-booking-id'));
      });
    });

    chairSlotsGrid.querySelectorAll('.btn-whatsapp-booking').forEach(btn => {
      btn.addEventListener('click', () => {
        sendBookingWhatsApp(btn.getAttribute('data-booking-id'));
      });
    });

    chairSlotsGrid.querySelectorAll('.btn-delete-booking').forEach(btn => {
      btn.addEventListener('click', () => {
        deleteBooking(btn.getAttribute('data-booking-id'));
      });
    });
  }

  function renderBookingsTable(filterQuery = '') {
    if (!bookingsTableBody) return;

    let targetBookings = [...bookings];
    if (filterQuery) {
      const q = filterQuery.toLowerCase();
      targetBookings = targetBookings.filter(b => 
        (b.customerName && b.customerName.toLowerCase().includes(q)) ||
        (b.customerPhone && b.customerPhone.includes(q)) ||
        (b.tokenNo && b.tokenNo.toLowerCase().includes(q)) ||
        (b.barberName && b.barberName.toLowerCase().includes(q))
      );
    }

    if (targetBookings.length === 0) {
      bookingsTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="py-8 text-center text-zinc-400">
            <i class="fa-regular fa-calendar-xmark text-2xl mb-1 text-zinc-500 block"></i>
            <span>কোনো অগ্রিম বুকিং পাওয়া যায়নি।</span>
          </td>
        </tr>
      `;
      return;
    }

    bookingsTableBody.innerHTML = targetBookings.map(b => {
      const srvNames = (b.services && b.services.length) ? b.services.map(s => s.name).join(', ') : 'সেলুন সার্ভিস';
      const totalBill = b.totalEstimatedAmount || 200;
      const advance = b.advancePaid || 30;
      const payable = b.payableAmount !== undefined ? b.payableAmount : Math.max(0, totalBill - advance);

      // Clean single-line status badge (never wraps)
      let statusBadge = '';
      if (b.status === 'pending') {
        statusBadge = `<span class="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/35 text-xs whitespace-nowrap inline-flex items-center gap-1.5 shadow-sm"><span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span><span>পেন্ডিং</span></span>`;
      } else if (b.status === 'confirmed') {
        statusBadge = `<span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/35 text-xs whitespace-nowrap inline-flex items-center gap-1.5 shadow-sm"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span><span>নিশ্চিত</span></span>`;
      } else if (b.status === 'completed') {
        statusBadge = `<span class="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/35 text-xs whitespace-nowrap inline-flex items-center gap-1 shadow-sm"><i class="fa-solid fa-check text-[10px]"></i><span>বিল সম্পন্ন</span></span>`;
      } else {
        statusBadge = `<span class="px-2.5 py-1 rounded-full bg-zinc-500/20 text-zinc-400 border border-subtle text-xs whitespace-nowrap inline-flex items-center gap-1"><span>✕ বাতিল</span></span>`;
      }

      // Clean action buttons layout
      let actionButtons = '';
      if (b.status === 'pending') {
        actionButtons = `
          <button type="button" class="btn-confirm-booking px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1 shadow-sm" data-booking-id="${b.id}" title="বুকিং নিশ্চিত করুন">
            <i class="fa-solid fa-check text-[10px]"></i><span>নিশ্চিত</span>
          </button>
          <button type="button" class="btn-cancel-booking p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 text-xs transition-all" data-booking-id="${b.id}" title="বাতিল করুন">
            <i class="fa-solid fa-xmark"></i>
          </button>
          <button type="button" class="btn-whatsapp-booking p-1.5 rounded-lg bg-emerald-700/30 hover:bg-emerald-700/60 text-emerald-400 border border-emerald-500/30 text-xs transition-all" data-booking-id="${b.id}" title="WhatsApp-এ মেসেজ পাঠান">
            <i class="fa-brands fa-whatsapp"></i>
          </button>
          <button type="button" class="btn-delete-booking p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-subtle text-xs transition-all" data-booking-id="${b.id}" title="মুছে ফেলুন">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        `;
      } else if (b.status === 'confirmed') {
        actionButtons = `
          <button type="button" class="btn-convert-booking px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1 shadow-sm" data-booking-id="${b.id}" title="ক্যাশ মেমোতে নিন (৩০৳ বাদ দিয়ে বাকি ${payable}৳ আদায়)">
            <i class="fa-solid fa-cash-register text-[10px]"></i><span>মেমো বিল</span>
          </button>
          <button type="button" class="btn-cancel-booking p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-subtle text-xs transition-all" data-booking-id="${b.id}" title="বাতিল করুন">
            <i class="fa-solid fa-ban"></i>
          </button>
          <button type="button" class="btn-whatsapp-booking p-1.5 rounded-lg bg-emerald-700/30 hover:bg-emerald-700/60 text-emerald-400 border border-emerald-500/30 text-xs transition-all" data-booking-id="${b.id}" title="WhatsApp-এ মেসেজ পাঠান">
            <i class="fa-brands fa-whatsapp"></i>
          </button>
          <button type="button" class="btn-delete-booking p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-subtle text-xs transition-all" data-booking-id="${b.id}" title="মুছে ফেলুন">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        `;
      } else if (b.status === 'completed') {
        actionButtons = `
          <button type="button" class="btn-whatsapp-booking p-1.5 rounded-lg bg-emerald-700/30 hover:bg-emerald-700/60 text-emerald-400 border border-emerald-500/30 text-xs transition-all" data-booking-id="${b.id}" title="WhatsApp রশিদ পাঠান">
            <i class="fa-brands fa-whatsapp"></i>
          </button>
          <button type="button" class="btn-delete-booking p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-subtle text-xs transition-all" data-booking-id="${b.id}" title="মুছে ফেলুন">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        `;
      } else {
        actionButtons = `
          <button type="button" class="btn-delete-booking p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-subtle text-xs transition-all" data-booking-id="${b.id}" title="মুছে ফেলুন">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        `;
      }

      return `
        <tr class="hover:bg-white/[0.04] transition-colors border-b border-subtle">
          <!-- 1. Customer & Token -->
          <td class="py-3 px-3.5">
            <div class="font-bold text-white text-sm tracking-wide">${b.customerName}</div>
            <div class="flex items-center gap-2 mt-1">
              <span class="font-mono font-bold text-goldLight bg-goldPrimary/15 border border-goldPrimary/30 px-1.5 py-0.5 rounded text-[11px]">#${b.tokenNo || 'BK-100'}</span>
              <span class="text-xs text-zinc-400 font-mono"><i class="fa-solid fa-phone text-[9px] mr-1 text-zinc-500"></i>${b.customerPhone || 'ফোন নেই'}</span>
            </div>
          </td>

          <!-- 2. Date & Time -->
          <td class="py-3 px-3 whitespace-nowrap">
            <div class="text-xs font-semibold text-zinc-200">${formatBengaliDate(b.date, 'dateMonthYear')}</div>
            <div class="text-[11px] text-goldLight font-mono font-bold mt-0.5 flex items-center gap-1">
              <i class="fa-regular fa-clock text-[10px]"></i>
              <span>${b.timeSlot}</span>
            </div>
          </td>

          <!-- 3. Services, Barber & Duration -->
          <td class="py-3 px-3">
            <div class="text-xs font-semibold text-zinc-100 truncate max-w-[200px]" title="${srvNames}">✂️ ${srvNames}</div>
            <div class="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
              <span class="text-blue-300">👤 ${b.barberName}</span>
              <span class="text-zinc-600">•</span>
              <span class="text-amber-400 font-mono font-semibold">⏱️ ${b.totalDuration || 30} মি.</span>
            </div>
          </td>

          <!-- 4. Total Bill & Advance Paid -->
          <td class="py-3 px-3 text-right whitespace-nowrap">
            <div class="text-xs font-bold text-white font-mono">মোট: ৳${totalBill}</div>
            <div class="text-[11px] text-emerald-400 font-mono mt-0.5 font-medium">
              অগ্রিম: -৳${advance} <span class="text-zinc-500 text-[10px]">(${b.advanceMethod ? b.advanceMethod.split(' ')[0] : 'বিকাশ'})</span>
            </div>
          </td>

          <!-- 5. Remaining Payable Bill -->
          <td class="py-3 px-3 text-right whitespace-nowrap">
            <div class="inline-flex flex-col items-end">
              <span class="text-xs font-extrabold text-amber-300 font-mono bg-amber-500/15 border border-amber-500/35 px-2.5 py-1 rounded-lg shadow-sm">৳${payable}</span>
              <span class="text-[9px] text-zinc-400 mt-0.5 font-medium">বাকি পাওনা বিল</span>
            </div>
          </td>

          <!-- 6. Status -->
          <td class="py-3 px-3 text-center whitespace-nowrap">
            ${statusBadge}
          </td>

          <!-- 7. Actions -->
          <td class="py-3 px-3 text-center whitespace-nowrap">
            <div class="flex items-center justify-center gap-1.5">
              ${actionButtons}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach listeners
    bookingsTableBody.querySelectorAll('.btn-confirm-booking').forEach(btn => {
      btn.addEventListener('click', () => confirmBooking(btn.getAttribute('data-booking-id')));
    });

    bookingsTableBody.querySelectorAll('.btn-convert-booking').forEach(btn => {
      btn.addEventListener('click', () => convertBookingToSale(btn.getAttribute('data-booking-id')));
    });

    bookingsTableBody.querySelectorAll('.btn-cancel-booking').forEach(btn => {
      btn.addEventListener('click', () => cancelBooking(btn.getAttribute('data-booking-id')));
    });

    bookingsTableBody.querySelectorAll('.btn-whatsapp-booking').forEach(btn => {
      btn.addEventListener('click', () => sendBookingWhatsApp(btn.getAttribute('data-booking-id')));
    });

    bookingsTableBody.querySelectorAll('.btn-delete-booking').forEach(btn => {
      btn.addEventListener('click', () => deleteBooking(btn.getAttribute('data-booking-id')));
    });
  }

  // Advance Booking Modal Logic
  const advanceBookingModal = document.getElementById('advanceBookingModal');
  const advanceBookingForm = document.getElementById('advanceBookingForm');
  const bookingModalDate = document.getElementById('bookingModalDate');
  const bookingModalTimeSlot = document.getElementById('bookingModalTimeSlot');
  const bookingModalBarber = document.getElementById('bookingModalBarber');
  const bookingModalCustName = document.getElementById('bookingModalCustName');
  const bookingModalCustPhone = document.getElementById('bookingModalCustPhone');
  const bookingPaymentMethod = document.getElementById('bookingPaymentMethod');
  const bookingTrxId = document.getElementById('bookingTrxId');
  const bookingEstimatedDurationBadge = document.getElementById('bookingEstimatedDurationBadge');

  function openAdvanceBookingModal(prefillDate = null, prefillTime = null, prefillBarber = null) {
    if (!advanceBookingModal) return;
    if (advanceBookingForm) advanceBookingForm.reset();

    const d = prefillDate || localTodayStr;
    if (bookingModalDate) {
      bookingModalDate.min = localTodayStr;
      bookingModalDate.value = d;
    }
    if (bookingModalTimeSlot && prefillTime) bookingModalTimeSlot.value = prefillTime;
    if (bookingModalBarber && prefillBarber) bookingModalBarber.value = prefillBarber;

    // Reset default checkbox
    document.querySelectorAll('#bookingServicesGrid input[type="checkbox"]').forEach((cb, idx) => {
      cb.checked = (idx === 0);
    });

    calculateBookingServices();
    advanceBookingModal.classList.add('active');
  }

  function calculateBookingServices() {
    const checkboxes = document.querySelectorAll('#bookingServicesGrid input[type="checkbox"]:checked');
    let totalMins = 0;
    let totalPrice = 0;
    checkboxes.forEach(cb => {
      totalMins += Number(cb.getAttribute('data-duration')) || 15;
      totalPrice += Number(cb.getAttribute('data-price')) || 100;
    });
    if (totalMins === 0) totalMins = 30;

    const advanceFee = 30;
    const payable = Math.max(0, totalPrice - advanceFee);

    if (bookingEstimatedDurationBadge) {
      bookingEstimatedDurationBadge.innerHTML = `⏱️ মোট সময়: <strong>${totalMins} মিনিট</strong> | সম্ভাব্য বিল: <strong>৳${totalPrice}</strong> (অগ্রিম: ৳৩০, বাকি পাওনা: ৳${payable})`;
    }
    return { totalMins, totalPrice, payable };
  }

  // Checkbox listener
  document.querySelectorAll('#bookingServicesGrid input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', calculateBookingServices);
  });

  if (advanceBookingForm) {
    advanceBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const date = bookingModalDate ? bookingModalDate.value : localTodayStr;
      const timeSlot = bookingModalTimeSlot ? bookingModalTimeSlot.value : '11:30 AM';
      const barberName = bookingModalBarber ? bookingModalBarber.value : 'ওস্তাদ মো. আবুল বাশার (মালিক)';
      const customerName = (bookingModalCustName && bookingModalCustName.value.trim()) || 'সম্মানিত কাস্টমার';
      const customerPhone = (bookingModalCustPhone && bookingModalCustPhone.value.trim()) || '';
      const method = bookingPaymentMethod ? bookingPaymentMethod.value : 'বিকাশ';
      const trxId = (bookingTrxId && bookingTrxId.value.trim()) || 'ADV30';

      // Conflict Check: Check if slot is already booked for this barber
      const conflict = bookings.find(b => 
        b.date === date && 
        b.timeSlot === timeSlot && 
        b.barberName === barberName && 
        (b.status === 'confirmed' || b.status === 'pending')
      );

      if (conflict) {
        showToast(`⚠️ এই তারিখে (${formatBengaliDate(date, 'shortDate')}) ${timeSlot} এ কারিগর "${barberName}" এর চেয়ার অলরেডি বুকড আছে! অন্য সময় বা কারিগর বেছে নিন।`, 4500);
        return;
      }

      const checkboxes = document.querySelectorAll('#bookingServicesGrid input[type="checkbox"]:checked');
      const selectedServices = [];
      let totalMins = 0;
      let totalPrice = 0;
      checkboxes.forEach(cb => {
        const sName = cb.value;
        const sDur = Number(cb.getAttribute('data-duration')) || 15;
        const sPrice = Number(cb.getAttribute('data-price')) || 100;
        selectedServices.push({ name: sName, duration: sDur, price: sPrice });
        totalMins += sDur;
        totalPrice += sPrice;
      });

      if (selectedServices.length === 0) {
        selectedServices.push({ name: 'চুল কাটা', duration: 30, price: 150 });
        totalMins = 30;
        totalPrice = 150;
      }

      const advanceFee = 30;
      const payableAmount = Math.max(0, totalPrice - advanceFee);
      const tokenNo = 'BK-' + Math.floor(100 + Math.random() * 900);
      const newBooking = {
        id: 'book_' + Date.now(),
        tokenNo: tokenNo,
        customerName: customerName,
        customerPhone: customerPhone,
        date: date,
        timeSlot: timeSlot,
        barberName: barberName,
        chairNo: barberName.includes('সুজন') ? 'চেয়ার ২' : (barberName.includes('রনি') ? 'চেয়ার ৩' : 'চেয়ার ১'),
        services: selectedServices,
        totalDuration: totalMins,
        totalEstimatedAmount: totalPrice,
        advancePaid: advanceFee,
        payableAmount: payableAmount,
        advanceMethod: method,
        trxId: trxId,
        status: 'pending', // নতুন বুকিং রিকোয়েস্ট (মালিক নিশ্চিত করবেন)
        createdAt: new Date().toISOString()
      };

      bookings.unshift(newBooking);

      // Auto add customer to CRM customers list if not present
      if (customerPhone) {
        const existingCust = customers.find(c => c.phone && c.phone === customerPhone);
        if (!existingCust) {
          customers.unshift({
            id: 'cust_' + Date.now(),
            name: customerName,
            phone: customerPhone,
            cycleDays: 25,
            lastVisitDate: new Date().toISOString(),
            styleNote: selectedServices.map(s => s.name).join(', '),
            regularAmount: totalPrice,
            totalVisits: 1,
            totalSpent: advanceFee,
            isVip: false,
            avatar: '🧑'
          });
        }
      }

      persistData();
      closeModals();
      refreshAllUI();
      renderBookingSlots(date, barberName);
      renderBookingsTable();
      updateBookingBadges();
      showToast(`✓ অভিনন্দন! #${tokenNo} টোকেনে ৩০৳ অগ্রিম জমার নতুন বুকিং রিকোয়েস্ট যুক্ত হয়েছে! (বাকি বিল: ৳${payableAmount})`);
    });
  }

  function confirmBooking(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    booking.status = 'confirmed';
    persistData();
    renderBookingSlots();
    renderBookingsTable();
    updateBookingBadges();
    showToast(`✓ বুকিং #${booking.tokenNo} (${booking.customerName}) সফলভাবে নিশ্চিত (Active) করা হয়েছে! কাস্টমারকে জানাতে WhatsApp আইকনে চাপুন।`);
  }

  function deleteBooking(bookingId) {
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx === -1) return;
    const booking = bookings[idx];

    if (confirm(`আপনি কি সত্যিই #${booking.tokenNo} (${booking.customerName}) এর বুকিং রেকর্ডটি চিরতরে মুছে ফেলতে চান?`)) {
      bookings.splice(idx, 1);
      persistData();
      renderBookingSlots();
      renderBookingsTable();
      updateBookingBadges();
      showToast(`✓ বুকিং #${booking.tokenNo} সফলভাবে মুছে ফেলা হয়েছে!`);
    }
  }

  function convertBookingToSale(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    openSmartSaleModal(booking.date);

    const custInput = document.getElementById('saleCustomerInput');
    const custPhone = document.getElementById('saleCustomerPhone');
    const barberSelect = document.getElementById('saleBarberName');
    const totalAmount = document.getElementById('saleTotalAmount');
    const paidAmount = document.getElementById('salePaidAmount');
    const notes = document.getElementById('saleNotes');

    if (custInput) custInput.value = booking.customerName;
    if (custPhone) custPhone.value = booking.customerPhone;
    if (barberSelect) barberSelect.value = booking.barberName;
    
    const bill = booking.totalEstimatedAmount || 200;
    const advance = booking.advancePaid || 30;
    const dueAfterAdvance = booking.payableAmount !== undefined ? booking.payableAmount : Math.max(0, bill - advance);

    if (totalAmount) totalAmount.value = bill;
    if (paidAmount) paidAmount.value = dueAfterAdvance;
    if (notes) notes.value = `অগ্রিম ${advance}৳ বুকিং ফি সমন্বয়কৃত (টোকেন #${booking.tokenNo}, TrxID: ${booking.trxId || 'N/A'})। বাকি ${dueAfterAdvance}৳ আদায়।`;

    booking.status = 'completed';
    persistData();
    renderBookingSlots();
    renderBookingsTable();
    updateBookingBadges();
    showToast(`✓ বুকিং টোকেন #${booking.tokenNo} ক্যাশ মেমোতে লোড হয়েছে! ${advance}৳ অগ্রিম সমন্বিত, বাকি ${dueAfterAdvance}৳ আদায়।`);
  }

  function cancelBooking(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    if (confirm(`আপনি কি সত্যিই #${booking.tokenNo} (${booking.customerName}) এর বুকিং বাতিল করতে চান?`)) {
      booking.status = 'cancelled';
      persistData();
      renderBookingSlots();
      renderBookingsTable();
      updateBookingBadges();
      showToast(`✓ বুকিং #${booking.tokenNo} সফলভাবে বাতিল করা হয়েছে।`);
    }
  }

  function sendBookingWhatsApp(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || !booking.customerPhone) {
      showToast('⚠️ কাস্টমারের কোনো ফোন নম্বর নেই!');
      return;
    }

    const cleanPhone = booking.customerPhone.replace(/[^0-9]/g, '');
    let targetPhone = cleanPhone;
    if (targetPhone.startsWith('0')) targetPhone = '880' + targetPhone.substring(1);

    const srvNames = (booking.services && booking.services.length) ? booking.services.map(s => s.name).join(', ') : 'সেলুন সার্ভিস';
    const total = booking.totalEstimatedAmount || 200;
    const advance = booking.advancePaid || 30;
    const payable = booking.payableAmount !== undefined ? booking.payableAmount : Math.max(0, total - advance);
    const statusText = booking.status === 'confirmed' ? '✓ নিশ্চিত (Active)' : (booking.status === 'pending' ? '⏳ পেন্ডিং রিকোয়েস্ট' : (booking.status === 'completed' ? 'মেমো সম্পন্ন' : 'বাতিল'));

    const msg = `আসসালামু আলাইকুম ${booking.customerName} ভাই! ${salon.name} থেকে আপনার অগ্রিম সেলুন বুকিং তথ্য:\n\n` +
      `📌 টোকেন নং: #${booking.tokenNo}\n` +
      `📅 তারিখ: ${formatBengaliDate(booking.date, 'dateMonthYear')}\n` +
      `⏰ সময় স্লট: ${booking.timeSlot}\n` +
      `💈 কারিগর/চেয়ার: ${booking.barberName} (${booking.chairNo || 'চেয়ার ১'})\n` +
      `✂️ সেবাসমূহ: ${srvNames} (আনুমানিক ${booking.totalDuration || 30} মিনিট)\n` +
      `💵 মোট সম্ভাব্য বিল: ৳${total}\n` +
      `💰 অগ্রিম জমা: ৳${advance} (${booking.advanceMethod || 'বিকাশ'} - Trx: ${booking.trxId || 'N/A'})\n` +
      `👉 আর পাওয়া যাবে / বাকি বিল: ৳${payable} (সেলুনে এসে প্রদানযোগ্য)\n` +
      `🔰 বর্তমান স্ট্যাটাস: ${statusText}\n` +
      `📍 সেলুন ঠিকানা: ${salon.address}\n\n` +
      `দয়া করে নির্ধারিত সময়ের ৫ মিনিট আগে উপস্থিত থাকবেন। কোনো পরিবর্তন থাকলে আমাদের জানান। ধন্যবাদ!`;

    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  // ========================================================
  // 7. SAAS SUBSCRIPTION GATEWAY & MULTI-TENANT ENGINE
  // ========================================================
  const subscriptionPaymentModal = document.getElementById('subscriptionPaymentModal');
  const subscriptionPaymentForm = document.getElementById('subscriptionPaymentForm');
  const subPlanMonthlyTab = document.getElementById('subPlanMonthlyTab');
  const subPlanYearlyTab = document.getElementById('subPlanYearlyTab');
  const modalSubPlanTitle = document.getElementById('modalSubPlanTitle');
  const modalSubPlanPriceDisplay = document.getElementById('modalSubPlanPriceDisplay');
  const modalSubPlanSubtitle = document.getElementById('modalSubPlanSubtitle');
  const subSelectedPlanId = document.getElementById('subSelectedPlanId');
  const subSelectedPlanAmount = document.getElementById('subSelectedPlanAmount');
  const subSalonName = document.getElementById('subSalonName');
  const subOwnerName = document.getElementById('subOwnerName');
  const subSenderPhone = document.getElementById('subSenderPhone');
  const subTrxId = document.getElementById('subTrxId');
  const licenseCertificateBox = document.getElementById('licenseCertificateBox');

  // Make globally accessible for HTML onclick
  window.switchSubscriptionModalPlan = function(plan) {
    if (plan === 'monthly') {
      if (subPlanMonthlyTab) {
        subPlanMonthlyTab.className = 'py-2 text-xs font-bold rounded-lg transition-all text-goldLight bg-amber-500/20 border border-amber-500/40';
      }
      if (subPlanYearlyTab) {
        subPlanYearlyTab.className = 'py-2 text-xs font-bold rounded-lg transition-all text-white bg-white/10';
      }
      if (modalSubPlanTitle) modalSubPlanTitle.textContent = 'স্ট্যান্ডার্ড মান্থলি প্রোপ্যাক';
      if (modalSubPlanPriceDisplay) modalSubPlanPriceDisplay.textContent = '৳১৫০ / মাস';
      if (modalSubPlanSubtitle) modalSubPlanSubtitle.textContent = 'প্রতি মাসে রিনিউ সুবিধা, আনলিমিটেড কাস্টমার ডেটাবেজ ও অগ্রিম চেয়ার বুকিং সিস্টেম।';
      if (subSelectedPlanId) subSelectedPlanId.value = 'monthly';
      if (subSelectedPlanAmount) subSelectedPlanAmount.value = '150';
    } else {
      if (subPlanYearlyTab) {
        subPlanYearlyTab.className = 'py-2 text-xs font-bold rounded-lg transition-all text-goldLight bg-amber-500/20 border border-amber-500/40';
      }
      if (subPlanMonthlyTab) {
        subPlanMonthlyTab.className = 'py-2 text-xs font-bold rounded-lg transition-all text-white bg-white/10';
      }
      if (modalSubPlanTitle) modalSubPlanTitle.textContent = 'ভিআইপি বাৎসরিক সুপার সেভার প্ল্যান';
      if (modalSubPlanPriceDisplay) modalSubPlanPriceDisplay.textContent = '৳৬০০ / বছর';
      if (modalSubPlanSubtitle) modalSubPlanSubtitle.textContent = '৩৬৫ দিনের সম্পূর্ণ আনলিমিটেড ক্লাউড এক্সেস, অগ্রিম চেয়ার বুকিং ও আজীবন ব্যাকআপ (৬৫%+ সাশ্রয়ী)।';
      if (subSelectedPlanId) subSelectedPlanId.value = 'yearly';
      if (subSelectedPlanAmount) subSelectedPlanAmount.value = '600';
    }
  };

  function openSubscriptionPaymentModal(planId = 'yearly') {
    if (!subscriptionPaymentModal) return;
    if (subscriptionPaymentForm) subscriptionPaymentForm.reset();
    if (licenseCertificateBox) licenseCertificateBox.classList.add('hidden');

    window.switchSubscriptionModalPlan(planId);

    if (subSalonName) subSalonName.value = salon.name;
    if (subOwnerName) subOwnerName.value = salon.ownerName;
    if (subSenderPhone) subSenderPhone.value = salon.phone;

    subscriptionPaymentModal.classList.add('active');
  }

  if (subscriptionPaymentForm) {
    subscriptionPaymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const sName = (subSalonName && subSalonName.value.trim()) || salon.name;
      const oName = (subOwnerName && subOwnerName.value.trim()) || salon.ownerName;
      const sPhone = (subSenderPhone && subSenderPhone.value.trim()) || '';
      const trx = (subTrxId && subTrxId.value.trim()) || 'TRX-DEFAULT';
      const planId = (subSelectedPlanId && subSelectedPlanId.value) || 'yearly';
      const amount = (subSelectedPlanAmount && subSelectedPlanAmount.value) || '600';

      const licenseKey = `SLN-2026-${planId === 'yearly' ? 'VIP' : 'PRO'}-${Math.floor(1000 + Math.random() * 9000)}`;
      const certExpiry = planId === 'yearly' ? '১৮ অক্টোবর ২০২৭ (১ বছর সক্রিয়)' : '১৮ নভেম্বর ২০২৬ (১ মাস সক্রিয়)';

      // Populate Certificate Elements
      const certSalonName = document.getElementById('certSalonName');
      const certOwnerName = document.getElementById('certOwnerName');
      const certPlanName = document.getElementById('certPlanName');
      const certLicenseKey = document.getElementById('certLicenseKey');
      const certExpiryDate = document.getElementById('certExpiryDate');

      if (certSalonName) certSalonName.textContent = sName;
      if (certOwnerName) certOwnerName.textContent = oName;
      if (certPlanName) certPlanName.textContent = planId === 'yearly' ? 'ভিআইপি বাৎসরিক সুপার সেভার (৳৬০০/বছর)' : 'স্ট্যান্ডার্ড মান্থলি প্রোপ্যাক (৳১৫০/মাস)';
      if (certLicenseKey) certLicenseKey.textContent = licenseKey;
      if (certExpiryDate) certExpiryDate.textContent = certExpiry;

      if (licenseCertificateBox) {
        licenseCertificateBox.classList.remove('hidden');
        licenseCertificateBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      salon.subscriptionStatus = `সক্রিয় লাইসেন্স: ${licenseKey} (মেয়াদ: ${certExpiry})`;
      persistData();
      renderSalonInfo();
      showToast(`✓ অভিনন্দন! পেমেন্ট (৳${amount}) সফলভাবে ভেরিফাই হয়েছে এবং সালোনো লাইসেন্স সক্রিয় হয়েছে!`, 4000);
    });
  }

  // Multi-Salon Switcher & Tenant Registration
  const multiSalonModal = document.getElementById('multiSalonModal');
  const salonTenantList = document.getElementById('salonTenantList');
  const registeredSalonsCount = document.getElementById('registeredSalonsCount');
  const addNewSalonTenantForm = document.getElementById('addNewSalonTenantForm');

  function openMultiSalonModal() {
    if (!multiSalonModal) return;
    renderTenantList();
    multiSalonModal.classList.add('active');
  }

  function renderTenantList() {
    if (!salonTenantList) return;

    if (registeredSalonsCount) {
      registeredSalonsCount.textContent = `${tenants.length}টি নিবন্ধিত সেলুন`;
    }

    salonTenantList.innerHTML = tenants.map(t => {
      const isActive = t.id === activeTenantId;
      return `
        <div class="p-3 rounded-xl border ${isActive ? 'bg-amber-500/10 border-goldPrimary' : 'bg-surfaceElevated border-subtle hover:border-card'} flex items-center justify-between transition-all">
          <div class="flex items-center gap-2.5">
            <span class="text-xl">💈</span>
            <div>
              <div class="font-bold text-white text-xs flex items-center gap-1.5">
                <span>${t.name}</span>
                ${isActive ? '<span class="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">সক্রিয়</span>' : ''}
              </div>
              <div class="text-[11px] text-zinc-400">মালিক: ${t.ownerName} • <span class="font-mono text-goldLight">${t.phone}</span></div>
              <div class="text-[10px] text-zinc-500">${t.address || 'ঠিকানা দেওয়া হয়নি'}</div>
            </div>
          </div>
          <div>
            ${isActive ? `
              <span class="text-xs text-goldLight font-bold px-2.5 py-1 rounded-lg bg-black/20">চলমান</span>
            ` : `
              <button type="button" class="btn-switch-tenant text-xs bg-white/10 hover:bg-white/20 text-white font-semibold px-2.5 py-1 rounded-lg border border-subtle transition-all" data-tenant-id="${t.id}">
                সুইচ করুন
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');

    salonTenantList.querySelectorAll('.btn-switch-tenant').forEach(btn => {
      btn.addEventListener('click', () => {
        switchSalonTenant(btn.getAttribute('data-tenant-id'));
      });
    });
  }

  function switchSalonTenant(tenantId, isNew = false) {
    const targetTenant = tenants.find(t => t.id === tenantId);
    if (!targetTenant) return;

    // 1. Snapshot current tenant's data into their tenant namespace
    if (activeTenantId) {
      localStorage.setItem(`salono_${activeTenantId}_customers`, JSON.stringify(customers));
      localStorage.setItem(`salono_${activeTenantId}_sales`, JSON.stringify(sales));
      localStorage.setItem(`salono_${activeTenantId}_bookings`, JSON.stringify(bookings));
      localStorage.setItem(`salono_${activeTenantId}_profile`, JSON.stringify(salon));
    }

    // 2. Set new active tenant
    activeTenantId = tenantId;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TENANT, activeTenantId);

    // 3. Load target tenant data
    const savedProfile = localStorage.getItem(`salono_${tenantId}_profile`);
    if (savedProfile) {
      salon = JSON.parse(savedProfile);
    } else {
      salon = {
        name: targetTenant.name,
        tagline: 'মডার্ন হেয়ার কাট ও গ্রুমিং স্টুডিও',
        ownerName: targetTenant.ownerName,
        phone: targetTenant.phone,
        address: targetTenant.address || 'দোকানের ঠিকানা',
        defaultCycleDays: 25,
        subscriptionStatus: targetTenant.plan || 'ভিআইপি প্রো এক্টিভ (৳৬০০/বছর)'
      };
    }

    const savedCust = localStorage.getItem(`salono_${tenantId}_customers`);
    customers = savedCust ? JSON.parse(savedCust) : (isNew ? [] : DEFAULT_CUSTOMERS);

    const savedSales = localStorage.getItem(`salono_${tenantId}_sales`);
    sales = savedSales ? JSON.parse(savedSales) : (isNew ? [] : DEFAULT_SALES);

    const savedBookings = localStorage.getItem(`salono_${tenantId}_bookings`);
    bookings = savedBookings ? JSON.parse(savedBookings) : (isNew ? [] : DEFAULT_BOOKINGS);

    persistData();
    closeModals();
    refreshAllUI();
    showToast(`✓ সেলুন পরিবর্তন সম্পন্ন! বর্তমান সক্রিয় সেলুন: "${salon.name}"`);
  }

  if (addNewSalonTenantForm) {
    addNewSalonTenantForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const sName = document.getElementById('newTenantSalonName').value.trim();
      const oName = document.getElementById('newTenantOwnerName').value.trim();
      const phone = document.getElementById('newTenantPhone').value.trim();
      const address = document.getElementById('newTenantAddress').value.trim();

      if (!sName || !oName) {
        showToast('⚠️ সেলুনের নাম ও মালিকের নাম প্রদান আবশ্যক!');
        return;
      }

      const newId = 'tenant_' + Date.now();
      const newTenantObj = {
        id: newId,
        name: sName,
        ownerName: oName,
        phone: phone,
        address: address,
        plan: 'বাৎসরিক ভিআইপি (৳৬০০)',
        status: 'active',
        createdAt: new Date().toISOString()
      };

      tenants.push(newTenantObj);
      switchSalonTenant(newId, true);
      showToast(`✓ অভিনন্দন! নতুন সেলুন "${sName}" সফলভাবে তৈরি হয়েছে এবং সম্পূর্ণ পৃথক খাতা চালু হয়েছে!`);
    });
  }

  // 1-Click Copy Phone Number Button Handlers (bKash & Nagad: 01734018155)
  function setupCopyPhoneButtons() {
    document.querySelectorAll('.copy-phone-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const phone = btn.getAttribute('data-phone') || '01734018155';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(phone).then(() => {
            const originalText = btn.innerHTML;
            btn.innerHTML = `<i class="fa-solid fa-check text-emerald-400"></i> <span>কপি হয়েছে</span>`;
            showToast(`✓ বিকাশ ও নগদ নম্বর "${phone}" ক্লিপবোর্ডে কপি হয়েছে!`);
            setTimeout(() => { btn.innerHTML = originalText; }, 2000);
          }).catch(() => {
            showToast(`✓ নম্বর: ${phone}`);
          });
        } else {
          showToast(`✓ নম্বর: ${phone}`);
        }
      });
    });
  }

  // Wire Modal Trigger Buttons across application
  document.querySelectorAll('.open-booking-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openAdvanceBookingModal();
    });
  });

  document.querySelectorAll('.open-sub-payment-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-plan') || 'yearly';
      openSubscriptionPaymentModal(plan);
    });
  });

  document.querySelectorAll('.open-multi-salon-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openMultiSalonModal();
    });
  });

  // Master UI Refresh
  function refreshAllUI() {
    renderSalonInfo();
    renderDashboardKPIs();
    renderReminderList('dashboardReminderList', 'due_only');
    renderDashboardTodaySales();
    renderQuickDayNavStrip();
    renderComprehensiveSalesLedger();
    renderBookingSlots();
    renderBookingsTable();
    updateBookingBadges();
    setupCopyPhoneButtons();
  }

  // Initial Boot
  refreshAllUI();

});

