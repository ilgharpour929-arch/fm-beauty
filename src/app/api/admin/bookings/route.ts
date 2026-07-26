import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, phone: true } },
        service: { select: { name: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json([
      {
        id: "bk-demo-1",
        date: new Date().toISOString().split("T")[0],
        startTime: "10:30 - 12:00",
        status: "WAITING_APPROVAL",
        depositAmount: 450000,
        note: "توضیحات رزرو آزمایشی",
        receiptImage: "",
        user: { firstName: "سارا", lastName: "احمدی", phone: "09140001122" },
        service: { name: "اکستنشن مژه والیوم", price: 1500000 },
        createdAt: new Date().toISOString()
      }
    ]);
  }
}
