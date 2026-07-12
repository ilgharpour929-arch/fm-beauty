import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "صفحه اصلی | سالن زیبایی تخصصی مژه",
  description: "اکستنشن مژه والیوم، اسپایکی، نچرال، لیفت مژه و لیفت ابرو با بهترین کیفیت در تهران | رزرو آنلاین نوبت",
};

const STATIC_SERVICES = [
  { id: "volume", name: "اکستنشن مژه والیوم", description: "مژه‌های حجیم و پرپشت با تکنیک والیوم", price: 1800000, duration: 90 },
  { id: "spiky", name: "اکستنشن مژه اسپایکی", description: "مژه‌های فرچه‌ای با ظاهری جذاب و چشمگیر", price: 1500000, duration: 90 },
  { id: "natural", name: "اکستنشن مژه نچرال", description: "مژه‌های طبیعی و ظریف برای روزمره", price: 1100000, duration: 90 },
  { id: "repair", name: "ترمیم مژه", description: "ترمیم مژه‌های قبلی (نیاز به هماهنگی)", price: 1500000, duration: 90 },
  { id: "lash-lift", name: "لیفت مژه و لمینیت", description: "فر طبیعی و ماندگار مژه‌ها بدون اکستنشن", price: 1200000, duration: 90 },
  { id: "brow-lift", name: "لیفت ابرو", description: "مرتب‌سازی و فرم‌دهی ابروها", price: 1200000, duration: 90 },
];

async function getServices() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { price: "desc" },
    });
    if (services.length > 0) return services;
  } catch {}
  return STATIC_SERVICES;
}

function getServiceImage(name: string): string {
  const map: Record<string, string> = {
    "والیوم": "/images/gallery/valyum.jpg",
    "اسپایکی": "/images/gallery/spayki.jpg",
    "نچرال": "/images/services/nacral.jpg",
    "لیفت مژه": "/images/services/lift-moje.jpg",
    "لیفت ابرو": "/images/services/lift-abru.jpg",
    "ترمیم": "/images/gallery/nemune-1.jpg",
  };
  for (const [key, value] of Object.entries(map)) {
    if (name.includes(key)) return value;
  }
  return "/images/gallery/nemune-1.jpg";
}

export default async function HomePage() {
  const services = await getServices();

  return (
    <div>
      {/* Hero */}
      <section className="min-h-screen flex items-center px-6 pt-32 pb-20 relative">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 text-xs text-[var(--color-accent)] mb-6">
            ✨ سالن زیبایی حرفه‌ای
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-[-0.02em] mb-6">
            زیبایی تو،<br />هنر ماست
          </h1>
          <p className="text-lg text-[var(--color-muted)] max-w-lg leading-relaxed mb-8">
            خدمات تخصصی اکستنشن مژه، لیفت و لمینیت با بالاترین کیفیت. رزرو آنلاین، پرداخت آسان، تجربه‌ای لوکس.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/booking" className="btn-primary text-lg px-10 py-3.5">
              رزرو آنلاین
            </Link>
          </div>
          <p className="text-sm text-[var(--color-muted)] mt-4">توسط فاطمه محمدی — بیش از ۵ سال تجربه حرفه‌ای</p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-accent)] mb-4 font-sans">خدمات تخصصی</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">خدمات ما</h2>
            <p className="text-[var(--color-muted)] max-w-xl mx-auto">تمام خدمات با دقت و ظرافت توسط فاطمه محمدی انجام می‌شود. هر جلسه ۹۰ دقیقه.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="glass-card overflow-hidden group hover:-translate-y-1 transition-all duration-350">
                <div className="relative h-48 overflow-hidden">
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
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: "۵+", label: "سال تجربه" },
            { num: "۵۰۰+", label: "مشتریان راضی" },
            { num: "۱۰+", label: "خدمات تخصصی" },
            { num: "۹۸%", label: "رضایت مشتریان" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-8 text-center">
              <div className="font-display text-4xl font-bold bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-3)] bg-clip-text text-transparent">
                {stat.num}
              </div>
              <div className="text-sm text-[var(--color-muted)] mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="glass-card max-w-xl mx-auto p-12 md:p-16">
          <span className="inline-block text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-accent)] mb-4 font-sans">همین حالا رزرو کن</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">آماده تغییر هستی؟</h2>
          <p className="text-[var(--color-muted)] mb-8 max-w-md mx-auto">
            یک جلسه ۹۰ دقیقه‌ای می‌تواند همه چیز را تغییر دهد. همین امروز وقت خود را رزرو کنید.
          </p>
          <Link href="/booking" className="btn-primary text-lg px-10 py-3.5">
            رزرو آنلاین
          </Link>
        </div>
      </section>
    </div>
  );
}