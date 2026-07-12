"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FloatingOrbs } from "@/components/ui/FloatingOrbs";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("رمز عبور و تکرار آن مطابقت ندارند");
      return;
    }

    if (formData.password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطا در ثبت‌نام");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        phone: formData.phone,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("ثبت‌نام انجام شد اما ورود خودکار ناموفق بود");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("خطا در ارتباط با سرور");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <FloatingOrbs />
      <div className="glass-card max-w-md w-full p-8 animate-float-up relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">ثبت‌نام</h1>
          <p className="text-sm text-text-muted">ایجاد حساب کاربری جدید</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">نام</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">نام خانوادگی</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">شماره تلفن</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="مثال: 09123456789"
              className="input-field"
              required
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">رمز عبور</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder="حداقل ۶ کاراکتر"
              className="input-field"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">تکرار رمز عبور</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              className="input-field"
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-danger text-sm animate-shake text-center">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/auth/login" className="text-accent-500 hover:text-accent-400 transition-colors">
            وارد شوید
          </Link>
        </p>
      </div>
    </div>
  );
}
