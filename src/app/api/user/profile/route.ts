import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { firstName, lastName } = await request.json();
  const userId = (session.user as any).id;

  await prisma.user.update({
    where: { id: userId },
    data: { firstName, lastName },
  });

  return NextResponse.json({ success: true });
}
