import type { Metadata } from "next";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "ثبت‌نام در سالن زیبایی",
  description: "ایجاد حساب کاربری جدید در FM Beauty",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
