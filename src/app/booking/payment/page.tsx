"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface BookingInfo {
  bookingId: string;
  depositAmount: number;
  serviceName: string;
  date: string;
  startTime: string;
  status: string;
}

function PaymentForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const bookingId = searchParams.get("id");

  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!bookingId || !session) return;
    fetch(`/api/bookings/${bookingId}`)
      .then((r) => r.json())
      .then((data) => setBooking(data))
      .catch(() => {});
  }, [bookingId, session]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !bookingId) {
      setMessage("لطفاً فیش واریزی را انتخاب کنید");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("receipt", file);
    formData.append("bookingId", bookingId);

    try {
      const res = await fetch("/api/payment/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "خطا در آپلود فیش");
        setLoading(false);
        return;
      }

      router.push(`/dashboard/bookings`);
    } catch {
      setMessage("خطا در ارتباط با سرور");
      setLoading(false);
    }
  }

  const bankInfo = {
    cardNumber: "۶۰۳۷-۷۵۹۱-xxxx-xxxx",
    accountHolder: "فاطمه محمدی",
    bank: "بانک ملی",
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center animate-float-up">
          <h1 className="text-2xl font-bold text-cream mb-2">پرداخت پیش‌پرداخت</h1>
          <p className="text-cream/50">لطفاً مبلغ را واریز و فیش را آپلود کنید</p>
        </div>

        <div className="glass-card p-6 animate-float-up" style={{ animationDelay: "0.1s" } as React.CSSProperties}>
          <h2 className="text-lg font-semibold text-cream mb-4">اطلاعات واریز</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-cream/50">خدمت:</span>
              <span className="text-cream">{booking?.serviceName || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cream/50">مبلغ پیش‌پرداخت:</span>
              <span className="text-gold font-bold">
                {booking?.depositAmount?.toLocaleString("fa-IR")} تومان
              </span>
            </div>
            <hr className="border-white/5" />
            <div className="flex justify-between">
              <span className="text-cream/50">شماره کارت:</span>
              <span className="text-cream font-mono" dir="ltr">{bankInfo.cardNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cream/50">به نام:</span>
              <span className="text-cream">{bankInfo.accountHolder}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cream/50">بانک:</span>
              <span className="text-cream">{bankInfo.bank}</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 animate-float-up" style={{ animationDelay: "0.2s" } as React.CSSProperties}>
          <h2 className="text-lg font-semibold text-cream mb-4">آپلود فیش واریزی</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-gold/20 rounded-xl p-6 text-center hover:border-gold/40 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="receipt-upload"
              />
              <label htmlFor="receipt-upload" className="cursor-pointer">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="1.5" className="mx-auto mb-2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="text-sm text-cream/70">
                  {file ? file.name : "برای آپلود کلیک کنید"}
                </p>
              </label>
            </div>

            {message && (
              <p className="text-sm text-danger text-center animate-shake">{message}</p>
            )}

            <button type="submit" disabled={loading || !file} className="btn-primary w-full">
              {loading ? "در حال آپلود..." : "آپلود فیش و ثبت رزرو"}
            </button>
          </form>
        </div>

        <p className="text-xs text-cream/30 text-center">
          پس از آپلود فیش، رزرو شما توسط مدیریت تأیید خواهد شد و از طریق پیامک به شما اطلاع داده می‌شود.
        </p>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentForm />
    </Suspense>
  );
}
