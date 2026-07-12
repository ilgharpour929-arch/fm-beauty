"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Settings {
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  instagram: string;
  telegram: string;
  whatsapp: string;
}

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as any;
  const [settings, setSettings] = useState<Settings>({
    phone: "",
    email: "",
    address: "",
    workingHours: "",
    instagram: "",
    telegram: "",
    whatsapp: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && user?.role !== "ADMIN") router.push("/");
  }, [status, user, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetch("/api/admin/settings")
        .then((r) => r.json())
        .then((data) => {
          if (data.phone) setSettings(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  const handleChange = (field: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setMessage("✅ اطلاعات با موفقیت ذخیره شد");
      } else {
        setMessage("❌ خطا در ذخیره اطلاعات");
      }
    } catch {
      setMessage("❌ خطا در ارتباط با سرور");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[var(--color-muted)]">در حال بارگذاری...</p>
      </div>
    );
  }

  if (user?.role !== "ADMIN") return null;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">
            ← بازگشت به پنل مدیریت
          </Link>
          <h1 className="text-2xl font-bold mt-4">تنظیمات اطلاعات تماس</h1>
          <p className="text-[var(--color-muted)] text-sm mt-1">
            این اطلاعات در فوتر و صفحه تماس با ما نمایش داده می‌شود
          </p>
        </div>

        <div className="glass-card p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-[var(--color-muted)] mb-1.5">شماره تماس</label>
              <input
                className="input-field"
                value={settings.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--color-muted)] mb-1.5">ایمیل</label>
              <input
                className="input-field"
                value={settings.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="info@fmbeauty.ir"
                dir="ltr"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-[var(--color-muted)] mb-1.5">آدرس</label>
              <input
                className="input-field"
                value={settings.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="مثال: تهران، خیابان..."
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--color-muted)] mb-1.5">ساعت کاری</label>
              <input
                className="input-field"
                value={settings.workingHours}
                onChange={(e) => handleChange("workingHours", e.target.value)}
                placeholder="همه روزه از ۹ صبح تا ۸ شب"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--color-muted)] mb-1.5">لینک اینستاگرام</label>
              <input
                className="input-field"
                value={settings.instagram}
                onChange={(e) => handleChange("instagram", e.target.value)}
                placeholder="https://instagram.com/fmbeauty"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--color-muted)] mb-1.5">لینک تلگرام</label>
              <input
                className="input-field"
                value={settings.telegram}
                onChange={(e) => handleChange("telegram", e.target.value)}
                placeholder="https://t.me/fmbeauty"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--color-muted)] mb-1.5">لینک واتساپ</label>
              <input
                className="input-field"
                value={settings.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                placeholder="https://wa.me/98912..."
                dir="ltr"
              />
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
            {message && <span className="text-sm">{message}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}