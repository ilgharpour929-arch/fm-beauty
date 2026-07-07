import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return NextResponse.json({ error: "خدمت مورد نظر یافت نشد" }, { status: 404 });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { date_startTime: { date, startTime } },
    });
    if (existingBooking && ["WAITING_APPROVAL", "CONFIRMED"].includes(existingBooking.status)) {
      return NextResponse.json({ error: "این زمان قبلاً رزرو شده است" }, { status: 409 });
    }

    const depositAmount = Math.round(service.price * 0.3);
    const userId = (session.user as any).id;

    const booking = await prisma.booking.create({
      data: {
        userId,
        serviceId,
        date,
        startTime,
        status: "PENDING_DEPOSIT",
        depositAmount,
        note: note || "",
      },
    });

    return NextResponse.json({ bookingId: booking.id, depositAmount, serviceName: service.name });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "خطا در ایجاد رزرو" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "لطفاً ابتدا وارد شوید" }, { status: 401 });
  }

  try {
    const userId = (session.user as any).id;
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        service: { select: { name: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json({ error: "خطا در دریافت رزروها" }, { status: 500 });
  }
}
