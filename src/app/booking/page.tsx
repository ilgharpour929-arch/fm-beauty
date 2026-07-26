import type { Metadata } from "next";
import { Suspense } from "react";
import BookingClient from "./BookingClient";

export const metadata: Metadata = {
  title: "رزرو نوبت آنلاین",
  description:
    "رزرو آنلاین نوبت اکستنشن مژه، لیفت مژه و لیفت ابرو | انتخاب تاریخ و ساعت دلخواه",
};

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-[var(--color-muted)]">در حال بارگذاری صفحه رزرو...</p>
        </div>
      </div>
    }>
      <BookingClient />
    </Suspense>
  );
}
