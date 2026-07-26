import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { memoryStore } from "@/lib/store";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dbBookings = await prisma.booking.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, phone: true } },
        service: { select: { name: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    if (dbBookings && dbBookings.length > 0) return NextResponse.json(dbBookings);
  } catch {}

  const memBookings = memoryStore.getBookings();
  return NextResponse.json(memBookings);
}
