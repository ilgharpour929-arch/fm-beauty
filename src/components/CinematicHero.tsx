"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function CinematicHero() {
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v1 = videoRef1.current;
    const v2 = videoRef2.current;
    if (!v1 || !v2) return;

    const playBoth = () => {
      v1.play().catch(() => {});
      v2.play().catch(() => {});
    };

    window.addEventListener("load", playBoth);
    // Attempt autoplay immediately
    playBoth();

    const handleTimeUpdate = (e: Event) => {
      const active = e.target as HTMLVideoElement;
      const inactive = active === v1 ? v2 : v1;
      
      // Start crossfade 1 second before end
      if (active.duration && active.currentTime > active.duration - 1) {
        if (inactive.paused) {
          inactive.currentTime = 0;
          inactive.play().catch(() => {});
          
          // Crossfade
          active.style.opacity = "0";
          inactive.style.opacity = "1";
          
          setTimeout(() => {
            active.pause();
          }, 900);
        }
      }
    };

    v1.addEventListener("timeupdate", handleTimeUpdate);
    v2.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      window.removeEventListener("load", playBoth);
      v1.removeEventListener("timeupdate", handleTimeUpdate);
      v2.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  return (
    <section className="relative w-full h-[100svh] min-h-[600px] flex items-end justify-center pb-24 md:pb-32 overflow-hidden bg-[#0B1120]">
      {/* Background Videos (Crossfade) */}
      <div className="absolute inset-0 z-0">
        <video 
          ref={videoRef1}
          src="https://zxdefgavgwfxastwmmjm.supabase.co/storage/v1/object/public/assets/flux.mp4"
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[900ms] ease-linear opacity-100"
          style={{ filter: "blur(2px) saturate(1.2)" }}
        />
        <video 
          ref={videoRef2}
          src="https://zxdefgavgwfxastwmmjm.supabase.co/storage/v1/object/public/assets/flux.mp4"
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[900ms] ease-linear opacity-0"
          style={{ filter: "blur(2px) saturate(1.2)" }}
        />
      </div>

      {/* Cinematic Scrim for Dark Theme Legibility */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none mix-blend-multiply" 
        style={{
          background: "radial-gradient(circle at center, rgba(11,17,32,0.4) 0%, rgba(11,17,32,1) 100%)",
        }}
      />
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-t from-[#0B1120] via-transparent to-[#0B1120]/60" />
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[#0B1120]/20 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1], delay: 0.2 }}
          className="inline-flex items-center gap-3 mb-6"
        >
          <div className="h-[1px] w-8 bg-white/30" />
          <span className="text-sm md:text-base tracking-[0.3em] uppercase text-white/80 font-medium">لوکس و مینیمالیست</span>
          <div className="h-[1px] w-8 bg-white/30" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1], delay: 0.4 }}
          className="font-display text-6xl md:text-8xl lg:text-9xl font-medium tracking-tight leading-[1.05] text-white mb-6 drop-shadow-2xl"
        >
          زیبایی بی‌نقص، <br className="hidden md:block" />
          <span className="text-white/80 italic">ظرافت بی‌نظیر.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1], delay: 0.6 }}
          className="text-lg md:text-xl text-white/70 max-w-2xl font-light mb-12 drop-shadow-md"
        >
          ما حضور دیجیتال FM Beauty را بازتعریف می‌کنیم. با لمس‌های مدرن، زیبا و حرفه‌ای به زیبایی خود ارزش ببخشید.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1], delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <Link href="/booking" className="group relative overflow-hidden rounded-full bg-white/5 px-10 py-4 backdrop-blur-md border border-white/20 transition-all hover:bg-white/10 hover:border-white/40 shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:shadow-[0_0_60px_rgba(255,255,255,0.15)]">
            <span className="relative z-10 flex items-center gap-2 text-white font-sans font-medium tracking-widest uppercase text-sm">
              رزرو نوبت
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:-translate-x-1">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </span>
          </Link>
          <Link href="#services" className="text-white/60 hover:text-white transition-colors text-sm tracking-widest uppercase pb-1 border-b border-white/20 hover:border-white font-sans">
            مشاهده خدمات
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
