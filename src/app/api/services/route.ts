import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { price: "desc" },
    });
    return NextResponse.json(services);
  } catch {
    return NextResponse.json({ error: "خطا در دریافت خدمات" }, { status: 500 });
  }
}
