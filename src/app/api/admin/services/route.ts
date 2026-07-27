import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { memoryStore } from "@/lib/store";

export async function GET() {
  try {
    const dbServices = await prisma.service.findMany({ orderBy: { price: "desc" } });
    if (dbServices && dbServices.length > 0) return NextResponse.json(dbServices);
  } catch {}

  const memServices = memoryStore.getServices();
  return NextResponse.json(memServices);
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, price, name, description, image } = await request.json();
  
  memoryStore.updateService(id, {
    ...(price && { price: Number(price) }),
    ...(name && { name }),
    ...(description && { description }),
    ...(image && { image }),
  });

  try {
    await prisma.service.update({
      where: { id },
      data: { ...(price && { price: Number(price) }), ...(name && { name }), ...(description && { description }), ...(image && { image }) },
    });
  } catch {}

  return NextResponse.json({ success: true, id, price, name, description, image });
}
