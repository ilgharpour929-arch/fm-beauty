"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  { q: "مدت زمان هر جلسه چقدر است؟", a: "تمام جلسات خدمات ما دقیقاً ۹۰ دقیقه زمان نیاز دارند. این زمان شامل مشاوره اولیه، انجام خدمت و بررسی نهایی می‌شود." },
  { q: "چگونه می‌توانم رزرو کنم؟", a: "از طریق صفحه رزرو آنلاین می‌توانید خدمت مورد نظر خود را انتخاب کنید، زمان مناسب را انتخاب کنید و پس از پرداخت، رزرو خود را نهایی کنید." },
  { q: "روش‌های پرداخت چیست؟", a: "پرداخت به صورت کارت‌به‌کارت انجام می‌شود. پس از انتخاب خدمت و زمان، اطلاعات کارت مقصد نمایش داده می‌شود. پس از واریز، باید تصویر رسید را بارگذاری کنید." },
  { q: "آیا رزرو بدون تأیید مدیر معتبر است؟", a: "خیر. رزرو بدون تأیید مدیر معتبر نیست. پس از ثبت درخواست و بارگذاری رسید، رزرو شما در وضعیت \"در انتظار تأیید\" قرار می‌گیرد." },
  { q: "مدت ماندگاری اکستنشن مژه چقدر است؟", a: "با مراقبت صحیح، اکستنشن مژه بین ۳ تا ۴ هفته ماندگاری دارد. برای حفظ ظاهر مطلوب، توصیه می‌شود هر ۲ تا ۳ هفته ترمیم انجام دهید." },
  { q: "آیا امکان لغو رزرو وجود دارد؟", a: "بله، امکان لغو رزرو وجود دارد. اما توجه داشته باشید که در صورت لغو، هزینه پرداختی به هیچ عنوان بازگردانده نمی‌شود." },
  { q: "آیا می‌توانم زمان رزرو خود را تغییر دهم؟", a: "بله، از طریق پنل مشتری می‌توانید درخواست تغییر زمان رزرو خود را ثبت کنید." },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="pt-24 px-6 pb-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <Link href="/" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">← بازگشت به صفحه اصلی</Link>
          <span className="block text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-accent)] mt-4 mb-4 font-sans">راهنما</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">سوالات متداول</h1>
          <p className="text-[var(--color-muted)] max-w-xl mx-auto">پاسخ به پرتکرارترین سوالات شما</p>
        </div>

        <div className="glass-card p-6 md:p-8">
          {faqs.map((faq, i) => (
            <div key={i} className={`border-b border-[var(--color-border-light)] ${i === faqs.length - 1 ? "border-b-0" : ""}`}>
              <button
                className="flex justify-between items-center w-full py-4 text-right gap-4 bg-transparent border-none cursor-pointer"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <h3 className="text-base font-medium text-[var(--color-fg)]">{faq.q}</h3>
                <span className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-[var(--color-card-solid)] border border-[var(--color-border)] text-sm transition-all duration-300 ${openIndex === i ? "bg-[var(--color-accent)] text-[var(--color-bg)] rotate-45" : "text-[var(--color-muted)]"}`}>+</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? "max-h-60 pb-4" : "max-h-0"}`}>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}