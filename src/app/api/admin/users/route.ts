import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { memoryStore } from "@/lib/store";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dbUsers = await prisma.user.findMany({
      select: { id: true, firstName: true, lastName: true, phone: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    if (dbUsers && dbUsers.length > 0) return NextResponse.json(dbUsers);
  } catch {}

  const memUsers = memoryStore.getUsers();
  return NextResponse.json(memUsers);
}
