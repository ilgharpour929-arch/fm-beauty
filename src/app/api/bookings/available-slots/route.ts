import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "تاریخ مورد نیاز است" }, { status: 400 });
  }

  try {
    const blockedDate = await prisma.blockedDate.findUnique({ where: { date } });
    if (blockedDate) {
      return NextResponse.json([]);
    }

    const bookedSlots = await prisma.booking.findMany({
      where: {
        date,
        status: { in: ["WAITING_APPROVAL", "CONFIRMED"] },
      },
      select: { startTime: true },
    });

    const bookedTimes = new Set(bookedSlots.map((b) => b.startTime));

    const allSlots: { start: string; end: string; label: string }[] = [];
    for (let h = 9; h < 20; h++) {
      const start = `${h.toString().padStart(2, "0")}:00`;
      const endH = h + 1;
      const end = `${endH.toString().padStart(2, "0")}:30`;
      allSlots.push({ start, end, label: `${start} - ${end}` });
    }

    const available = allSlots.filter((s) => !bookedTimes.has(s.start));
    return NextResponse.json(available);
  } catch {
    return NextResponse.json({ error: "خطا در دریافت اسلات‌ها" }, { status: 500 });
  }
}
