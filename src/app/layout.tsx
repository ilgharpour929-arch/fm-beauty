import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SessionProvider } from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FM Beauty | سالن زیبایی تخصصی مژه و ابرو",
    template: "%s | FM Beauty",
  },
  description:
    "سالن زیبایی تخصصی مژه فاطمه محمدی | اکستنشن مژه والیوم، اسپایکی، نچرال، لیفت مژه و لیفت ابرو با بهترین کیفیت در تهران",
  keywords: [
    "اکستنشن مژه",
    "لیفت مژه",
    "لیفت ابرو",
    "سالن زیبایی",
    "مژه",
    "فاطمه محمدی",
    "FM Beauty",
    "زیبایی",
    "تهران",
    "کاشت مژه",
    "لمینیت مژه",
  ],
  authors: [{ name: "Fatemeh Mohammadi" }],
  creator: "FM Beauty",
  publisher: "FM Beauty",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "FM Beauty",
    title: "FM Beauty | سالن زیبایی تخصصی مژه و ابرو",
    description:
      "اکستنشن مژه والیوم، اسپایکی، نچرال، لیفت مژه و لیفت ابرو با بهترین کیفیت",
    url: "https://fmbeauty.ir",
  },
  twitter: {
    card: "summary_large_image",
    title: "FM Beauty | سالن زیبایی تخصصی مژه و ابرو",
    description:
      "اکستنشن مژه والیوم، اسپایکی، نچرال، لیفت مژه و لیفت ابرو با بهترین کیفیت",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0f",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "FM Beauty",
  description:
    "سالن زیبایی تخصصی مژه فاطمه محمدی - ارائه خدمات اکستنشن مژه والیوم، اسپایکی، نچرال، لیفت مژه و لیفت ابرو",
  url: "https://fmbeauty.ir",
  telephone: "0912xxxxxxx",
  email: "info@fmbeauty.ir",
  founder: {
    "@type": "Person",
    name: "Fatemeh Mohammadi",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "IR",
    addressLocality: "Tehran",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "20:00",
    },
  ],
  priceRange: "$$",
  image: "https://fmbeauty.ir/placeholder.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="google" content="notranslate" />
        <meta name="geo.region" content="IR" />
        <meta name="geo.placename" content="Tehran" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-dark-900 text-cream">
        <SessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
