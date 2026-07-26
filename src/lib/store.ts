// Memory Data Store for Vercel Serverless environment
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

const globalStore = globalThis as unknown as {
  __usersStore?: UserRecord[];
  __bookingsStore?: BookingRecord[];
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

export const memoryStore = {
  getUsers: () => globalStore.__usersStore || [],
  addUser: (user: UserRecord) => {
    if (!globalStore.__usersStore) globalStore.__usersStore = [];
    // Prevent duplicate phone
    const exists = globalStore.__usersStore.find((u) => u.phone === user.phone);
    if (!exists) {
      globalStore.__usersStore.unshift(user);
    }
  },
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
  isSlotBooked: (date: string, startTime: string) => {
    if (!globalStore.__bookingsStore) return false;
    return globalStore.__bookingsStore.some(
      (b) => b.date === date && b.startTime === startTime && ["PENDING_DEPOSIT", "WAITING_APPROVAL", "CONFIRMED"].includes(b.status)
    );
  },
};
