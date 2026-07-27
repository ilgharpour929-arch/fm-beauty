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
    const dbBlocked = await prisma.blockedDate.findMany({ orderBy: { date: "asc" } });
    if (dbBlocked && dbBlocked.length > 0) return NextResponse.json(dbBlocked);
  } catch {}

  const memBlocked = memoryStore.getBlockedDates();
  return NextResponse.json(memBlocked);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { date, reason } = await request.json();
  memoryStore.addBlockedDate(date, reason);

  try {
    await prisma.blockedDate.create({ data: { date, reason: reason || "" } });
  } catch {}

  return NextResponse.json({ success: true, date, reason });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { date } = await request.json();
  memoryStore.removeBlockedDate(date);

  try {
    await prisma.blockedDate.delete({ where: { date } });
  } catch {}

  return NextResponse.json({ success: true });
}
