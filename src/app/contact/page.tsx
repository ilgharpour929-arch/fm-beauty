"use client";

import type { Metadata } from "next";
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

export default function ContactPage() {
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
        if (data.phone || data.email) setSettings(data);
      })
      .catch(() => {});
  }, []);

  const contactItems = [
    { icon: "📍", title: "آدرس", desc: settings.address || "—" },
    { icon: "📞", title: "تلفن تماس", desc: settings.phone || "—" },
    { icon: "✉️", title: "ایمیل", desc: settings.email || "—" },
    { icon: "⏰", title: "ساعت کاری", desc: settings.workingHours },
  ];

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
              <div key={info.title} className="glass-card p-6">
                <div className="text-2xl mb-2">{info.icon}</div>
                <h3 className="font-semibold mb-1">{info.title}</h3>
                <p className="text-sm text-[var(--color-muted)]">{info.desc}</p>
              </div>
            ))}
          </div>

          <div className="glass-card p-8">
            <h3 className="text-xl font-semibold mb-6">ارسال پیام</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--color-muted)] mb-1.5">نام</label>
                  <input className="input-field" placeholder="نام شما" />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-muted)] mb-1.5">ایمیل</label>
                  <input className="input-field" type="email" placeholder="email@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[var(--color-muted)] mb-1.5">موضوع</label>
                <input className="input-field" placeholder="موضوع پیام" />
              </div>
              <div>
                <label className="block text-sm text-[var(--color-muted)] mb-1.5">پیام</label>
                <textarea className="input-field" rows={4} placeholder="پیام خود را بنویسید..." />
              </div>
              <button className="btn-primary w-full">ارسال پیام</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}