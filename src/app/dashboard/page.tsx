"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/bookings")
        .then((r) => r.json())
        .then(setBookings)
        .catch(() => {});
    }
  }, [session]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-cream/50">در حال بارگذاری...</p></div>;
  }

  const user = session?.user as any;
  const activeBookings = bookings.filter((b) => ["PENDING_DEPOSIT", "WAITING_APPROVAL", "CONFIRMED"].includes(b.status));
  const pastBookings = bookings.filter((b) => ["COMPLETED", "CANCELLED", "REJECTED"].includes(b.status));

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 animate-float-up">
          <h1 className="text-2xl font-bold text-cream mb-1">خوش آمدید، {user?.name}</h1>
          <p className="text-cream/50">پنل کاربری شما</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link href="/dashboard/bookings" className="glass-card p-5 text-center hover:border-gold/30 transition-all">
            <div className="text-2xl font-bold text-gold">{activeBookings.length}</div>
            <div className="text-sm text-cream/50 mt-1">رزروهای فعال</div>
          </Link>
          <Link href="/dashboard/bookings" className="glass-card p-5 text-center hover:border-gold/30 transition-all">
            <div className="text-2xl font-bold text-cream">{pastBookings.length}</div>
            <div className="text-sm text-cream/50 mt-1">تاریخچه</div>
          </Link>
          <Link href="/dashboard/profile" className="glass-card p-5 text-center hover:border-gold/30 transition-all">
            <div className="text-2xl font-bold text-cream">...</div>
            <div className="text-sm text-cream/50 mt-1">ویرایش پروفایل</div>
          </Link>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-cream mb-4">رزروهای اخیر</h2>
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-cream/50 mb-4">هنوز رزروی ندارید</p>
              <Link href="/booking" className="btn-primary">رزرو نوبت</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="glass-card-dark p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-cream text-sm">{booking.service.name}</div>
                    <div className="text-xs text-cream/50 mt-1">{booking.date} | {booking.startTime}</div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    booking.status === "CONFIRMED" ? "bg-success/10 text-success" :
                    booking.status === "WAITING_APPROVAL" ? "bg-gold/10 text-gold" :
                    booking.status === "PENDING_DEPOSIT" ? "bg-cream/10 text-cream" :
                    booking.status === "CANCELLED" ? "bg-danger/10 text-danger" :
                    "bg-cream/10 text-cream/50"
                  }`}>
                    {booking.status === "CONFIRMED" ? "تأیید شده" :
                     booking.status === "WAITING_APPROVAL" ? "در انتظار تأیید" :
                     booking.status === "PENDING_DEPOSIT" ? "منتظر پرداخت" :
                     booking.status === "CANCELLED" ? "لغو شده" :
                     booking.status === "REJECTED" ? "رد شده" : booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
