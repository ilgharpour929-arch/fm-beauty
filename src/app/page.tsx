import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "صفحه اصلی | سالن زیبایی تخصصی مژه",
  description:
    "اکستنشن مژه والیوم، اسپایکی، نچرال، لیفت مژه و لیفت ابرو با بهترین کیفیت و مواد اولیه درجه یک در تهران | رزرو آنلاین نوبت",
  openGraph: {
    title: "FM Beauty | سالن زیبایی تخصصی مژه فاطمه محمدی",
    description:
      "اکستنشن مژه والیوم، اسپایکی، نچرال، لیفت مژه و لیفت ابرو با بهترین کیفیت",
    url: "https://fmbeauty.ir",
  },
};

async function getServices() {
  try {
    return await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { price: "desc" },
    });
  } catch {
    return [];
  }
}

const galleryImages = [
  "/images/gallery/placeholder1.svg",
  "/images/gallery/placeholder2.svg",
  "/images/gallery/placeholder3.svg",
  "/images/gallery/placeholder4.svg",
  "/images/gallery/placeholder5.svg",
  "/images/gallery/placeholder6.svg",
];

export default async function HomePage() {
  const services = await getServices();

  return (
    <div>
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900" />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(212, 168, 83, 0.08) 0%, transparent 70%)",
        }} />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="animate-float-up mb-6">
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
              <defs>
                <linearGradient id="heroLogo" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d4a853" />
                  <stop offset="100%" stopColor="#b8923e" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" stroke="url(#heroLogo)" strokeWidth="1.5" fill="rgba(212,168,83,0.05)" />
              <text x="50" y="62" textAnchor="middle" fontFamily="Georgia,serif" fontSize="42" fontWeight="bold" fill="url(#heroLogo)" letterSpacing="2">
                FM
              </text>
            </svg>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-float-up" style={{ animationDelay: "0.1s" }}>
            <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              FM Beauty
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-cream/70 mb-3 animate-float-up" style={{ animationDelay: "0.2s" }}>
            سالن زیبایی تخصصی مژه
          </p>
          <p className="text-base text-cream/50 mb-8 animate-float-up" style={{ animationDelay: "0.3s" }}>
            فاطمه محمدی | با بیش از ۵ سال تجربه درخشان
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-float-up" style={{ animationDelay: "0.4s" }}>
            <Link href="/booking" className="btn-primary text-lg px-8 py-3">
              رزرو نوبت
            </Link>
            <Link href="#services" className="btn-outline text-lg px-8 py-3">
              مشاهده خدمات
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-900 to-transparent" />
      </section>

      <section id="services" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-cream mb-3">خدمات ما</h2>
            <p className="text-cream/50">با بهترین کیفیت و مواد اولیه درجه یک</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="glass-card overflow-hidden group hover:border-gold/30 transition-all duration-300 hover:shadow-lg hover:shadow-gold/5"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-cream mb-2">{service.name}</h3>
                  <p className="text-sm text-cream/50 mb-4">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gold font-bold text-lg">{service.price.toLocaleString("fa-IR")} تومان</span>
                    <span className="text-xs text-cream/40">مدت: {service.duration} دقیقه</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-dark-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-cream mb-3">نمونه کارها</h2>
            <p className="text-cream/50">گالری نمونه کارهای انجام شده</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((src, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-2xl overflow-hidden group glass-card-borderless"
              >
                <Image
                  src={src}
                  alt={`نمونه کار ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-dark-900/0 group-hover:bg-dark-900/40 transition-all duration-300 flex items-center justify-center">
                  <span className="text-cream opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                    مشاهده
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-cream mb-6">همین حالا نوبت بگیرید</h2>
          <p className="text-cream/50 mb-8 max-w-xl mx-auto">
            خدمات ما دقیقاً ۹۰ دقیقه زمان می‌برند. کافی است تاریخ و ساعت مورد نظر خود را انتخاب کنید.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="glass-card p-6">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3 className="font-medium text-cream mb-1">فقط ۹۰ دقیقه</h3>
              <p className="text-xs text-cream/40">مدت زمان تمام خدمات</p>
            </div>
            <div className="glass-card p-6">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="font-medium text-cream mb-1">ضمانت کیفیت</h3>
              <p className="text-xs text-cream/40">با بهترین مواد اولیه</p>
            </div>
            <div className="glass-card p-6">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <h3 className="font-medium text-cream mb-1">تک‌نفره</h3>
              <p className="text-xs text-cream/40">توجه شخصی به هر مشتری</p>
            </div>
          </div>
          <Link href="/booking" className="btn-primary text-lg px-10 py-3">
            رزرو نوبت آنلاین
          </Link>
        </div>
      </section>
    </div>
  );
}
