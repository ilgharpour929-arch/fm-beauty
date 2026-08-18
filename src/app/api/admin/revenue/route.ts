import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { memoryStore } from "@/lib/store";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let confirmed: any[] = [];
  try {
    confirmed = await prisma.booking.findMany({
      where: { status: "CONFIRMED" },
      select: { id: true, depositAmount: true },
    });
  } catch {}

  const memConfirmed = memoryStore.getBookings().filter((b) => b.status === "CONFIRMED");
  for (const mb of memConfirmed) {
    if (!confirmed.some((b) => b.id === mb.id)) {
      confirmed.push(mb);
    }
  }

  const totalRevenue = confirmed.reduce((sum, b) => sum + (b.depositAmount || 0), 0);

  return NextResponse.json({ totalRevenue, bookingCount: confirmed.length });
}
