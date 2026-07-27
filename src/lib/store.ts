// Enhanced Memory Data Store for Vercel Serverless environment
export interface UserRecord {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  createdAt: string;
}

export interface BookingRecord {
  id: string;
  userId: string;
  serviceId: string;
  date: string;
  startTime: string;
  status: string;
  depositAmount: number;
  note: string;
  receiptImage: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  service: {
    name: string;
    price: number;
  };
}

export interface ServiceRecord {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
}

export interface BlockedDateRecord {
  id: string;
  date: string;
  reason: string;
}

const INITIAL_SERVICES: ServiceRecord[] = [
  { id: "volume", name: "اکستنشن مژه والیوم", description: "مژه‌های حجیم و پرپشت با تکنیک والیوم", price: 1800000, duration: 90, image: "/images/gallery/valyum.jpg" },
  { id: "spiky", name: "اکستنشن مژه اسپایکی", description: "مژه‌های فرچه‌ای با ظاهری جذاب و چشمگیر", price: 1500000, duration: 90, image: "/images/gallery/spayki.jpg" },
  { id: "natural", name: "اکستنشن مژه نچرال", description: "مژه‌های طبیعی و ظریف برای روزمره", price: 1100000, duration: 90, image: "/images/services/nacral.jpg" },
  { id: "repair", name: "ترمیم مژه", description: "ترمیم مژه‌های قبلی (نیاز به هماهنگی)", price: 1500000, duration: 90, image: "/images/gallery/nemune-1.jpg" },
  { id: "lash-lift", name: "لیفت مژه و لمینیت", description: "فر طبیعی و ماندگار مژه‌ها بدون اکستنشن", price: 1200000, duration: 90, image: "/images/services/lift-moje.jpg" },
  { id: "brow-lift", name: "لیفت ابرو", description: "مرتب‌سازی و فرم‌دهی ابروها", price: 1200000, duration: 90, image: "/images/services/lift-abru.jpg" },
];

const globalStore = globalThis as unknown as {
  __usersStore?: UserRecord[];
  __bookingsStore?: BookingRecord[];
  __blockedDatesStore?: BlockedDateRecord[];
  __servicesStore?: ServiceRecord[];
};

if (!globalStore.__usersStore) {
  globalStore.__usersStore = [
    {
      id: "admin-1",
      firstName: "فاطمه",
      lastName: "محمدی",
      phone: "09141898006",
      role: "ADMIN",
      createdAt: new Date().toISOString(),
    },
  ];
}

if (!globalStore.__bookingsStore) {
  globalStore.__bookingsStore = [];
}

if (!globalStore.__blockedDatesStore) {
  globalStore.__blockedDatesStore = [];
}

if (!globalStore.__servicesStore) {
  globalStore.__servicesStore = INITIAL_SERVICES;
}

export const memoryStore = {
  // Users (PERMANENT VISIBILITY FOR ALL REGISTERED USERS)
  getUsers: () => globalStore.__usersStore || [],
  addUser: (user: UserRecord) => {
    if (!globalStore.__usersStore) globalStore.__usersStore = [];
    const existsIndex = globalStore.__usersStore.findIndex((u) => u.phone === user.phone);
    if (existsIndex >= 0) {
      globalStore.__usersStore[existsIndex] = user;
    } else {
      globalStore.__usersStore.unshift(user);
    }
  },

  // Bookings
  getBookings: () => globalStore.__bookingsStore || [],
  addBooking: (booking: BookingRecord) => {
    if (!globalStore.__bookingsStore) globalStore.__bookingsStore = [];
    globalStore.__bookingsStore.unshift(booking);
  },
  updateBookingStatus: (id: string, status: string) => {
    if (!globalStore.__bookingsStore) return;
    const b = globalStore.__bookingsStore.find((item) => item.id === id);
    if (b) {
      b.status = status;
    }
  },
  updateBookingReceipt: (id: string, receiptImage: string) => {
    if (!globalStore.__bookingsStore) return;
    const b = globalStore.__bookingsStore.find((item) => item.id === id);
    if (b) {
      b.receiptImage = receiptImage;
      b.status = "WAITING_APPROVAL";
    }
  },
  isSlotBooked: (date: string, startTime: string) => {
    // Check if whole date is blocked
    if (memoryStore.isDateBlocked(date)) return true;

    if (!globalStore.__bookingsStore) return false;
    return globalStore.__bookingsStore.some(
      (b) => b.date === date && b.startTime === startTime && ["PENDING_DEPOSIT", "WAITING_APPROVAL", "CONFIRMED"].includes(b.status)
    );
  },

  // Blocked Dates
  getBlockedDates: () => globalStore.__blockedDatesStore || [],
  addBlockedDate: (date: string, reason: string) => {
    if (!globalStore.__blockedDatesStore) globalStore.__blockedDatesStore = [];
    const exists = globalStore.__blockedDatesStore.find((b) => b.date === date);
    if (!exists) {
      globalStore.__blockedDatesStore.push({
        id: "bd-" + Date.now(),
        date,
        reason: reason || "تعطیلات سالن",
      });
    }
  },
  removeBlockedDate: (date: string) => {
    if (!globalStore.__blockedDatesStore) return;
    globalStore.__blockedDatesStore = globalStore.__blockedDatesStore.filter((b) => b.date !== date);
  },
  isDateBlocked: (date: string) => {
    if (!globalStore.__blockedDatesStore) return false;
    return globalStore.__blockedDatesStore.some((b) => b.date === date);
  },

  // Services & Photos Management
  getServices: () => globalStore.__servicesStore || INITIAL_SERVICES,
  updateService: (id: string, updates: Partial<ServiceRecord>) => {
    if (!globalStore.__servicesStore) globalStore.__servicesStore = INITIAL_SERVICES;
    const idx = globalStore.__servicesStore.findIndex((s) => s.id === id);
    if (idx >= 0) {
      globalStore.__servicesStore[idx] = { ...globalStore.__servicesStore[idx], ...updates };
    }
  },
  addService: (service: ServiceRecord) => {
    if (!globalStore.__servicesStore) globalStore.__servicesStore = INITIAL_SERVICES;
    globalStore.__servicesStore.unshift(service);
  },
};
