"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as any;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && user?.role !== "ADMIN") router.push("/");
  }, [status, user, router]);

  if (status === "loading") return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-cream/50">در حال بارگذاری...</p></div>;

  if (user?.role !== "ADMIN") return null;

  const adminLinks = [
    { href: "/admin/bookings", label: "مدیریت رزروها", desc: "مشاهده و تأیید رزروها", icon: "📋" },
    { href: "/admin/services", label: "مدیریت خدمات", desc: "ویرایش قیمت‌ها و خدمات", icon: "💄" },
    { href: "/admin/blocked-dates", label: "مسدودسازی روزها", desc: "مسدود کردن روزهای خاص", icon: "🚫" },
    { href: "/admin/users", label: "کاربران", desc: "لیست کاربران ثبت‌نام شده", icon: "👥" },
  ];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 animate-float-up">
          <h1 className="text-2xl font-bold text-cream">پنل مدیریت</h1>
          <p className="text-cream/50">خوش آمدید، {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {adminLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="glass-card p-6 hover:border-gold/30 transition-all animate-float-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-3xl mb-3">{link.icon}</div>
              <h3 className="font-semibold text-cream mb-1">{link.label}</h3>
              <p className="text-sm text-cream/50">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
