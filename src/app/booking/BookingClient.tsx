"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: "انتخاب خدمت" },
    { num: 2, label: "تاریخ و ساعت" },
    { num: 3, label: "توضیحات" },
  ];

  const MotionDiv = motion.div as any;

  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <MotionDiv
            className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
              step.num === currentStep
                ? "bg-gradient-to-br from-accent-500 to-accent-400 shadow-lg shadow-accent-500/30 scale-110"
                : step.num < currentStep
                ? "bg-accent-500/20 text-accent-400"
                : "bg-primary-700/40 text-text-muted"
            }`}
            animate={{
              scale: step.num === currentStep ? [1, 1.1, 1] : 1,
            }}
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
            <div className="w-16 h-0.5 mx-2 rounded-full bg-primary-700/40 overflow-hidden">
              <MotionDiv
                className="h-full bg-gradient-to-r from-accent-500 to-accent-400"
                initial={{ width: "0%" }}
                animate={{ width: step.num <= currentStep ? "100%" : "0%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          )}
        </div>
      ))}
      <div className="flex justify-center gap-2 sm:gap-8 mt-2 text-[10px] sm:text-xs text-text-muted">
        {steps.map((step) => (
          <span key={step.num} className={`${step.num === currentStep ? "text-accent-500 font-medium" : ""} hidden sm:block`}>
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

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `خطا در برقراری ارتباط (${res.status})`);
  }
  return res.json();
}

export default function BookingClient() {
  const { data: session } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [note, setNote] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadServices = useCallback(async () => {
    setServicesLoading(true);
    setServicesError("");
    try {
      const data = await fetchJson<Service[]>("/api/services");
      setServices(data);
    } catch (e: any) {
      setServicesError(e.message || "خطا در دریافت لیست خدمات");
    } finally {
      setServicesLoading(false);
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
        if (!r.ok) throw new Error("خطا در دریافت ساعات خالی");
        return r.json();
      })
      .then((data: TimeSlot[]) => {
        if (!cancelled) setAvailableSlots(data);
      })
      .catch((e) => {
        if (!cancelled) setSlotsError(e.message || "خطا در دریافت ساعات خالی");
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => { cancelled = true; };
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

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "خطا در رزرو");
        setBookingLoading(false);
        return;
      }

      router.push(`/booking/payment?id=${data.bookingId}`);
    } catch {
      setMessage("خطا در ارتباط با سرور");
      setBookingLoading(false);
    }
  }

  const MotionDiv = motion.div as any;
  const MotionButton = motion.button as any;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">رزرو نوبت</h1>
          <p className="text-text-muted">تاریخ و ساعت مورد نظر خود را انتخاب کنید</p>
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
                  <h2 className="text-lg font-semibold text-text-primary mb-4">انتخاب خدمت</h2>
                  {servicesLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-4 rounded-xl bg-primary-700/30 animate-shimmer h-24" />
                      ))}
                    </div>
                  ) : servicesError ? (
                    <div className="text-center py-8">
                      <p className="text-danger mb-3">{servicesError}</p>
                      <button onClick={loadServices} className="btn-primary text-sm py-2 px-6">
                        تلاش مجدد
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {services.map((service) => (
                        <MotionButton
                          key={service.id}
                          onClick={() => setSelectedService(service.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          className={`p-4 rounded-xl text-right transition-all ${
                            selectedService === service.id ? "slot-selected" : "slot-available"
                          }`}
                        >
                          <div className="font-medium">{service.name}</div>
                          <div className="text-xs opacity-70 mt-1">{service.description}</div>
                          <div className="text-sm font-bold mt-2 text-accent-500">
                            {service.price.toLocaleString("fa-IR")} تومان
                          </div>
                        </MotionButton>
                      ))}
                    </div>
                  )}
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
                  <h2 className="text-lg font-semibold text-text-primary mb-4">انتخاب تاریخ و ساعت</h2>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(""); }}
                    min={today}
                    className="input-field mb-4"
                  />
                  {selectedDate && (
                    <>
                      {slotsLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="p-4 rounded-xl bg-primary-700/30 animate-shimmer h-12" />
                          ))}
                        </div>
                      ) : slotsError ? (
                        <div className="text-center py-6">
                          <p className="text-danger mb-3">{slotsError}</p>
                          <button
                            onClick={() => setSelectedDate(selectedDate)}
                            className="btn-primary text-sm py-2 px-6"
                          >
                            تلاش مجدد
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {generateDailySlots().map((slot) => {
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
                  <h2 className="text-lg font-semibold text-text-primary mb-4">توضیحات تکمیلی (اختیاری)</h2>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="هر نکته یا درخواست خاصی که دارید..."
                    className="input-field min-h-[120px] resize-none"
                    rows={4}
                  />
                </MotionDiv>
              )}
            </AnimatePresence>

            <div className="flex justify-between gap-4">
              {step > 1 ? (
                <MotionButton
                  onClick={() => setStep(step - 1)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-outline text-sm py-2.5 px-6"
                >
                  مرحله قبل
                </MotionButton>
              ) : (
                <div />
              )}
              {step < 3 ? (
                <MotionButton
                  onClick={() => {
                    if (step === 1 && !selectedService) { setMessage("لطفاً یک خدمت را انتخاب کنید"); return; }
                    if (step === 2 && (!selectedDate || !selectedSlot)) { setMessage("لطفاً تاریخ و ساعت را انتخاب کنید"); return; }
                    setMessage("");
                    setStep(step + 1);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary text-sm py-2.5 px-6"
                >
                  مرحله بعد
                </MotionButton>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="glass-card p-6 lg:sticky top-24">
              <h2 className="text-lg font-semibold text-text-primary mb-4">خلاصه رزرو</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">خدمت:</span>
                  <span className="text-text-primary">{selectedServiceData?.name || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">تاریخ:</span>
                  <span className="text-text-primary">{selectedDate || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">ساعت:</span>
                  <span className="text-text-primary">{selectedSlot || "—"}</span>
                </div>
                <hr className="border-accent-500/10" />
                <div className="flex justify-between">
                  <span className="text-text-muted">قیمت:</span>
                  <span className="text-text-primary">{selectedServiceData?.price.toLocaleString("fa-IR")} تومان</span>
                </div>
                <div className="flex justify-between text-accent-500 font-bold">
                  <span>پیش‌پرداخت (۳۰٪):</span>
                  <span>{depositAmount.toLocaleString("fa-IR")} تومان</span>
                </div>
              </div>

              {message && (
                <p className="text-sm mt-3 text-danger text-center animate-shake">{message}</p>
              )}

              {step === 3 && (
                <MotionButton
                  onClick={handleBooking}
                  disabled={bookingLoading || !selectedService || !selectedDate || !selectedSlot}
                  whileHover={!(bookingLoading || !selectedService || !selectedDate || !selectedSlot) ? { scale: 1.02 } : undefined}
                  whileTap={!(bookingLoading || !selectedService || !selectedDate || !selectedSlot) ? { scale: 0.98 } : undefined}
                  className="btn-primary w-full mt-5"
                >
                  {bookingLoading ? "در حال ثبت..." : session ? "ادامه و پرداخت" : "ورود برای رزرو"}
                </MotionButton>
              )}

              {!session && (
                <p className="text-xs text-text-muted text-center mt-3">
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