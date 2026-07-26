"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as any;

  const [cardNumber, setCardNumber] = useState("6037-7591-1234-5678");
  const [accountHolder, setAccountHolder] = useState("فاطمه محمدی");
  const [bank, setBank] = useState("بانک ملی");
  const [shaba, setShaba] = useState("IR120170000000123456789012");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && user?.role !== "ADMIN") router.push("/");
    
    // Load from localStorage if present
    const savedCard = localStorage.getItem("bank_cardNumber");
    const savedHolder = localStorage.getItem("bank_accountHolder");
    const savedBank = localStorage.getItem("bank_name");
    const savedShaba = localStorage.getItem("bank_shaba");

    if (savedCard) setCardNumber(savedCard);
    if (savedHolder) setAccountHolder(savedHolder);
    if (savedBank) setBank(savedBank);
    if (savedShaba) setShaba(savedShaba);
  }, [status, user, router]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("bank_cardNumber", cardNumber);
    localStorage.setItem("bank_accountHolder", accountHolder);
    localStorage.setItem("bank_name", bank);
    localStorage.setItem("bank_shaba", shaba);

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (status === "loading") return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-[var(--color-muted)]">در حال بارگذاری...</p></div>;
  if (user?.role !== "ADMIN") return null;

  return (
    <div className="min-h-screen px-4 py-8 pt-24">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-fg)]">تنظیمات اطلاعات کارت و پرداخت</h1>
            <p className="text-sm text-[var(--color-muted)]">تغییر شماره کارت، شبا و بانک مقصد جهت واریز پیش‌پرداخت</p>
          </div>
          <Link href="/admin" className="btn-ghost text-xs py-2 px-4">
            ← بازگشت به پنل
          </Link>
        </div>

        <div className="glass-card p-6 md:p-8">
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm text-[var(--color-muted)] mb-1.5">شماره کارت (۱۶ رقمی)</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="input-field font-mono"
                dir="ltr"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--color-muted)] mb-1.5">نام صاحب کارت</label>
              <input
                type="text"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--color-muted)] mb-1.5">نام بانک</label>
                <input
                  type="text"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--color-muted)] mb-1.5">شماره شبا (اختیاری)</label>
                <input
                  type="text"
                  value={shaba}
                  onChange={(e) => setShaba(e.target.value)}
                  className="input-field font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            {saved && (
              <div className="p-3 rounded-lg bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/30 text-sm text-center">
                ✓ اطلاعات پرداخت با موفقیت بروزرسانی شد
              </div>
            )}

            <button type="submit" className="btn-primary w-full cursor-pointer">
              ذخیره تغییرات کارت
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
