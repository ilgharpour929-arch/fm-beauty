import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { memoryStore } from "@/lib/store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let reason = "تأیید نشد";
  try {
    const body = await request.json();
    if (body.reason) reason = body.reason;
  } catch {}

  memoryStore.updateBookingStatus(id, "REJECTED");

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: "REJECTED",
        adminNote: reason,
      },
    });
    return NextResponse.json(booking);
  } catch {
    return NextResponse.json({ error: "Failed to reject" }, { status: 500 });
  }
}
