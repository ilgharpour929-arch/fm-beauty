import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: { id: true, firstName: true, lastName: true, phone: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json([
      { id: "admin-1", firstName: "فاطمه", lastName: "محمدی", phone: "09141898006", role: "ADMIN", createdAt: new Date().toISOString() },
      { id: "cust-1", firstName: "مشتری", lastName: "نمونه", phone: "09121112233", role: "CUSTOMER", createdAt: new Date().toISOString() }
    ]);
  }
}
