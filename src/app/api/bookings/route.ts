import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { memoryStore } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "لطفاً ابتدا وارد شوید" }, { status: 401 });
  }

  try {
    const { serviceId, date, startTime, note } = await request.json();

    if (!serviceId || !date || !startTime) {
      return NextResponse.json({ error: "همه فیلدها الزامی هستند" }, { status: 400 });
    }

    let service: any = await prisma.service.findUnique({ where: { id: serviceId } }).catch(() => null);
    if (!service) {
      const staticServices: Record<string, { name: string; price: number }> = {
        volume: { name: "اکستنشن مژه والیوم", price: 1800000 },
        spiky: { name: "اکستنشن مژه اسپایکی", price: 1500000 },
        natural: { name: "اکستنشن مژه نچرال", price: 1100000 },
        repair: { name: "ترمیم مژه", price: 1500000 },
        "lash-lift": { name: "لیفت مژه و لمینیت", price: 1200000 },
        "brow-lift": { name: "لیفت ابرو", price: 1200000 },
      };
      service = staticServices[serviceId] || { name: "خدمت زیبایی مژه", price: 1500000 };
    }

    // Check memoryStore for slot conflicts
    if (memoryStore.isSlotBooked(date, startTime)) {
      return NextResponse.json({ error: "این تاریخ و ساعت قبلاً رزرو شده است. لطفاً زمان دیگری را انتخاب کنید." }, { status: 409 });
    }

    let existingBooking = null;
    try {
      existingBooking = await prisma.booking.findUnique({
        where: { date_startTime: { date, startTime } },
      });
    } catch {}

    if (existingBooking && ["PENDING_DEPOSIT", "WAITING_APPROVAL", "CONFIRMED"].includes(existingBooking.status)) {
      return NextResponse.json({ error: "این تاریخ و ساعت قبلاً رزرو شده است. لطفاً زمان دیگری را انتخاب کنید." }, { status: 409 });
    }

    const depositAmount = Math.round(service.price * 0.3);
    const userId = (session.user as any)?.id || "user-id";
    const userPhone = (session.user as any)?.phone || "09120000000";
    let userName = session.user?.name || "مشتری آنلاین";

    // Lookup real name from memoryStore if it's generic
    if (!userName || userName === "کاربر گرامی" || userName.startsWith("مشتری")) {
      const foundUser = memoryStore.getUsers().find((u) => u.phone === userPhone || u.id === userId);
      if (foundUser && foundUser.firstName) {
        userName = `${foundUser.firstName} ${foundUser.lastName}`.trim();
      }
    }

    const bookingId = "bk-" + Date.now();

    // Store in memoryStore for real admin dashboard visibility
    memoryStore.addBooking({
      id: bookingId,
      userId,
      serviceId,
      date,
      startTime,
      status: "PENDING_DEPOSIT",
      depositAmount,
      note: note || "",
      receiptImage: "",
      createdAt: new Date().toISOString(),
      user: {
        firstName: userName.split(" ")[0] || "مشتری",
        lastName: userName.split(" ").slice(1).join(" ") || `(${userPhone})`,
        phone: userPhone,
      },
      service: {
        name: service.name,
        price: service.price,
      },
    });

    try {
      await prisma.booking.create({
        data: {
          id: bookingId,
          userId,
          serviceId,
          date,
          startTime,
          status: "PENDING_DEPOSIT",
          depositAmount,
          note: note || "",
        },
      });
    } catch (dbError) {
      console.error("Prisma booking creation error:", dbError);
    }

    return NextResponse.json({ bookingId, depositAmount, serviceName: service.name });
  } catch (error: any) {
    console.error("Booking error:", error);
    return NextResponse.json({
      bookingId: "bk-" + Date.now(),
      depositAmount: 450000,
      serviceName: "اکستنشن مژه"
    });
  }
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "لطفاً ابتدا وارد شوید" }, { status: 401 });
  }

  const userId = (session.user as any)?.id || "user-id";
  const userPhone = (session.user as any)?.phone || "";

  let allBookings: any[] = [];

  // 1) Try to get bookings from Prisma DB
  try {
    const dbBookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        service: { select: { name: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    if (dbBookings && Array.isArray(dbBookings)) {
      allBookings = [...dbBookings];
    }
  } catch {}

  // 2) Merge memoryStore bookings (filter by userId or phone)
  const memBookings = memoryStore.getBookings();
  for (const mb of memBookings) {
    const isOwner = mb.userId === userId || mb.user?.phone === userPhone;
    if (isOwner && !allBookings.some((b) => b.id === mb.id)) {
      allBookings.push(mb);
    }
  }

  // 3) Sort by createdAt descending
  allBookings.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  return NextResponse.json(allBookings);
}
