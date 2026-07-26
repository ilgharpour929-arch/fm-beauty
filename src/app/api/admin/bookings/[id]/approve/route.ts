import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { memoryStore } from "@/lib/store";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  memoryStore.updateBookingStatus(id, "CONFIRMED");

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status: "CONFIRMED" },
    });
    return NextResponse.json(booking);
  } catch {
    return NextResponse.json({ success: true, status: "CONFIRMED" });
  }
}
