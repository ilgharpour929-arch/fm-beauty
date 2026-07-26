import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: "ارتباط با FM Beauty. آدرس، شماره تماس، ساعت کاری و فرم ارسال پیام.",
};

const contactItems = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 6-9 13-9 13s-9-7-9-13a4 4 0 0 1 4-4c2.22 0 3 1.6 5 1.6s2.78-1.6 5-1.6a4 4 0 0 1 4 4z" />
      </svg>
    ),
    title: "آدرس",
    desc: "ارومیه — محل دقیق سالن پس از رزرو با تماس تلفنی اطلاع داده خواهد شد"
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.28-1.28a2 2 0 0 1 2.11-.45c.9.34 1.84.58 2.8.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    title: "تلفن تماس",
    desc: "۰۹۱۴۱۸۹۸۰۰۶"
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    title: "ایمیل",
    desc: "info@fmbeauty.ir"
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
    ),
    title: "ساعت کاری",
    desc: "همه روزه از ۹ صبح تا ۸ شب"
  },
];

export default function ContactPage() {
  return (
    <div className="pt-24 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Link href="/" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">← بازگشت به صفحه اصلی</Link>
          <span className="block text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-accent)] mt-4 mb-4 font-sans">ارتباط با ما</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">تماس با ما</h1>
          <p className="text-[var(--color-muted)] max-w-xl mx-auto">خوشحال می‌شویم نظرات و سوالات شما را بشنویم.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            {contactItems.map((info) => (
              <div key={info.title} className="glass-card p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] flex-shrink-0">
                  {info.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{info.title}</h3>
                  <p className="text-sm text-[var(--color-muted)]">{info.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card p-8">
            <h3 className="text-xl font-semibold mb-6">ارسال پیام</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
