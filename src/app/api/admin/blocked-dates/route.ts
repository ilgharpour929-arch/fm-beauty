import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const blockedDates = await prisma.blockedDate.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json(blockedDates);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { date, reason } = await request.json();
  const blocked = await prisma.blockedDate.create({ data: { date, reason: reason || "" } });
  return NextResponse.json(blocked);
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { date } = await request.json();
  await prisma.blockedDate.delete({ where: { date } });
  return NextResponse.json({ success: true });
}
