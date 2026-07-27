"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "today">("all");

  const user = session?.user as any;
  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && user?.role !== "ADMIN") router.push("/");
  }, [status, user, router]);

  const loadBookings = () => {
    if (user?.role === "ADMIN") {
      fetch("/api/admin/bookings")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setBookings(data);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user]);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}/approve`, { method: "POST" });
      if (res.ok) {
        setMessage("رزرو با موفقیت تأیید شد ✨");
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "CONFIRMED" } : b)));
        setTimeout(() => setMessage(""), 3000);
      }
    } catch {}
  };

  const handleReject = async (id: string) => {
    const reason = prompt("دلیل رد رزرو:");
    if (!reason) return;
    try {
      const res = await fetch(`/api/admin/bookings/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        setMessage("رزرو رد شد");
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "REJECTED" } : b)));
        setTimeout(() => setMessage(""), 3000);
      }
    } catch {}
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("آیا از حذف این رزرو مطمئن هستید؟");
    if (!confirmed) return;
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setMessage("رزرو با موفقیت حذف شد");
    setTimeout(() => setMessage(""), 3000);
  };

  if (status === "loading") return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-[var(--color-muted)]">در حال بارگذاری...</p></div>;
  if (user?.role !== "ADMIN") return null;

  const statusLabels: Record<string, { text: string; bg: string; color: string }> = {
    PENDING_DEPOSIT: { text: "در انتظار پرداخت", bg: "bg-amber-500/15", color: "text-amber-300" },
    WAITING_APPROVAL: { text: "در انتظار تأیید شما", bg: "bg-purple-500/20", color: "text-purple-300" },
    CONFIRMED: { text: "تأیید شده ✓", bg: "bg-emerald-500/20", color: "text-emerald-300" },
    COMPLETED: { text: "انجام شده", bg: "bg-slate-500/20", color: "text-slate-300" },
    CANCELLED: { text: "لغو شده", bg: "bg-rose-500/15", color: "text-rose-300" },
    REJECTED: { text: "رد شده", bg: "bg-rose-500/15", color: "text-rose-300" },
  };

  const displayedBookings = activeTab === "today" 
    ? bookings.filter((b) => b.date === todayStr)
    : bookings;

  const todayCount = bookings.filter((b) => b.date === todayStr).length;

  return (
    <div className="min-h-screen px-4 py-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-fg)]">مدیریت و تأیید رزروها</h1>
            <p className="text-xs text-[var(--color-muted)]">مشاهده فیش‌های واریزی مشتریان و تأیید نهایی رزرو</p>
          </div>
          <Link href="/admin" className="btn-ghost text-xs py-2 px-4">
            ← بازگشت به پنل
          </Link>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`py-2 px-5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-[var(--color-accent)] text-[var(--color-bg)] shadow-md"
                : "glass-card text-[var(--color-muted)] hover:text-[var(--color-fg)]"
            }`}
          >
            همه رزروها ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab("today")}
            className={`py-2 px-5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "today"
                ? "bg-[var(--color-accent)] text-[var(--color-bg)] shadow-md"
                : "glass-card text-[var(--color-muted)] hover:text-[var(--color-fg)]"
            }`}
          >
            <span>📅 رزروهای امروز ({todayCount})</span>
            {todayCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>
        </div>

        {message && (
          <div className="p-3 mb-6 rounded-xl bg-[var(--color-success)]/10 border border-[var(--color-success)]/30 text-[var(--color-success)] text-sm text-center animate-fade-in">
            {message}
          </div>
        )}

        <div className="glass-card p-4 md:p-6">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="border-b border-white/10 text-[var(--color-muted)]">
                  <th className="p-3">نام مشتری</th>
                  <th className="p-3">شماره تماس</th>
                  <th className="p-3">خدمت</th>
                  <th className="p-3">تاریخ و ساعت</th>
                  <th className="p-3">پیش‌پرداخت</th>
                  <th className="p-3">وضعیت</th>
                  <th className="p-3 text-center">عکس فیش واریزی</th>
                  <th className="p-3 text-left">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {displayedBookings.map((booking) => {
                  const st = statusLabels[booking.status] || { text: booking.status, bg: "bg-slate-500/10", color: "text-slate-300" };
                  const clientName = (booking.user?.firstName || booking.user?.lastName)
                    ? `${booking.user.firstName || ""} ${booking.user.lastName || ""}`.trim()
                    : "مشتری آنلاین";

                  return (
                    <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-3 font-medium text-[var(--color-fg)]">
                        {clientName}
                      </td>
                      <td className="p-3 font-mono text-[var(--color-muted)]" dir="ltr">
                        {booking.user?.phone || "—"}
                      </td>
                      <td className="p-3 text-[var(--color-fg)]">{booking.service?.name}</td>
                      <td className="p-3 text-[var(--color-muted)] text-xs">
                        {booking.date} | {booking.startTime}
                      </td>
                      <td className="p-3 font-bold text-[var(--color-accent)]">
                        {booking.depositAmount?.toLocaleString("fa-IR")} تومان
                      </td>
                      <td className="p-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${st.bg} ${st.color}`}>
                          {st.text}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {booking.receiptImage ? (
                          <button
                            onClick={() => setSelectedReceipt(booking.receiptImage)}
                            className="btn-ghost text-xs !py-1 !px-3 text-[var(--color-accent-2)] cursor-pointer hover:scale-105 transition-transform"
                          >
                            👁️ مشاهده عکس فیش
                          </button>
                        ) : (
                          <span className="text-xs text-[var(--color-muted)]/50">هنوز آپلود نشده</span>
                        )}
                      </td>
                      <td className="p-3 text-left">
                        <div className="flex justify-end gap-2">
                          {(booking.status === "WAITING_APPROVAL" || booking.status === "PENDING_DEPOSIT") && (
                            <>
                              <button
                                onClick={() => handleApprove(booking.id)}
                                className="btn-primary text-xs !py-1.5 !px-3 cursor-pointer"
                              >
                                ✓ تأیید
                              </button>
                              <button
                                onClick={() => handleReject(booking.id)}
                                className="btn-ghost text-xs !py-1.5 !px-3 text-[var(--color-danger)] cursor-pointer"
                              >
                                ✕ رد
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="text-xs text-rose-400/60 hover:text-rose-400 px-1 cursor-pointer"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {displayedBookings.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-[var(--color-muted)]">
                      {activeTab === "today" ? "هیچ رزروی برای امروز ثبت نشده است" : "هیچ رزروی ثبت نشده است"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {displayedBookings.map((booking) => {
              const st = statusLabels[booking.status] || { text: booking.status, bg: "bg-slate-500/10", color: "text-slate-300" };
              const clientName = (booking.user?.firstName || booking.user?.lastName)
                ? `${booking.user.firstName || ""} ${booking.user.lastName || ""}`.trim()
                : "مشتری آنلاین";

              return (
                <div key={booking.id} className="glass-card-dark p-4 space-y-3 border border-white/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-[var(--color-fg)]">
                        {clientName}
                      </div>
                      <div className="text-xs font-mono text-[var(--color-muted)]" dir="ltr">
                        {booking.user?.phone || "—"}
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${st.bg} ${st.color}`}>
                      {st.text}
                    </span>
                  </div>

                  <div className="text-sm font-medium text-[var(--color-accent-2)]">{booking.service?.name}</div>

                  <div className="flex justify-between text-xs text-[var(--color-muted)]">
                    <span>{booking.date} | {booking.startTime}</span>
                    <span className="font-bold text-[var(--color-accent)]">{booking.depositAmount?.toLocaleString("fa-IR")} تومان</span>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                    {booking.receiptImage ? (
                      <button
                        onClick={() => setSelectedReceipt(booking.receiptImage)}
                        className="btn-ghost text-xs !py-1.5 !px-3 text-[var(--color-accent-2)] cursor-pointer"
                      >
                        👁️ مشاهده عکس فیش
                      </button>
                    ) : (
                      <span className="text-xs text-[var(--color-muted)]/50">منتظر فیش</span>
                    )}

                    <div className="flex gap-2">
                      {(booking.status === "WAITING_APPROVAL" || booking.status === "PENDING_DEPOSIT") && (
                        <>
                          <button
                            onClick={() => handleApprove(booking.id)}
                            className="btn-primary text-xs !py-1.5 !px-3 cursor-pointer"
                          >
                            ✓ تأیید
                          </button>
                          <button
                            onClick={() => handleReject(booking.id)}
                            className="btn-ghost text-xs !py-1.5 !px-3 text-[var(--color-danger)] cursor-pointer"
                          >
                            ✕ رد
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {displayedBookings.length === 0 && (
              <p className="p-8 text-center text-[var(--color-muted)]">
                {activeTab === "today" ? "هیچ رزروی برای امروز ثبت نشده است" : "هیچ رزروی ثبت نشده است"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Receipt Image Preview */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card max-w-lg w-full p-6 relative overflow-hidden text-center space-y-4 border border-[var(--color-accent)]/30">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="text-lg font-bold text-[var(--color-fg)]">تصویر فیش واریزی مشتری</h3>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-[var(--color-muted)] hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="relative max-h-[60vh] overflow-auto rounded-xl border border-white/10 p-2 bg-black/50">
              <img
                src={selectedReceipt}
                alt="تصویر فیش واریزی"
                className="max-w-full h-auto mx-auto rounded-lg shadow-2xl"
              />
            </div>
            <button
              onClick={() => setSelectedReceipt(null)}
              className="btn-primary w-full text-sm py-2.5 cursor-pointer"
            >
              بستن پنجره
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
