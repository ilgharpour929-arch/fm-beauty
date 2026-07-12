"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Settings {
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  instagram: string;
  telegram: string;
  whatsapp: string;
}

export function Footer() {
  const [settings, setSettings] = useState<Settings>({
    phone: "",
    email: "",
    address: "",
    workingHours: "همه روزه از ۹ صبح تا ۸ شب",
    instagram: "",
    telegram: "",
    whatsapp: "",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.phone || data.email || data.address) setSettings(data);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="border-t border-[var(--color-border-light)] px-6 py-16 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <span className="font-display text-lg font-semibold text-[var(--color-fg)] block mb-4">FM Beauty</span>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed">
            سالن زیبایی حرفه‌ای با خدمات تخصصی اکستنشن مژه، لیفت و لمینیت. تجربه‌ای لوکس و مدرن.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold tracking-[0.06em] uppercase text-[var(--color-fg)] mb-4 font-sans">دسترسی سریع</h4>
          <div className="flex flex-col gap-2 text-sm text-[var(--color-muted)]">
            <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">صفحه اصلی</Link>
            <Link href="/services" className="hover:text-[var(--color-accent)] transition-colors">خدمات</Link>
            <Link href="/booking" className="hover:text-[var(--color-accent)] transition-colors">رزرو آنلاین</Link>
            <Link href="/about" className="hover:text-[var(--color-accent)] transition-colors">درباره ما</Link>
            <Link href="/contact" className="hover:text-[var(--color-accent)] transition-colors">تماس با ما</Link>
            <Link href="/faq" className="hover:text-[var(--color-accent)] transition-colors">سوالات متداول</Link>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold tracking-[0.06em] uppercase text-[var(--color-fg)] mb-4 font-sans">حساب کاربری</h4>
          <div className="flex flex-col gap-2 text-sm text-[var(--color-muted)]">
            <Link href="/api/auth/signin" className="hover:text-[var(--color-accent)] transition-colors">ورود</Link>
            <Link href="/api/auth/signin" className="hover:text-[var(--color-accent)] transition-colors">ثبت نام</Link>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold tracking-[0.06em] uppercase text-[var(--color-fg)] mb-4 font-sans">اطلاعات تماس</h4>
          <div className="space-y-2 text-sm text-[var(--color-muted)]">
            {settings.phone && <p>📞 {settings.phone}</p>}
            {settings.email && <p>✉️ {settings.email}</p>}
            {settings.address && <p>📍 {settings.address}</p>}
            <p>⏰ {settings.workingHours}</p>
          </div>
          {(settings.instagram || settings.telegram || settings.whatsapp) && (
            <div className="flex gap-3 mt-4">
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors text-lg">
                  📷
                </a>
              )}
              {settings.telegram && (
                <a href={settings.telegram} target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors text-lg">
                  ✈️
                </a>
              )}
              {settings.whatsapp && (
                <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors text-lg">
                  💬
                </a>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[var(--color-border-light)] flex flex-wrap justify-between items-center gap-4">
        <p className="text-xs text-[var(--color-muted)]">© 2026 FM Beauty. تمامی حقوق محفوظ است.</p>
      </div>
    </footer>
  );
}