import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { memoryStore } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, description, price, duration, image } = await request.json();
  const id = "service-" + Date.now();
  const newService = {
    id,
    name: name || "خدمت جدید",
    description: description || "توضیحات خدمت",
    price: Number(price) || 1000000,
    duration: Number(duration) || 90,
    image: image || "/images/gallery/nemune-1.jpg",
  };

  memoryStore.addService(newService);

  try {
    await prisma.service.create({
      data: {
        id,
        name: newService.name,
        description: newService.description,
        price: newService.price,
        duration: newService.duration,
        image: newService.image,
        isActive: true,
      },
    });
  } catch {}

  return NextResponse.json({ success: true, service: newService });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  memoryStore.removeService(id);

  try {
    await prisma.service.delete({ where: { id } });
  } catch {}

  return NextResponse.json({ success: true });
}
