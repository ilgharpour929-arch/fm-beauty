"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FloatingOrbs } from "@/components/ui/FloatingOrbs";

export function HeroClient() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <Image
        src="/images/hero/hero-bg.jpg"
        alt="نمونه کار سالن زیبایی FM Beauty"
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover"
        style={{ filter: "brightness(0.3) saturate(0.8)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900/70 via-primary-800/50 to-primary-900/80" />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(212, 163, 115, 0.12) 0%, transparent 70%)",
      }} />
      <FloatingOrbs />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
            <defs>
              <linearGradient id="heroLogo" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4a373" />
                <stop offset="100%" stopColor="#e8c4a0" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" stroke="url(#heroLogo)" strokeWidth="1.5" fill="rgba(212,163,115,0.05)" />
            <text x="50" y="62" textAnchor="middle" fontFamily="Georgia,serif" fontSize="42" fontWeight="bold" fill="url(#heroLogo)" letterSpacing="2">
              FM
            </text>
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="font-bold mb-4"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
        >
          <span className="bg-gradient-to-r from-accent-500 via-accent-400 to-accent-300 bg-clip-text text-transparent">
            FM Beauty
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="text-xl md:text-2xl text-text-secondary mb-3"
        >
          سالن زیبایی تخصصی مژه
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="text-base text-text-muted mb-8"
        >
          فاطمه محمدی | با بیش از ۵ سال تجربه درخشان
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/booking" className="btn-primary text-lg px-8 py-3">
            رزرو نوبت
          </Link>
          <Link href="#services" className="btn-outline text-lg px-8 py-3">
            مشاهده خدمات
          </Link>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-900 to-transparent" />
    </section>
  );
}
