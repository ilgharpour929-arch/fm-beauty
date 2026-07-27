import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { memoryStore } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let allBookings: any[] = [];
  try {
    const dbBookings = await prisma.booking.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, phone: true } },
        service: { select: { name: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    if (dbBookings && Array.isArray(dbBookings)) {
      allBookings = [...dbBookings];
    }
  } catch {}

  const memBookings = memoryStore.getBookings();
  for (const mb of memBookings) {
    if (!allBookings.some((b) => b.id === mb.id)) {
      allBookings.push(mb);
    }
  }

  // Enrich user names from memoryStore if missing or generic
  const users = memoryStore.getUsers();
  const enriched = allBookings.map((b) => {
    const phone = b.user?.phone || b.userId?.replace("user-", "");
    if (!b.user || !b.user.firstName || b.user.firstName === "کاربر" || b.user.firstName === "مشتری") {
      const foundUser = users.find((u) => u.phone === phone || u.id === b.userId);
      if (foundUser) {
        return {
          ...b,
          user: {
            ...b.user,
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            phone: foundUser.phone || phone,
          },
        };
      }
    }
    return b;
  });

  return NextResponse.json(enriched);
}
