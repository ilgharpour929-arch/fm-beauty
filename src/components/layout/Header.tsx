"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 120 120" fill="none">
    <defs>
      <linearGradient id="hdr" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="50%" stopColor="#C084FC" />
        <stop offset="100%" stopColor="#7DD3FC" />
      </linearGradient>
    </defs>
    <circle cx="60" cy="60" r="54" stroke="url(#hdr)" strokeWidth="2" fill="rgba(30, 41, 59, 0.5)" />
    <path d="M12 60c0-26.5 21.5-48 48-48s48 21.5 48 48" stroke="url(#hdr)" strokeWidth="1" strokeDasharray="3 5" opacity="0.5" fill="none" />
    <path d="M32 85V30h32v8H44v18h16v8H44v21H32zM76 85V30h8l16 26 16-26h8v55h-12V52l-12 20-12-20v33H76z" fill="url(#hdr)" opacity="0.95" />
    <path d="M80 30c6-8 16-12 24-7" stroke="url(#hdr)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" fill="none" />
    <path d="M32 30c0-6 6-9 12-6" stroke="url(#hdr)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" fill="none" />
    <circle cx="60" cy="98" r="3" fill="url(#hdr)" />
  </svg>
);

const navLinks = [
  { href: "/", label: "صفحه اصلی" },
  { href: "/services", label: "خدمات" },
  { href: "/booking", label: "رزرو آنلاین" },
  { href: "/about", label: "درباره ما" },
  { href: "/contact", label: "تماس" },
  { href: "/faq", label: "سوالات" },
];

export function Header() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAdmin = session?.user && (session.user as any).role === "ADMIN";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-350 ${
        scrolled
          ? "bg-[rgba(11,17,32,0.92)] backdrop-blur-[20px] border-b border-[rgba(139,92,246,0.2)] py-3 shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-[var(--color-fg)] no-underline group">
          <Logo />
          <span className="font-display text-xl font-bold tracking-wide group-hover:text-[var(--color-accent)] transition-colors">
            FM Beauty
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[var(--color-muted)] text-sm font-medium tracking-[0.02em] no-underline transition-colors duration-200 hover:text-[var(--color-fg)] relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-[var(--color-accent)] after:to-[var(--color-accent-2)] after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              {isAdmin ? (
                <Link href="/admin" className="btn-primary !py-2 !px-4 text-sm hidden sm:inline-flex">
                  پنل مدیریت
                </Link>
              ) : (
                <Link href="/dashboard" className="btn-ghost !py-2 !px-4 text-sm hidden sm:inline-flex">
                  حساب من
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="text-xs text-[var(--color-muted)] hover:text-[var(--color-danger)] transition-colors hidden sm:inline-block px-2"
              >
                خروج
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn-ghost !py-2 !px-4 text-sm hidden sm:inline-flex">ورود</Link>
              <Link href="/auth/register" className="btn-primary !py-2 !px-5 text-sm hidden sm:inline-flex">ثبت نام</Link>
            </>
          )}

          {/* Hamburger button */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 rounded-xl bg-[rgba(212,163,115,0.1)] border border-[rgba(212,163,115,0.2)] text-[var(--color-fg)] cursor-pointer hover:bg-[rgba(212,163,115,0.2)] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="منوی موبایل"
          >
            <span className={`block w-5 h-0.5 bg-[var(--color-fg)] rounded transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-[var(--color-fg)] rounded transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-[var(--color-fg)] rounded transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-[rgba(26,10,30,0.95)] backdrop-blur-[24px] border-b border-[rgba(212,163,115,0.2)] shadow-2xl overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <div className="px-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-[var(--color-fg)] text-base font-medium py-2.5 px-3 rounded-lg hover:bg-[rgba(212,163,115,0.1)] hover:text-[var(--color-accent)] transition-all"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-3 border-t border-[rgba(139,92,246,0.15)] sm:hidden">
            {session ? (
              <>
                {isAdmin ? (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 !py-2.5 text-sm text-center">پنل مدیریت</Link>
                ) : (
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="btn-ghost flex-1 !py-2.5 text-sm text-center">حساب من</Link>
                )}
                <button onClick={() => { setMenuOpen(false); signOut(); }} className="btn-ghost !py-2.5 text-sm text-[var(--color-danger)]">خروج</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="btn-ghost flex-1 !py-2.5 text-sm text-center">ورود</Link>
                <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 !py-2.5 text-sm text-center">ثبت نام</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
