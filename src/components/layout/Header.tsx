"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const Logo = () => (
  <svg width="28" height="28" viewBox="0 0 120 120" fill="none">
    <defs>
      <linearGradient id="hdr" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#D4AF37" />
        <stop offset="50%" stopColor="#D6C6A5" />
        <stop offset="100%" stopColor="#E8DCC8" />
      </linearGradient>
    </defs>
    <circle cx="60" cy="60" r="54" stroke="url(#hdr)" strokeWidth="1.5" fill="oklch(22% 0.08 155 / 0.4)" />
    <path d="M12 60c0-26.5 21.5-48 48-48s48 21.5 48 48" stroke="url(#hdr)" strokeWidth="0.8" strokeDasharray="3 5" opacity="0.4" fill="none" />
    <path d="M32 85V30h32v8H44v18h16v8H44v21H32zM76 85V30h8l16 26 16-26h8v55h-12V52l-12 20-12-20v33H76z" fill="url(#hdr)" opacity="0.9" />
    <path d="M80 30c6-8 16-12 24-7" stroke="url(#hdr)" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" fill="none" />
    <path d="M32 30c0-6 6-9 12-6" stroke="url(#hdr)" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" fill="none" />
    <circle cx="56" cy="98" r="2.5" fill="url(#hdr)" opacity="0.5" />
  </svg>
);

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-350 ${
        scrolled
          ? "bg-[oklch(15%_0.06_160/0.85)] backdrop-blur-[20px] border-b border-[oklch(70%_0.04_85/0.15)] py-2.5"
          : "py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-[var(--color-fg)] no-underline">
          <Logo />
          <span className="font-display text-lg font-semibold">FM Beauty</span>
        </Link>

        <div className={`hidden md:flex items-center gap-6 ${menuOpen ? "open" : ""}`}>
          {[
            { href: "/", label: "صفحه اصلی" },
            { href: "/booking", label: "رزرو آنلاین" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[var(--color-muted)] text-sm font-[450] tracking-[0.02em] no-underline transition-colors duration-200 hover:text-[var(--color-fg)] relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-gradient-to-r after:from-[var(--color-accent)] after:to-[var(--color-accent-2)] after:transition-all after:duration-350 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/api/auth/signin" className="btn-ghost !py-2 !px-4 text-sm">ورود</Link>
          <button
            className="md:hidden flex flex-col gap-1.5 p-1 bg-transparent border-none cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="block w-5 h-0.5 bg-[var(--color-fg)] rounded" />
            <span className="block w-5 h-0.5 bg-[var(--color-fg)] rounded" />
            <span className="block w-5 h-0.5 bg-[var(--color-fg)] rounded" />
          </button>
        </div>
      </div>
    </nav>
  );
}