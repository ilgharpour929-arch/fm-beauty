"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function UserBookingsPage() {
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

  if (status === "loading") return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-text-muted">در حال بارگذاری...</p></div>;

  const statusLabels: Record<string, { text: string; color: string }> = {
    PENDING_DEPOSIT: { text: "منتظر پرداخت", color: "text-text-primary bg-text-primary/10" },
    WAITING_APPROVAL: { text: "در انتظار تأیید", color: "text-accent-400 bg-accent-500/10" },
    CONFIRMED: { text: "تأیید شده", color: "text-success bg-success/10" },
    COMPLETED: { text: "انجام شده", color: "text-text-muted bg-text-primary/5" },
    CANCELLED: { text: "لغو شده", color: "text-danger bg-danger/10" },
    REJECTED: { text: "رد شده", color: "text-danger bg-danger/10" },
  };

  const handleCancel = async (id: string) => {
    const confirmed = window.confirm("آیا مطمئن هستید؟ پیش‌پرداخت به هیچ عنوان بازگشت داده نمی‌شود.");
    if (!confirmed) return;

    try {
      await fetch(`/api/bookings/${id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "لغو توسط مشتری" }),
      });
      setBookings(bookings.map((b) => b.id === id ? { ...b, status: "CANCELLED" } : b));
    } catch {}
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 animate-float-up">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">رزروهای من</h1>
            <p className="text-sm text-text-muted">مدیریت رزروهای خود</p>
          </div>
          <Link href="/booking" className="btn-primary text-sm">رزرو جدید</Link>
        </div>

        {bookings.length === 0 ? (
          <div className="glass-card p-12 text-center animate-float-up">
            <p className="text-text-muted mb-4">هیچ رزروی یافت نشد</p>
            <Link href="/booking" className="btn-primary">اولین رزرو خود را انجام دهید</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, i) => {
              const sl = statusLabels[booking.status] || { text: booking.status, color: "text-text-muted" };
              return (
                <div key={booking.id} className="glass-card p-5 animate-float-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-primary">{booking.service.name}</h3>
                      <p className="text-sm text-text-muted mt-1">
                        {booking.date} | {booking.startTime}
                      </p>
                      {booking.note && (
                        <p className="text-xs text-text-muted/70 mt-1">یادداشت: {booking.note}</p>
                      )}
                      <p className="text-xs text-text-muted/70 mt-1">
                        پیش‌پرداخت: {booking.depositAmount?.toLocaleString("fa-IR")} تومان
                      </p>
                    </div>
                    <div className="text-left">
                      <span className={`text-xs px-3 py-1 rounded-full ${sl.color}`}>
                        {sl.text}
                      </span>
                    </div>
                  </div>
                  {["PENDING_DEPOSIT", "WAITING_APPROVAL", "CONFIRMED"].includes(booking.status) && (
                    <div className="mt-3 pt-3 border-t border-white/5 flex gap-3">
                      {booking.status === "PENDING_DEPOSIT" && (
                        <Link href={`/booking/payment?id=${booking.id}`} className="btn-primary text-xs py-1.5 px-3">
                          پرداخت
                        </Link>
                      )}
                      <button onClick={() => handleCancel(booking.id)} className="btn-danger text-xs py-2.5 px-4">
                        لغو رزرو
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
