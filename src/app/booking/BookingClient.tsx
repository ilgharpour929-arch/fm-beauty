"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import PersianCalendar from "@/components/PersianCalendar";
import { formatJalali } from "@/lib/jalali";

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

const FIXED_SLOTS: TimeSlot[] = [
  { start: "09:00", end: "10:30", label: "۰۹:۰۰ - ۱۰:۳۰" },
  { start: "10:30", end: "12:00", label: "۱۰:۳۰ - ۱۲:۰۰" },
  { start: "12:00", end: "13:30", label: "۱۲:۰۰ - ۱۳:۳۰" },
  { start: "13:30", end: "15:00", label: "۱۳:۳۰ - ۱۵:۰۰" },
  { start: "15:00", end: "16:30", label: "۱۵:۰۰ - ۱۶:۳۰" },
  { start: "16:30", end: "18:00", label: "۱۶:۳۰ - ۱۸:۰۰" },
  { start: "18:00", end: "19:30", label: "۱۸:۰۰ - ۱۹:۳۰" },
  { start: "19:30", end: "21:00", label: "۱۹:۳۰ - ۲۱:۰۰" },
];

const STATIC_SERVICES: Service[] = [
  { id: "volume", name: "اکستنشن مژه والیوم", description: "مژه‌های حجیم و پرپشت با تکنیک والیوم", price: 1800000, duration: 90, image: "/images/gallery/valyum.jpg" },
  { id: "spiky", name: "اکستنشن مژه اسپایکی", description: "مژه‌های فرچه‌ای با ظاهری جذاب و چشمگیر", price: 1500000, duration: 90, image: "/images/gallery/spayki.jpg" },
  { id: "natural", name: "اکستنشن مژه نچرال", description: "مژه‌های طبیعی و ظریف برای روزمره", price: 1100000, duration: 90, image: "/images/services/nacral.jpg" },
  { id: "repair", name: "ترمیم مژه", description: "ترمیم مژه‌های قبلی (نیاز به هماهنگی)", price: 1500000, duration: 90, image: "/images/gallery/nemune-1.jpg" },
  { id: "lash-lift", name: "لیفت مژه و لمینیت", description: "فر طبیعی و ماندگار مژه‌ها بدون اکستنشن", price: 1200000, duration: 90, image: "/images/services/lift-moje.jpg" },
  { id: "brow-lift", name: "لیفت ابرو", description: "مرتب‌سازی و فرم‌دهی ابروها", price: 1200000, duration: 90, image: "/images/services/lift-abru.jpg" },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: "انتخاب خدمت" },
    { num: 2, label: "تاریخ و ساعت" },
    { num: 3, label: "توضیحات" },
    { num: 4, label: "تأیید" },
  ];

  const MotionDiv = motion.div as any;

  return (
    <div className="flex flex-col items-center mb-10">
      <div className="flex items-center justify-center gap-0">
        {steps.map((step, i) => (
          <div key={step.num} className="flex items-center">
            <MotionDiv
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                step.num === currentStep
                  ? "bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] shadow-lg shadow-[var(--color-accent)]/30 scale-110 text-[var(--color-bg)]"
                  : step.num < currentStep
                  ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
                  : "bg-[var(--color-card-solid)]/40 text-[var(--color-muted)]"
              }`}
              animate={{ scale: step.num === currentStep ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5 }}
            >
              {step.num < currentStep ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                step.num
              )}
            </MotionDiv>
            {i < steps.length - 1 && (
              <div className="w-16 h-0.5 mx-2 rounded-full bg-[var(--color-card-solid)]/40 overflow-hidden">
                <MotionDiv
                  className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)]"
                  initial={{ width: "0%" }}
                  animate={{ width: step.num <= currentStep ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 sm:gap-8 mt-3 text-[10px] sm:text-xs text-[var(--color-muted)]">
        {steps.map((step) => (
          <span key={step.num} className={`${step.num === currentStep ? "text-[var(--color-accent)] font-medium" : ""} hidden sm:block`}>
            {step.label}
          </span>
        ))}
      </div>
    </div>
  );
}

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export default function BookingClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service") || "";

  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>(STATIC_SERVICES);
  const [selectedService, setSelectedService] = useState<string>(preselectedService);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [note, setNote] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadServices = useCallback(async () => {
    try {
      const res = await fetch("/api/services");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
      }
    } catch {
      // Keep STATIC_SERVICES
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }
    let cancelled = false;
    setSlotsLoading(true);
    setSlotsError("");
    fetch(`/api/bookings/available-slots?date=${selectedDate}`)
      .then(async (r) => {
        if (!r.ok) return FIXED_SLOTS;
        const data = await r.json();
        return Array.isArray(data) ? data : FIXED_SLOTS;
      })
      .then((data: TimeSlot[]) => {
        if (!cancelled) setAvailableSlots(data);
      })
      .catch(() => {
        if (!cancelled) setAvailableSlots(FIXED_SLOTS);
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedDate]);

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

    setBookingLoading(true);
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

      const data = await res.json().catch(() => ({}));
      const bId = data.bookingId || "bk-" + Date.now();
      router.push(`/booking/payment?id=${bId}`);
    } catch {
      router.push(`/booking/payment?id=bk-${Date.now()}`);
    }
  }

  const MotionDiv = motion.div as any;
  const MotionButton = motion.button as any;

  return (
    <div className="min-h-screen px-4 py-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-medium text-[var(--color-fg)] mb-3">رزرو نوبت</h1>
          <p className="text-[var(--color-muted)] font-light">مراحل زیر را برای رزرو وقت خود طی کنید</p>
        </div>

        <StepIndicator currentStep={step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <MotionDiv
                  key="step1"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="glass-card p-6"
                >
                  <h2 className="text-lg font-semibold text-[var(--color-fg)] mb-4">انتخاب خدمت</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.map((service) => (
                      <MotionButton
                        key={service.id}
                        onClick={() => setSelectedService(service.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className={`p-4 rounded-xl text-right transition-all cursor-pointer ${
                          selectedService === service.id ? "slot-selected" : "slot-available"
                        }`}
                      >
                        <div className="font-medium">{service.name}</div>
                        <div className="text-xs opacity-70 mt-1">{service.description}</div>
                        <div className="text-sm font-bold mt-2 text-[var(--color-accent)]">
                          {service.price.toLocaleString("fa-IR")} تومان
                        </div>
                      </MotionButton>
                    ))}
                  </div>
                </MotionDiv>
              )}

              {step === 2 && (
                <MotionDiv
                  key="step2"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="glass-card p-6"
                >
                  <h2 className="text-lg font-semibold text-[var(--color-fg)] mb-6 text-center">انتخاب تاریخ و ساعت</h2>
                  <div className="mb-10 flex justify-center relative z-30">
                    <PersianCalendar
                      selectedDate={selectedDate}
                      onSelectDate={(d) => { setSelectedDate(d); setSelectedSlot(""); }}
                      minDate={today}
                    />
                  </div>
                  {selectedDate && (
                    <>
                      {slotsLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="p-4 rounded-xl bg-[var(--color-card-solid)]/30 animate-shimmer h-12" />
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {FIXED_SLOTS.map((slot) => {
                            const isBooked = availableSlots.length > 0 && !availableSlots.find((s) => s.start === slot.start);
                            return (
                              <MotionButton
                                key={slot.start}
                                onClick={() => !isBooked && setSelectedSlot(slot.start)}
                                disabled={isBooked}
                                whileHover={!isBooked ? { scale: 1.05 } : undefined}
                                whileTap={!isBooked ? { scale: 0.95 } : undefined}
                                className={
                                  selectedSlot === slot.start
                                    ? "slot-selected"
                                    : isBooked
                                    ? "slot-booked"
                                    : "slot-available"
                                }
                              >
                                {slot.label}
                              </MotionButton>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </MotionDiv>
              )}

              {step === 3 && (
                <MotionDiv
                  key="step3"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="glass-card p-6"
                >
                  <h2 className="text-lg font-semibold text-[var(--color-fg)] mb-4">توضیحات تکمیلی (اختیاری)</h2>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="هر نکته یا درخواست خاصی که دارید..."
                    className="input-field min-h-[120px] resize-none"
                    rows={4}
                  />
                </MotionDiv>
              )}
              {step === 4 && (
                <MotionDiv
                  key="step4"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="glass-card p-8"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-display font-medium text-[var(--color-accent-2)] mb-2">تأیید نهایی و پرداخت</h2>
                    <p className="text-[var(--color-muted)] text-sm">لطفاً اطلاعات رزرو خود را با دقت بررسی کنید.</p>
                  </div>
                  
                  <div className="bg-[var(--color-card-solid)]/40 rounded-2xl p-6 border border-white/5 space-y-4 mb-8 text-sm">
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-[var(--color-muted)]">خدمت انتخاب شده:</span>
                      <span className="font-semibold">{selectedServiceData?.name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-[var(--color-muted)]">تاریخ مراجعه:</span>
                      <span className="font-semibold">{formatJalali(selectedDate)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-[var(--color-muted)]">ساعت:</span>
                      <span className="font-semibold">{selectedSlot}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-[var(--color-muted)]">مبلغ کل:</span>
                      <span className="font-semibold">{selectedServiceData?.price.toLocaleString("fa-IR")} تومان</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 text-[var(--color-accent-2)] text-base font-bold">
                      <span>مبلغ پیش‌پرداخت (۳۰٪):</span>
                      <span>{depositAmount.toLocaleString("fa-IR")} تومان</span>
                    </div>
                  </div>
                  
                  <MotionButton
                    onClick={handleBooking}
                    disabled={bookingLoading || !selectedService || !selectedDate || !selectedSlot}
                    whileHover={!(bookingLoading || !selectedService || !selectedDate || !selectedSlot) ? { scale: 1.02 } : undefined}
                    whileTap={!(bookingLoading || !selectedService || !selectedDate || !selectedSlot) ? { scale: 0.98 } : undefined}
                    className="btn-primary w-full py-4 text-base cursor-pointer rounded-full shadow-[0_0_30px_rgba(139,92,246,0.4)] block lg:hidden"
                  >
                    {bookingLoading ? "در حال انتقال به درگاه..." : session ? "تأیید و پرداخت نهایی" : "ورود برای پرداخت"}
                  </MotionButton>
                </MotionDiv>
              )}
            </AnimatePresence>

            <div className="flex justify-between gap-4 mt-8">
              {step > 1 ? (
                <MotionButton
                  onClick={() => setStep(step - 1)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-ghost text-sm py-3 px-8 cursor-pointer rounded-full"
                >
                  مرحله قبل
                </MotionButton>
              ) : (
                <div />
              )}
              {step < 4 ? (
                <MotionButton
                  onClick={() => {
                    if (step === 1 && !selectedService) { setMessage("لطفاً یک خدمت را انتخاب کنید"); return; }
                    if (step === 2 && (!selectedDate || !selectedSlot)) { setMessage("لطفاً تاریخ و ساعت را انتخاب کنید"); return; }
                    setMessage("");
                    setStep(step + 1);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary text-sm py-3 px-8 cursor-pointer rounded-full shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                  مرحله بعد
                </MotionButton>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-1 hidden lg:block">
            <div className="glass-card p-6 lg:sticky top-24">
              <h2 className="text-lg font-semibold text-[var(--color-fg)] mb-4">خلاصه رزرو</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">خدمت:</span>
                  <span className="text-[var(--color-fg)]">{selectedServiceData?.name || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">تاریخ:</span>
                  <span className="text-[var(--color-fg)]">{formatJalali(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">ساعت:</span>
                  <span className="text-[var(--color-fg)]">{selectedSlot || "—"}</span>
                </div>
                <hr className="border-[var(--color-accent)]/10" />
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">قیمت:</span>
                  <span className="text-[var(--color-fg)]">{selectedServiceData?.price.toLocaleString("fa-IR")} تومان</span>
                </div>
                <div className="flex justify-between text-[var(--color-accent)] font-bold">
                  <span>پیش‌پرداخت (۳۰٪):</span>
                  <span>{depositAmount.toLocaleString("fa-IR")} تومان</span>
                </div>
              </div>

              {message && (
                <p className="text-sm mt-3 text-[var(--color-danger)] text-center animate-shake">{message}</p>
              )}

              {step === 4 && (
                <MotionButton
                  onClick={handleBooking}
                  disabled={bookingLoading || !selectedService || !selectedDate || !selectedSlot}
                  whileHover={!(bookingLoading || !selectedService || !selectedDate || !selectedSlot) ? { scale: 1.02 } : undefined}
                  whileTap={!(bookingLoading || !selectedService || !selectedDate || !selectedSlot) ? { scale: 0.98 } : undefined}
                  className="btn-primary w-full mt-5 cursor-pointer rounded-full shadow-[0_0_30px_rgba(139,92,246,0.4)]"
                >
                  {bookingLoading ? "در حال انتقال..." : session ? "پرداخت نهایی" : "ورود برای پرداخت"}
                </MotionButton>
              )}

              {!session && (
                <p className="text-xs text-[var(--color-muted)] text-center mt-3">
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
