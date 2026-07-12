"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminBlockedDatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [blockedDates, setBlockedDates] = useState<any[]>([]);
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");
  const [message, setMessage] = useState("");
  const user = session?.user as any;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && user?.role !== "ADMIN") router.push("/");
  }, [status, user, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetch("/api/admin/blocked-dates")
        .then((r) => r.json())
        .then(setBlockedDates)
        .catch(() => {});
    }
  }, [user]);

  const handleBlock = async () => {
    if (!newDate) return;
    try {
      const res = await fetch("/api/admin/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: newDate, reason: newReason }),
      });
      if (res.ok) {
        setMessage(`روز ${newDate} با موفقیت مسدود شد`);
        setNewDate("");
        setNewReason("");
        const updated = await fetch("/api/admin/blocked-dates").then((r) => r.json());
        setBlockedDates(updated);
      }
    } catch {}
  };

  const handleUnblock = async (date: string) => {
    try {
      await fetch("/api/admin/blocked-dates", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
      setBlockedDates(blockedDates.filter((b) => b.date !== date));
      setMessage(`روز ${date} آزاد شد`);
    } catch {}
  };

  if (status === "loading") return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-text-muted">در حال بارگذاری...</p></div>;
  if (user?.role !== "ADMIN") return null;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-text-primary mb-6">مسدودسازی روزها</h1>
        {message && <p className="text-sm text-success mb-4 animate-fade-in">{message}</p>}

        <div className="glass-card p-6 mb-8">
          <h2 className="text-lg font-semibold text-text-primary mb-4">مسدود کردن روز جدید</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={today}
              className="input-field sm:flex-1"
            />
            <input
              type="text"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              placeholder="دلیل (اختیاری)"
              className="input-field sm:flex-1"
            />
            <button onClick={handleBlock} className="btn-primary">مسدود کن</button>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">روزهای مسدود شده</h2>
          {blockedDates.length === 0 ? (
            <p className="text-text-muted text-center py-8">هیچ روزی مسدود نشده است</p>
          ) : (
            <div className="space-y-3">
              {blockedDates.map((bd) => (
                <div key={bd.id} className="glass-card-dark p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-text-primary">{bd.date}</div>
                    {bd.reason && <div className="text-xs text-text-muted">{bd.reason}</div>}
                  </div>
                  <button onClick={() => handleUnblock(bd.date)} className="btn-danger text-xs py-1.5 px-3">
                    آزاد کردن
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
