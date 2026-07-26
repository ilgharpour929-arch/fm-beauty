"use client";

import { useState } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/30 flex items-center justify-center mx-auto mb-4 text-xl">
          ✓
        </div>
        <h4 className="text-lg font-semibold mb-2">پیام شما با موفقیت ارسال شد</h4>
        <p className="text-sm text-[var(--color-muted)]">بزودی با شما تماس خواهیم گرفت.</p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-[var(--color-muted)] mb-1.5">نام</label>
          <input className="input-field" placeholder="نام شما" required />
        </div>
        <div>
          <label className="block text-sm text-[var(--color-muted)] mb-1.5">ایمیل</label>
          <input className="input-field" type="email" placeholder="email@example.com" required />
        </div>
      </div>
      <div>
        <label className="block text-sm text-[var(--color-muted)] mb-1.5">موضوع</label>
        <input className="input-field" placeholder="موضوع پیام" required />
      </div>
      <div>
        <label className="block text-sm text-[var(--color-muted)] mb-1.5">پیام</label>
        <textarea className="input-field min-h-[120px] resize-none" rows={4} placeholder="پیام خود را بنویسید..." required />
      </div>
      <button className="btn-primary w-full" type="submit">ارسال پیام</button>
    </form>
  );
}
