import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { memoryStore } from "@/lib/store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let reason = "لغو توسط مشتری";
  try {
    const body = await request.json();
    if (body.reason) reason = body.reason;
  } catch {}

  let booking: any = await prisma.booking.findUnique({ where: { id } }).catch(() => null);
  if (!booking) {
    booking = memoryStore.getBookings().find((b) => b.id === id);
  }

  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (booking.userId !== (session.user as any).id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const validStatuses = ["PENDING_DEPOSIT", "WAITING_APPROVAL", "CONFIRMED"];
  if (!validStatuses.includes(booking.status)) {
    return NextResponse.json({ error: "Booking cannot be cancelled" }, { status: 400 });
  }

  try {
    await prisma.booking.update({
      where: { id },
      data: {
        status: "CANCELLED",
        cancellationReason: reason,
      },
    });
  } catch {}

  memoryStore.updateBookingStatus(id, "CANCELLED");

  return NextResponse.json({ success: true, status: "CANCELLED" });
}
