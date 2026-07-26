import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "درباره ما",
  description: "آشنایی با FM Beauty و فاطمه محمدی. بیش از ۵ سال تجربه در اکستنشن مژه، لیفت و لمینیت.",
};

const values = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "دقت و ظرافت",
    desc: "هر مژه با دقت میلی‌متری و با ظرافت کامل نصب می‌شود. نتیجه نهایی طبیعی و زیباست."
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "کیفیت و بهداشت",
    desc: "استفاده از بهترین مواد و رعایت کامل پروتکل‌های بهداشتی برای سلامت شما."
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "تعهد و اعتماد",
    desc: "رضایت شما اولویت ماست. ما تا اطمینان از نتیجه عالی، کار را تحویل نمی‌دهیم."
  },
];

export default function AboutPage() {
  return (
    <div className="pt-24 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Link href="/" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">← بازگشت به صفحه اصلی</Link>
          <span className="block text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-accent)] mt-4 mb-4 font-sans">داستان ما</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">درباره FM Beauty</h1>
          <p className="text-[var(--color-muted)] max-w-xl mx-auto">آشنایی با تیم حرفه‌ای و فلسفه زیبایی ما</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="glass-card p-8 md:p-12 flex items-center justify-center min-h-[300px]">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="var(--color-accent)" strokeWidth="1.5">
              <circle cx="40" cy="40" r="36" strokeDasharray="4 4" />
              <path d="M28 44l6-8 6 6 8-12 6 10" />
              <path d="M20 40c0-11 9-20 20-20s20 9 20 20" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">فلسفه زیبایی ما</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">در FM Beauty، ما معتقدیم زیبایی واقعی در جزئیات نهفته است. هر مشتری برای ما منحصر به فرد است و ما با دقت و عشق، بهترین خدمات را ارائه می‌دهیم.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold mb-4">فاطمه محمدی — بنیانگذار</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">فاطمه محمدی با بیش از ۵ سال تجربه در زمینه زیبایی، تخصص خود را در اکستنشن مژه، لیفت و لمینیت به اثبات رسانده است. او با بهره‌گیری از جدیدترین تکنیک‌ها و مواد با کیفیت، تضمین‌کننده بهترین نتیجه برای مشتریان خود است.</p>
          </div>
          <div className="order-1 md:order-2 glass-card overflow-hidden min-h-[300px] relative">
            <Image
              src="/images/gallery/tarh.jpg"
              alt="فاطمه محمدی — بنیانگذار FM Beauty"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div key={v.title} className="glass-card p-8 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)]">
                {v.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-[var(--color-muted)]">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
