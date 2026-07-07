import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const services = await prisma.service.findMany({ orderBy: { price: "desc" } });
  return NextResponse.json(services);
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, price, name, description } = await request.json();
  const service = await prisma.service.update({
    where: { id },
    data: { ...(price && { price }), ...(name && { name }), ...(description && { description }) },
  });

  return NextResponse.json(service);
}
