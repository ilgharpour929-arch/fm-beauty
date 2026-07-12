"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const persianMonths = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as any;
  const [revenue, setRevenue] = useState<{ totalRevenue: number; bookingCount: number } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && user?.role !== "ADMIN") router.push("/");
  }, [status, user, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetch("/api/admin/revenue")
        .then((r) => r.json())
        .then(setRevenue)
        .catch(() => {});
    }
  }, [user]);

  if (status === "loading") return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-[var(--color-muted)]">در حال بارگذاری...</p></div>;

  if (user?.role !== "ADMIN") return null;

  const now = new Date();
  const currentMonth = now.getMonth();
  const chartData = persianMonths.map((name, i) => {
    const isPast = i <= currentMonth;
    const total = revenue?.totalRevenue ?? 0;
    const perMonth = total > 0 && isPast ? Math.round(total / (currentMonth + 1)) : 0;
    return {
      name,
      amount: i === currentMonth && revenue ? revenue.totalRevenue : perMonth,
      full: isPast,
    };
  });

  const adminLinks = [
    { href: "/admin/bookings", label: "مدیریت رزروها", desc: "مشاهده و تأیید رزروها", icon: "📋" },
    { href: "/admin/services", label: "مدیریت خدمات", desc: "ویرایش قیمت‌ها و خدمات", icon: "💄" },
    { href: "/admin/blocked-dates", label: "مسدودسازی روزها", desc: "مسدود کردن روزهای خاص", icon: "🚫" },
    { href: "/admin/users", label: "کاربران", desc: "لیست کاربران ثبت‌نام شده", icon: "👥" },
    { href: "/admin/settings", label: "تنظیمات ارتباطی", desc: "ویرایش شماره تماس، آدرس و شبکه‌های اجتماعی", icon: "⚙️" },
  ];

  const formatPrice = (v: number) => v.toLocaleString("fa-IR");

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 animate-float-up">
          <h1 className="text-2xl font-bold text-text-primary">پنل مدیریت</h1>
          <p className="text-text-muted">خوش آمدید، {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-5 text-center">
            <div className="text-2xl font-bold text-accent-500">
              {revenue ? revenue.totalRevenue.toLocaleString("fa-IR") : "—"}
            </div>
            <div className="text-sm text-text-muted mt-1">تومان درآمد کل</div>
          </div>
          <div className="glass-card p-5 text-center">
            <div className="text-2xl font-bold text-text-primary">
              {revenue ? revenue.bookingCount : "—"}
            </div>
            <div className="text-sm text-text-muted mt-1">نوبت تأیید شده</div>
          </div>
        </div>

        <div className="glass-card p-6 mb-8">
          <h2 className="text-lg font-semibold text-text-primary mb-4">درآمد ماهانه</h2>
          <div dir="ltr" className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#b8afa5", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#b8afa5", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatPrice}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(45,24,53,0.95)",
                    border: "1px solid rgba(212,163,115,0.2)",
                    borderRadius: 12,
                    color: "#faf7f4",
                    fontSize: 13,
                  }}
                  formatter={(value: any) => [(`${(typeof value === "number" ? value : 0).toLocaleString("fa-IR")} تومان`), "درآمد"]}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#d4a373"
                  strokeWidth={3}
                  dot={{ fill: "#e8c4a0", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#d4a373", stroke: "#e8c4a0", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {adminLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="glass-card p-6 hover:border-accent-500/30 transition-smooth hover:-translate-y-1 animate-float-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-3xl mb-3">{link.icon}</div>
              <h3 className="font-semibold text-text-primary mb-1">{link.label}</h3>
              <p className="text-sm text-text-muted">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
