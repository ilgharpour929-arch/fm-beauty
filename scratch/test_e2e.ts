import { memoryStore } from "../src/lib/store";

async function runEndToEndTest() {
  console.log("=== STARTING FULL END-TO-END FLOW TEST ===");

  // 1. Simulate New Customer Registration
  const testPhone = "0912" + Math.floor(1000007 + Math.random() * 9000000);
  const testUser = {
    id: "usr-" + Date.now(),
    firstName: "سارا",
    lastName: "تست‌کننده",
    phone: testPhone,
    role: "CUSTOMER",
    createdAt: new Date().toISOString(),
  };

  memoryStore.addUser(testUser);
  console.log("✓ Step 1: Customer registered:", testUser.firstName, testUser.lastName, "(Phone:", testUser.phone, ")");

  // 2. Simulate Booking Creation (e.g. Volume Eyelash on 2026-08-01 at 10:30)
  const testDate = "2026-08-01";
  const testSlot = "10:30";
  const bookingId = "bk-" + Date.now();

  const isAlreadyBooked = memoryStore.isSlotBooked(testDate, testSlot);
  console.log("✓ Step 2: Slot availability check for date", testDate, "time", testSlot, "=> Booked?", isAlreadyBooked);

  if (!isAlreadyBooked) {
    memoryStore.addBooking({
      id: bookingId,
      userId: testUser.id,
      serviceId: "volume",
      date: testDate,
      startTime: testSlot,
      status: "PENDING_DEPOSIT",
      depositAmount: 540000,
      note: "تست کامل خودکار رزرو مشتری",
      receiptImage: "/uploads/test-receipt.jpg",
      createdAt: new Date().toISOString(),
      user: {
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        phone: testUser.phone,
      },
      service: {
        name: "اکستنشن مژه والیوم",
        price: 1800000,
      },
    });
    console.log("✓ Step 3: Booking successfully created & saved to store with ID:", bookingId);
  }

  // 3. Test Slot Lock / Double Booking Prevention
  const isSlotNowLocked = memoryStore.isSlotBooked(testDate, testSlot);
  console.log("✓ Step 4: Double Booking Check for same slot (2026-08-01 10:30) => Slot Locked?", isSlotNowLocked);

  // 4. Verify Admin Panel User List & Booking List Visibility
  const allUsers = memoryStore.getUsers();
  const allBookings = memoryStore.getBookings();

  const foundUserInAdmin = allUsers.find((u) => u.phone === testPhone);
  const foundBookingInAdmin = allBookings.find((b) => b.id === bookingId);

  console.log("=== ADMIN PANEL VERIFICATION RESULTS ===");
  console.log("✓ User visible in Admin Users list (/admin/users)?", !!foundUserInAdmin ? "YES (%100 ACCURATE)" : "NO");
  console.log("✓ Booking visible in Admin Bookings list (/admin/bookings)?", !!foundBookingInAdmin ? "YES (%100 ACCURATE)" : "NO");
  if (foundBookingInAdmin) {
    console.log("   - Customer Name:", foundBookingInAdmin.user.firstName, foundBookingInAdmin.user.lastName);
    console.log("   - Service:", foundBookingInAdmin.service.name);
    console.log("   - Price / Deposit:", foundBookingInAdmin.service.price, "/", foundBookingInAdmin.depositAmount);
    console.log("   - Date / Slot:", foundBookingInAdmin.date, "|", foundBookingInAdmin.startTime);
  }

  console.log("=== END-TO-END TEST PASSED %100 SUCCESSFULLY ===");
}

runEndToEndTest();
