import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "درباره ما",
  description: "آشنایی با FM Beauty و فاطمه محمدی. بیش از ۵ سال تجربه در اکستنشن مژه، لیفت و لمینیت.",
};

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
              <circle cx="40" cy="40" r="36" strokeDasharray="4 4"/>
              <path d="M28 44l6-8 6 6 8-12 6 10"/>
              <path d="M20 40c0-11 9-20 20-20s20 9 20 20"/>
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">فلسفه زیبایی ما</h2>
            <p className="text-[var(--color-muted)] leading-relaxed">در FM Beauty، ما معتقدیم زیبایی واقعی در جزئیات نهفته است. هر مشتری برای ما منحصر به فرد است و ما با دقت و عشق، بهترین خدمات را ارائه می‌دهیم.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "🎯", title: "دقت و ظرافت", desc: "هر مژه با دقت میلی‌متری و با ظرافت کامل نصب می‌شود." },
            { icon: "🧴", title: "کیفیت و بهداشت", desc: "استفاده از بهترین مواد و رعایت کامل پروتکل‌های بهداشتی." },
            { icon: "💝", title: "تعهد و اعتماد", desc: "رضایت شما اولویت ماست. ما تا اطمینان از نتیجه عالی، کار را تحویل نمی‌دهیم." },
          ].map((v) => (
            <div key={v.title} className="glass-card p-8 text-center">
              <div className="text-3xl mb-4">{v.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-[var(--color-muted)]">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}