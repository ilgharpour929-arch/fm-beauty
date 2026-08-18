import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { memoryStore } from "@/lib/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let booking: any = await prisma.booking.findUnique({
    where: { id },
    include: { service: { select: { name: true, price: true } } },
  }).catch(() => null);

  if (!booking) {
    const memBooking = memoryStore.getBookings().find((b) => b.id === id);
    if (memBooking) {
      booking = memBooking;
    }
  }

  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const userId = (session.user as any).id;
  const role = (session.user as any).role;
  if (role !== "ADMIN" && booking.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(booking);
}
