"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
}

interface TimeSlot {
  start: string;
  end: string;
  label: string;
}

export default function BookingClient() {
  const { data: session } = useSession();
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then(setServices)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetch(`/api/bookings/available-slots?date=${selectedDate}`)
        .then((r) => r.json())
        .then(setAvailableSlots)
        .catch(() => setAvailableSlots([]));
    }
  }, [selectedDate]);

  function generateDailySlots(): TimeSlot[] {
    const slots: TimeSlot[] = [];
    for (let h = 9; h < 20; h++) {
      const start = `${h.toString().padStart(2, "0")}:00`;
      const endH = h + 1;
      const end = `${endH.toString().padStart(2, "0")}:30`;
      slots.push({ start, end, label: `${start} - ${end}` });
    }
    return slots;
  }

  const today = new Date().toISOString().split("T")[0];

  const selectedServiceData = services.find((s) => s.id === selectedService);
  const depositAmount = selectedServiceData ? Math.round(selectedServiceData.price * 0.3) : 0;

  async function handleBooking() {
    if (!session) {
      router.push("/auth/login");
      return;
    }

    if (!selectedService || !selectedDate || !selectedSlot) {
      setMessage("لطفاً همه موارد را انتخاب کنید");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService,
          date: selectedDate,
          startTime: selectedSlot,
          note,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "خطا در رزرو");
        setLoading(false);
        return;
      }

      router.push(`/booking/payment?id=${data.bookingId}`);
    } catch {
      setMessage("خطا در ارتباط با سرور");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-float-up">
          <h1 className="text-3xl font-bold text-cream mb-2">رزرو نوبت</h1>
          <p className="text-cream/50">تاریخ و ساعت مورد نظر خود را انتخاب کنید</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 animate-float-up" style={{ animationDelay: "0.1s" } as React.CSSProperties}>
              <h2 className="text-lg font-semibold text-cream mb-4">۱. انتخاب خدمت</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-4 rounded-xl text-right transition-all ${
                      selectedService === service.id
                        ? "slot-selected"
                        : "slot-available"
                    }`}
                  >
                    <div className="font-medium">{service.name}</div>
                    <div className="text-xs opacity-70 mt-1">{service.description}</div>
                    <div className="text-sm font-bold mt-2 text-gold">
                      {service.price.toLocaleString("fa-IR")} تومان
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 animate-float-up" style={{ animationDelay: "0.2s" } as React.CSSProperties}>
              <h2 className="text-lg font-semibold text-cream mb-4">۲. انتخاب تاریخ و ساعت</h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(""); }}
                min={today}
                className="input-field mb-4"
              />

              {selectedDate && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {generateDailySlots().map((slot) => {
                    const isBooked = !availableSlots.find(
                      (s) => s.start === slot.start
                    );
                    return (
                      <button
                        key={slot.start}
                        onClick={() => !isBooked && setSelectedSlot(slot.start)}
                        disabled={isBooked}
                        className={
                          selectedSlot === slot.start
                            ? "slot-selected"
                            : isBooked
                            ? "slot-booked"
                            : "slot-available"
                        }
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="glass-card p-6 animate-float-up" style={{ animationDelay: "0.3s" } as React.CSSProperties}>
              <h2 className="text-lg font-semibold text-cream mb-4">۳. توضیحات تکمیلی (اختیاری)</h2>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="هر نکته یا درخواست خاصی که دارید..."
                className="input-field min-h-[100px] resize-none"
                rows={4}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="glass-card p-6 animate-float-up lg:sticky top-24" style={{ animationDelay: "0.2s" } as React.CSSProperties}>
              <h2 className="text-lg font-semibold text-cream mb-4">خلاصه رزرو</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-cream/50">خدمت:</span>
                  <span className="text-cream">{selectedServiceData?.name || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream/50">تاریخ:</span>
                  <span className="text-cream">{selectedDate || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream/50">ساعت:</span>
                  <span className="text-cream">{selectedSlot || "—"}</span>
                </div>
                <hr className="border-white/5" />
                <div className="flex justify-between">
                  <span className="text-cream/50">قیمت:</span>
                  <span className="text-cream">{selectedServiceData?.price.toLocaleString("fa-IR")} تومان</span>
                </div>
                <div className="flex justify-between text-gold font-bold">
                  <span>پیش‌پرداخت (۳۰٪):</span>
                  <span>{depositAmount.toLocaleString("fa-IR")} تومان</span>
                </div>
              </div>

              {message && (
                <p className="text-sm mt-3 text-danger text-center animate-shake">{message}</p>
              )}

              <button
                onClick={handleBooking}
                disabled={loading || !selectedService || !selectedDate || !selectedSlot}
                className="btn-primary w-full mt-5"
              >
                {loading ? "..." : session ? "ادامه و پرداخت" : "ورود برای رزرو"}
              </button>

              {!session && (
                <p className="text-xs text-cream/40 text-center mt-3">
                  برای رزرو نیاز به ورود یا ثبت‌نام دارید
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
