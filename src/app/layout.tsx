import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SessionProvider } from "@/components/SessionProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";

export const metadata: Metadata = {
  title: {
    default: "FM Beauty | سالن زیبایی حرفه‌ای مژه و ابرو",
    template: "%s | FM Beauty",
  },
  description:
    "سالن زیبایی تخصصی مژه فاطمه محمدی | اکستنشن مژه والیوم، اسپایکی، نچرال، لیفت مژه و لیفت ابرو با بهترین کیفیت در ارومیه | رزرو آنلاین نوبت",
  keywords: [
    "اکستنشن مژه", "لیفت مژه", "لیفت ابرو", "سالن زیبایی ارومیه",
    "اکستنشن مژه ارومیه", "لیفت مژه ارومیه", "فاطمه محمدی", "FM Beauty", "ارومیه",
  ],
  authors: [{ name: "Fatemeh Mohammadi" }],
  creator: "FM Beauty",
  publisher: "FM Beauty",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "FM Beauty",
    title: "FM Beauty | سالن زیبایی تخصصی مژه و ابرو در ارومیه",
    description: "اکستنشن مژه والیوم، اسپایکی، نچرال، لیفت مژه و لیفت ابرو تخصصی در ارومیه با رزرو آنلاین نوبت",
    url: "https://fmbeauty.ir",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B1120",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: "FM Beauty",
    image: "https://fmbeauty.ir/images/hero-bg.jpg",
    "@id": "https://fmbeauty.ir",
    url: "https://fmbeauty.ir",
    telephone: "+989141898006",
    address: {
      "@type": "PostalAddress",
      streetAddress: "ارومیه",
      addressLocality: "Urmia",
      addressRegion: "West Azerbaijan",
      addressCountry: "IR"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 37.5527,
      longitude: 45.0761
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday"
      ],
      opens: "09:00",
      closes: "19:00"
    },
    priceRange: "$$"
  };

  return (
    <html lang="fa" dir="rtl" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <meta name="google" content="notranslate" />
        <meta name="geo.region" content="IR-02" />
        <meta name="geo.placename" content="Urmia" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <CustomCursor />
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