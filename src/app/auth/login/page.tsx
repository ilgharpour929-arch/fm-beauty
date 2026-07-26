import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "ورود به حساب کاربری",
  description: "ورود به حساب کاربری سالن زیبایی FM Beauty",
};

export default function LoginPage() {
  return <LoginForm />;
}
