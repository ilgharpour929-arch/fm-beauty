"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const user = session?.user as any;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && user?.role !== "ADMIN") router.push("/");
  }, [status, user, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetch("/api/admin/bookings")
        .then((r) => r.json())
        .then(setBookings)
        .catch(() => {});
    }
  }, [user]);

  const handleApprove = async (id: string) => {
    try {
      await fetch(`/api/admin/bookings/${id}/approve`, { method: "POST" });
      setBookings(bookings.map((b) => b.id === id ? { ...b, status: "CONFIRMED" } : b));
    } catch {}
  };

  const handleReject = async (id: string) => {
    const reason = prompt("دلیل رد رزرو:");
    if (!reason) return;
    try {
      await fetch(`/api/admin/bookings/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      setBookings(bookings.map((b) => b.id === id ? { ...b, status: "REJECTED" } : b));
    } catch {}
  };

  const handleDelete = async (id: string) => {
    const reason = prompt("دلیل حذف:");
    if (!reason) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        setBookings(bookings.filter((b) => b.id !== id));
        setMessage("رزرو با موفقیت حذف شد");
      }
    } catch {}
  };

  if (status === "loading") return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-text-muted">در حال بارگذاری...</p></div>;
  if (user?.role !== "ADMIN") return null;

  const statusLabels: Record<string, string> = {
    PENDING_DEPOSIT: "منتظر پرداخت",
    WAITING_APPROVAL: "در انتظار تأیید",
    CONFIRMED: "تأیید شده",
    COMPLETED: "انجام شده",
    CANCELLED: "لغو شده",
    REJECTED: "رد شده",
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-text-primary mb-6">مدیریت رزروها</h1>

        {message && <p className="text-success text-sm mb-4 animate-fade-in">{message}</p>}

        <div className="glass-card p-4 md:p-0 md:overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-text-muted text-right">
                  <th className="p-4 font-medium">مشتری</th>
                  <th className="p-4 font-medium">تماس</th>
                  <th className="p-4 font-medium">خدمت</th>
                  <th className="p-4 font-medium">تاریخ</th>
                  <th className="p-4 font-medium">ساعت</th>
                  <th className="p-4 font-medium">پیش‌پرداخت</th>
                  <th className="p-4 font-medium">وضعیت</th>
                  <th className="p-4 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-text-primary">{booking.user.firstName} {booking.user.lastName}</td>
                    <td className="p-4 text-text-secondary" dir="ltr">{booking.user.phone}</td>
                    <td className="p-4 text-text-primary">{booking.service.name}</td>
                    <td className="p-4 text-text-secondary">{booking.date}</td>
                    <td className="p-4 text-text-secondary">{booking.startTime}</td>
                    <td className="p-4 text-accent-500">{booking.depositAmount?.toLocaleString("fa-IR")} تومان</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === "CONFIRMED" ? "bg-success/10 text-success" :
                        booking.status === "WAITING_APPROVAL" ? "bg-accent-500/10 text-accent-500" :
                        "bg-text-primary/10 text-text-muted"
                      }`}>
                        {statusLabels[booking.status] || booking.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {booking.status === "PENDING_DEPOSIT" && (
                          <span className="text-xs text-text-muted/50">منتظر فیش</span>
                        )}
                        {booking.status === "WAITING_APPROVAL" && (
                          <>
                            <button onClick={() => handleApprove(booking.id)} className="text-xs text-success hover:text-success/80 min-h-[44px]">تأیید</button>
                            <button onClick={() => handleReject(booking.id)} className="text-xs text-danger hover:text-danger/80 min-h-[44px]">رد</button>
                          </>
                        )}
                        {booking.receiptImage && (
                          <a href={booking.receiptImage} target="_blank" className="text-xs text-accent-500 hover:text-accent-500-light">فیش</a>
                        )}
                        <button onClick={() => handleDelete(booking.id)} className="text-xs text-danger/50 hover:text-danger">حذف</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-text-muted">هیچ رزروی یافت نشد</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {bookings.length === 0 && (
              <p className="p-4 text-center text-text-muted">هیچ رزروی یافت نشد</p>
            )}
            {bookings.map((booking) => (
              <div key={booking.id} className="glass-card-dark p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-text-primary">{booking.user.firstName} {booking.user.lastName}</div>
                    <div className="text-xs text-text-muted" dir="ltr">{booking.user.phone}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    booking.status === "CONFIRMED" ? "bg-success/10 text-success" :
                    booking.status === "WAITING_APPROVAL" ? "bg-accent-500/10 text-accent-500" :
                    "bg-text-primary/10 text-text-muted"
                  }`}>
                    {statusLabels[booking.status] || booking.status}
                  </span>
                </div>
                <div className="text-sm text-text-primary">{booking.service.name}</div>
                <div className="flex justify-between text-xs text-text-muted">
                  <span>{booking.date} | {booking.startTime}</span>
                  <span className="text-accent-500">{booking.depositAmount?.toLocaleString("fa-IR")} تومان</span>
                </div>
                <div className="flex gap-2 pt-2 border-t border-white/5">
                  {booking.status === "PENDING_DEPOSIT" && (
                    <span className="text-xs text-text-muted/50 py-1.5">منتظر فیش</span>
                  )}
                  {booking.status === "WAITING_APPROVAL" && (
                    <>
                      <button onClick={() => handleApprove(booking.id)} className="btn-primary text-xs py-2.5 px-4">تأیید</button>
                      <button onClick={() => handleReject(booking.id)} className="btn-danger text-xs py-2.5 px-4">رد</button>
                    </>
                  )}
                  {booking.receiptImage && (
                    <a href={booking.receiptImage} target="_blank" className="text-xs text-accent-500 underline py-1.5">مشاهده فیش</a>
                  )}
                  <button onClick={() => handleDelete(booking.id)} className="text-xs text-danger/50 underline py-1.5 mr-auto">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
