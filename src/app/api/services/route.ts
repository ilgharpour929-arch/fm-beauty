import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FALLBACK_SERVICES = [
  { id: "volume", name: "اکستنشن مژه والیوم", description: "مژه‌های حجیم و پرپشت با تکنیک والیوم", price: 1800000, duration: 90, image: "/images/gallery/valyum.jpg", isActive: true },
  { id: "spiky", name: "اکستنشن مژه اسپایکی", description: "مژه‌های فرچه‌ای با ظاهری جذاب و چشمگیر", price: 1500000, duration: 90, image: "/images/gallery/spayki.jpg", isActive: true },
  { id: "natural", name: "اکستنشن مژه نچرال", description: "مژه‌های طبیعی و ظریف برای روزمره", price: 1100000, duration: 90, image: "/images/services/nacral.jpg", isActive: true },
  { id: "repair", name: "ترمیم مژه", description: "ترمیم مژه‌های قبلی (نیاز به هماهنگی)", price: 1500000, duration: 90, image: "/images/gallery/nemune-1.jpg", isActive: true },
  { id: "lash-lift", name: "لیفت مژه و لمینیت", description: "فر طبیعی و ماندگار مژه‌ها بدون اکستنشن", price: 1200000, duration: 90, image: "/images/services/lift-moje.jpg", isActive: true },
  { id: "brow-lift", name: "لیفت ابرو", description: "مرتب‌سازی و فرم‌دهی ابروها", price: 1200000, duration: 90, image: "/images/services/lift-abru.jpg", isActive: true },
];

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { price: "desc" },
    });
    if (services && services.length > 0) {
      return NextResponse.json(services);
    }
    return NextResponse.json(FALLBACK_SERVICES);
  } catch (error) {
    console.error("Error in GET /api/services:", error);
    return NextResponse.json(FALLBACK_SERVICES);
  }
}
