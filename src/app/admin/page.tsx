"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatJalali } from "@/lib/jalali";

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
  
  const [stats, setStats] = useState({ revenue: 0, totalBookings: 0, todayBookings: 0, loading: true });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && user?.role !== "ADMIN") router.push("/");
  }, [status, user, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetch("/api/admin/bookings")
        .then(res => res.json())
        .then((data: any[]) => {
          if (!Array.isArray(data)) return;
          const todayStr = new Date().toISOString().split("T")[0];
          
          let revenue = 0;
          let todayCount = 0;
          
          data.forEach(b => {
            if (b.status === "CONFIRMED" || b.status === "COMPLETED") {
              revenue += b.depositAmount || 0; // Or b.service?.price if you want total revenue
            }
            if (b.date === todayStr && b.status !== "CANCELLED") {
              todayCount++;
            }
          });
          
          setStats({
            revenue,
            totalBookings: data.length,
            todayBookings: todayCount,
            loading: false
          });
        })
        .catch(() => setStats(s => ({ ...s, loading: false })));
    }
  }, [user]);

  if (status === "loading") return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-[var(--color-muted)]">در حال بارگذاری...</p></div>;

  if (user?.role !== "ADMIN") return null;

  const adminLinks = [
    { href: "/admin/bookings", label: "مدیریت رزروها", desc: "مشاهده و تأیید رزروها", icon: icons.bookings },
    { href: "/admin/services", label: "مدیریت خدمات", desc: "ویرایش قیمت‌ها و خدمات", icon: icons.services },
    { href: "/admin/settings", label: "اطلاعات کارت و پرداخت", desc: "تغییر شماره کارت، شبا و نام بانک", icon: icons.services },
    { href: "/admin/blocked-dates", label: "مسدودسازی روزها", desc: "مسدود کردن روزهای خاص", icon: icons.blocked },
    { href: "/admin/users", label: "کاربران", desc: "لیست کاربران ثبت‌نام شده", icon: icons.users },
  ];

  return (
    <div className="min-h-screen px-4 py-8 pt-24">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 animate-float-up">
          <h1 className="text-3xl font-display font-medium text-[var(--color-fg)]">پنل مدیریت</h1>
          <p className="text-[var(--color-muted)] font-light mt-2">خوش آمدید، {user?.name}</p>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="glass-card p-6 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[var(--color-accent)]/10 rounded-full blur-xl group-hover:bg-[var(--color-accent)]/20 transition-all duration-500" />
            <span className="text-sm text-[var(--color-muted)] mb-2 z-10">مجموع درآمد تأیید شده (پیش‌پرداخت)</span>
            {stats.loading ? (
              <div className="h-8 bg-white/5 rounded animate-shimmer w-1/2" />
            ) : (
              <span className="text-3xl font-display font-medium text-[var(--color-accent)] z-10">
                {stats.revenue.toLocaleString("fa-IR")} <span className="text-sm font-sans text-[var(--color-muted)]">تومان</span>
              </span>
            )}
          </div>
          
          <div className="glass-card p-6 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all duration-500" />
            <span className="text-sm text-[var(--color-muted)] mb-2 z-10">کل رزروهای ثبت شده</span>
            {stats.loading ? (
              <div className="h-8 bg-white/5 rounded animate-shimmer w-1/3" />
            ) : (
              <span className="text-3xl font-display font-medium text-blue-400 z-10">
                {stats.totalBookings.toLocaleString("fa-IR")}
              </span>
            )}
          </div>
          
          <div className="glass-card p-6 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all duration-500" />
            <span className="text-sm text-[var(--color-muted)] mb-2 z-10">رزروهای امروز ({formatJalali(new Date().toISOString().split("T")[0]).split(" ")[0]})</span>
            {stats.loading ? (
              <div className="h-8 bg-white/5 rounded animate-shimmer w-1/3" />
            ) : (
              <span className="text-3xl font-display font-medium text-emerald-400 z-10">
                {stats.todayBookings.toLocaleString("fa-IR")}
              </span>
            )}
          </div>
        </div>

        <h2 className="text-xl font-medium text-[var(--color-fg)] mb-4">بخش‌های مدیریت</h2>
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
