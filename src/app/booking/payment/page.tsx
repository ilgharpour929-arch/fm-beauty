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
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!bookingId || !session) return;
    setFetchError("");
    fetch(`/api/bookings/${bookingId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("خطا در دریافت اطلاعات رزرو");
        return r.json();
      })
      .then((data) => setBooking(data))
      .catch((e) => setFetchError(e.message));
  }, [bookingId, session]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !bookingId) {
      setMessage("لطفاً فیش واریزی را انتخاب کنید");
      return;
    }

    setLoading(true);
    setMessage("");

    // Convert file to Base64 on client-side for 100% fail-safe delivery
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;

      try {
        const res = await fetch("/api/payment/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId,
            receiptImage: base64Data,
          }),
        });

        if (res.ok) {
          router.push(`/dashboard/bookings`);
        } else {
          setMessage("خطا در ثبت فیش");
          setLoading(false);
        }
      } catch {
        setMessage("خطا در ارتباط با سرور");
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setMessage("خطا در خواندن فایل تصویر");
      setLoading(false);
    };
    reader.readAsDataURL(file);
  }

  const [bankInfo, setBankInfo] = useState({
    cardNumber: "۶۰۳۷-۷۵۹۱-۱۲۳۴-۵۶۷۸",
    accountHolder: "فاطمه محمدی",
    bank: "بانک ملی",
  });

  useEffect(() => {
    const savedCard = localStorage.getItem("bank_cardNumber");
    const savedHolder = localStorage.getItem("bank_accountHolder");
    const savedBank = localStorage.getItem("bank_name");

    if (savedCard || savedHolder || savedBank) {
      setBankInfo({
        cardNumber: savedCard || "۶۰۳۷-۷۵۹۱-۱۲۳۴-۵۶۷۸",
        accountHolder: savedHolder || "فاطمه محمدی",
        bank: savedBank || "بانک ملی",
      });
    }
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center animate-float-up">
          <h1 className="text-2xl font-bold text-text-primary mb-2">پرداخت پیش‌پرداخت</h1>
          <p className="text-text-muted">لطفاً مبلغ را واریز و فیش را آپلود کنید</p>
        </div>

        <div className="glass-card p-6 animate-float-up" style={{ animationDelay: "0.1s" } as React.CSSProperties}>
          <h2 className="text-lg font-semibold text-text-primary mb-4">اطلاعات واریز</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">خدمت:</span>
              <span className="text-text-primary">{booking?.serviceName || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">مبلغ پیش‌پرداخت:</span>
              <span className="text-accent-500 font-bold">
                {booking?.depositAmount?.toLocaleString("fa-IR")} تومان
              </span>
            </div>
              {fetchError && (
                <p className="text-xs text-danger text-center">{fetchError}</p>
              )}
              <hr className="border-accent-500/10" />
            <div className="flex justify-between">
              <span className="text-text-muted">شماره کارت:</span>
              <span className="text-text-primary font-mono" dir="ltr">{bankInfo.cardNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">به نام:</span>
              <span className="text-text-primary">{bankInfo.accountHolder}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">بانک:</span>
              <span className="text-text-primary">{bankInfo.bank}</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 animate-float-up" style={{ animationDelay: "0.2s" } as React.CSSProperties}>
          <h2 className="text-lg font-semibold text-text-primary mb-4">آپلود فیش واریزی</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-accent-500/20 rounded-xl p-6 text-center hover:border-accent-500/40 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="receipt-upload"
              />
              <label htmlFor="receipt-upload" className="cursor-pointer">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-500)" strokeWidth="1.5" className="mx-auto mb-2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="text-sm text-text-secondary">
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

        <p className="text-xs text-text-muted/50 text-center">
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
        <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentForm />
    </Suspense>
  );
}
