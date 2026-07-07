import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { reason } = await request.json();

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      status: "REJECTED",
      adminNote: reason || "تأیید نشد",
    },
  });

  return NextResponse.json(booking);
}
