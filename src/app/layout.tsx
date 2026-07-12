import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SessionProvider } from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: {
    default: "FM Beauty | سالن زیبایی حرفه‌ای مژه و ابرو",
    template: "%s | FM Beauty",
  },
  description:
    "سالن زیبایی تخصصی مژه فاطمه محمدی | اکستنشن مژه والیوم، اسپایکی، نچرال، لیفت مژه و لیفت ابرو با بهترین کیفیت در تهران",
  keywords: [
    "اکستنشن مژه", "لیفت مژه", "لیفت ابرو", "سالن زیبایی",
    "مژه", "فاطمه محمدی", "FM Beauty", "زیبایی", "تهران",
  ],
  authors: [{ name: "Fatemeh Mohammadi" }],
  creator: "FM Beauty",
  publisher: "FM Beauty",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "FM Beauty",
    title: "FM Beauty | سالن زیبایی حرفه‌ای مژه و ابرو",
    description: "اکستنشن مژه والیوم، اسپایکی، نچرال، لیفت مژه و لیفت ابرو",
    url: "https://fmbeauty.ir",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B1120",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className="antialiased">
      <head>
        <meta name="google" content="notranslate" />
        <meta name="geo.region" content="IR" />
        <meta name="geo.placename" content="Tehran" />
      </head>
      <body className="min-h-screen flex flex-col">
        <div className="floating-orbs" aria-hidden="true">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <SessionProvider>
          <Header />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}