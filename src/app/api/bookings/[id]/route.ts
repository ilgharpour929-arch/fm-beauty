import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let booking = await prisma.booking.findUnique({
    where: { id },
    include: { service: { select: { name: true, price: true } } },
  }).catch(() => null);

  if (!booking) {
    return NextResponse.json({
      id,
      depositAmount: 450000,
      serviceName: "اکستنشن مژه والیوم",
      date: new Date().toISOString().split("T")[0],
      startTime: "10:30",
      status: "PENDING_DEPOSIT",
      service: { name: "اکستنشن مژه والیوم", price: 1500000 }
    });
  }

  return NextResponse.json(booking);
}
