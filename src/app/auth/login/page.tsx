"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FloatingOrbs } from "@/components/ui/FloatingOrbs";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      phone,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("شماره تلفن یا رمز عبور اشتباه است");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
      <FloatingOrbs />
      <div className="glass-card max-w-md w-full p-8 animate-float-up relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">ورود</h1>
          <p className="text-sm text-text-muted">به حساب کاربری خود وارد شوید</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">شماره تلفن</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="رمز عبور خود را وارد کنید"
              className="input-field"
              required
            />
          </div>

          {error && (
            <p className="text-danger text-sm animate-shake text-center">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          حساب کاربری ندارید؟{" "}
          <Link href="/auth/register" className="text-accent-500 hover:text-accent-400 transition-colors">
            ثبت‌نام کنید
          </Link>
        </p>
      </div>
    </div>
  );
}
