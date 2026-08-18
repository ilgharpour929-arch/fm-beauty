import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { memoryStore } from "@/lib/store";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "تاریخ مورد نیاز است" }, { status: 400 });
  }

  try {
    let bookedTimes = new Set<string>();

    try {
      if (memoryStore.isDateBlocked(date)) {
        return NextResponse.json([]);
      }

      const blockedDate = await prisma.blockedDate.findUnique({ where: { date } });
      if (blockedDate) {
        return NextResponse.json([]);
      }

      const bookedSlots = await prisma.booking.findMany({
        where: {
          date,
          status: { in: ["PENDING_DEPOSIT", "WAITING_APPROVAL", "CONFIRMED"] },
        },
        select: { startTime: true },
      });
      bookedSlots.forEach((b) => bookedTimes.add(b.startTime));
    } catch {}

    // Combine memoryStore booked slots
    const memBookings = memoryStore.getBookings();
    memBookings.forEach((b) => {
      if (b.date === date && ["PENDING_DEPOSIT", "WAITING_APPROVAL", "CONFIRMED"].includes(b.status)) {
        bookedTimes.add(b.startTime);
      }
    });

    const fixedSlots = [
      { start: "09:00", end: "10:30", label: "۰۹:۰۰ - ۱۰:۳۰" },
      { start: "10:30", end: "12:00", label: "۱۰:۳۰ - ۱۲:۰۰" },
      { start: "12:00", end: "13:30", label: "۱۲:۰۰ - ۱۳:۳۰" },
      { start: "13:30", end: "15:00", label: "۱۳:۳۰ - ۱۵:۰۰" },
      { start: "15:00", end: "16:30", label: "۱۵:۰۰ - ۱۶:۳۰" },
      { start: "16:30", end: "18:00", label: "۱۶:۳۰ - ۱۸:۰۰" },
      { start: "18:00", end: "19:30", label: "۱۸:۰۰ - ۱۹:۳۰" },
      { start: "19:30", end: "21:00", label: "۱۹:۳۰ - ۲۱:۰۰" },
    ];

    const available = fixedSlots.filter((s) => !bookedTimes.has(s.start));
    return NextResponse.json(available);
  } catch {
    return NextResponse.json([]);
  }
}
