"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const icons = {
  bookings: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  services: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
    </svg>
  ),
  blocked: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  ),
  users: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8" cy="8" r="4" />
      <path d="M20 8v6M23 11h-6" />
    </svg>
  ),
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as any;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && user?.role !== "ADMIN") router.push("/");
  }, [status, user, router]);

  if (status === "loading") return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-[var(--color-muted)]">در حال بارگذاری...</p></div>;

  if (user?.role !== "ADMIN") return null;

  const adminLinks = [
    { href: "/admin/bookings", label: "مدیریت رزروها", desc: "مشاهده و تأیید رزروها", icon: icons.bookings },
    { href: "/admin/services", label: "مدیریت خدمات", desc: "ویرایش قیمت‌ها و خدمات", icon: icons.services },
    { href: "/admin/blocked-dates", label: "مسدودسازی روزها", desc: "مسدود کردن روزهای خاص", icon: icons.blocked },
    { href: "/admin/users", label: "کاربران", desc: "لیست کاربران ثبت‌نام شده", icon: icons.users },
  ];

  return (
    <div className="min-h-screen px-4 py-8 pt-24">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 animate-float-up">
          <h1 className="text-2xl font-bold text-[var(--color-fg)]">پنل مدیریت</h1>
          <p className="text-[var(--color-muted)]">خوش آمدید، {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {adminLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="glass-card p-6 hover:border-[var(--color-accent)]/30 transition-all animate-float-up group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] mb-4 group-hover:scale-110 transition-transform">
                {link.icon}
              </div>
              <h3 className="font-semibold text-[var(--color-fg)] mb-1">{link.label}</h3>
              <p className="text-sm text-[var(--color-muted)]">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
