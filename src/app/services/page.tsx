import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "خدمات",
  description: "مشاهده خدمات تخصصی FM Beauty: اکستنشن مژه والیوم، اسپایکی، نچرال، لیفت و لمینیت",
};

async function getServices() {
  try {
    return await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { price: "desc" },
    });
  } catch { return []; }
}

function getServiceImage(name: string): string {
  const map: Record<string, string> = {
    "والیوم": "/images/gallery/valyum.jpg",
    "اسپایکی": "/images/gallery/spayki.jpg",
    "نچرال": "/images/services/nacral.jpg",
    "لیفت مژه": "/images/services/lift-moje.jpg",
    "لیفت ابرو": "/images/services/lift-abru.jpg",
  };
  for (const [key, value] of Object.entries(map)) {
    if (name.includes(key)) return value;
  }
  return "/images/gallery/nemune-1.jpg";
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="pt-24 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Link href="/" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">← بازگشت به صفحه اصلی</Link>
          <span className="block text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-accent)] mt-4 mb-4 font-sans">خدمات تخصصی</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">خدمات FM Beauty</h1>
          <p className="text-[var(--color-muted)] max-w-xl mx-auto">تمام خدمات توسط فاطمه محمدی انجام می‌شود. هر جلسه ۹۰ دقیقه.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="glass-card overflow-hidden group hover:-translate-y-1 transition-all duration-350">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={getServiceImage(service.name)}
                  alt={service.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/30 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-sm text-[var(--color-muted)] mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-semibold text-[var(--color-accent)]">
                    {service.price.toLocaleString("fa-IR")} تومان
                  </span>
                  <span className="text-xs text-[var(--color-muted)]/70">{service.duration} دقیقه</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[var(--color-muted)]">در حال بارگذاری خدمات...</p>
          </div>
        )}
      </div>
    </div>
  );
}