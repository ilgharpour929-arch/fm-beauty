"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({ firstName: "", lastName: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      const name = (session.user as any).name || "";
      const parts = name.split(" ");
      setFormData({ firstName: parts[0] || "", lastName: parts.slice(1).join(" ") || "" });
    }
  }, [session]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage("پروفایل با موفقیت به‌روزرسانی شد");
        await update();
      } else {
        setMessage("خطا در به‌روزرسانی");
      }
    } catch {
      setMessage("خطا در ارتباط با سرور");
    }
  }

  if (status === "loading") return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-text-muted">در حال بارگذاری...</p></div>;

  const user = session?.user as any;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-float-up">
          <h1 className="text-2xl font-bold text-text-primary">پروفایل</h1>
          <p className="text-sm text-text-muted">ویرایش اطلاعات شخصی</p>
        </div>

        <div className="glass-card p-6 animate-float-up">
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-500 to-accent-300 flex items-center justify-center text-primary-900 text-2xl font-bold mx-auto">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">نام</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">نام خانوادگی</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5">شماره تلفن</label>
              <input type="tel" value={user?.phone || ""} className="input-field" disabled dir="ltr" />
              <p className="text-xs text-text-muted/50 mt-1">شماره تلفن قابل تغییر نیست</p>
            </div>

            {message && (
              <p className={`text-sm text-center ${message.includes("success") ? "text-success" : "text-danger"}`}>
                {message}
              </p>
            )}

            <button type="submit" className="btn-primary w-full">ذخیره تغییرات</button>
          </form>
        </div>
      </div>
    </div>
  );
}
