import type { Metadata } from "next";
import BookingClient from "./BookingClient";

export const metadata: Metadata = {
  title: "رزرو نوبت آنلاین",
  description:
    "رزرو آنلاین نوبت اکستنشن مژه، لیفت مژه و لیفت ابرو | انتخاب تاریخ و ساعت دلخواه",
};

export default function BookingPage() {
  return <BookingClient />;
}
