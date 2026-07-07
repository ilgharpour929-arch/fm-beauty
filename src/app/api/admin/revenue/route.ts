import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const confirmed = await prisma.booking.findMany({
    where: { status: "CONFIRMED" },
    select: { depositAmount: true },
  });

  const totalRevenue = confirmed.reduce((sum, b) => sum + b.depositAmount, 0);

  return NextResponse.json({ totalRevenue, bookingCount: confirmed.length });
}
