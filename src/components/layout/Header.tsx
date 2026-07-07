"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = session?.user as any;
  const isAdmin = user?.role === "ADMIN";

  const navLinks = [
    { href: "/", label: "خانه" },
    { href: "/booking", label: "رزرو" },
  ];

  return (
    <header className="sticky top-0 z-50 glass-card-dark rounded-none border-x-0 border-t-0">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <FMLogo />
            <span className="text-lg font-bold text-gold hidden sm:block">FM Beauty</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  pathname === link.href
                    ? "text-gold font-medium"
                    : "text-cream/70 hover:text-cream"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 btn-outline text-sm py-2 px-4"
              >
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-dark-900 text-xs font-bold">
                  {user?.name?.charAt(0) || "U"}
                </span>
                <span className="hidden sm:block">{user?.name}</span>
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute left-0 top-full mt-2 w-52 glass-card z-50 p-2 animate-slide-down">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-cream/80 hover:text-gold rounded-lg hover:bg-white/5 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      پنل کاربری
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-cream/80 hover:text-gold rounded-lg hover:bg-white/5 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        پنل مدیریت
                      </Link>
                    )}
                    <hr className="border-white/5 my-1" />
                    <button
                      onClick={() => { setProfileOpen(false); signOut(); }}
                      className="block w-full text-right px-4 py-2 text-sm text-danger/80 hover:text-danger rounded-lg hover:bg-white/5 transition-colors"
                    >
                      خروج
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="btn-primary text-sm py-2 px-5">
              ورود / ثبت‌نام
            </Link>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-cream/70 hover:text-cream"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden glass-card-dark rounded-none border-x-0 border-b-0 p-4 animate-slide-down">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  pathname === link.href ? "text-gold font-medium" : "text-cream/70"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function FMLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4a853" />
          <stop offset="100%" stopColor="#b8923e" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" stroke="url(#logoGrad)" strokeWidth="2" fill="rgba(212,168,83,0.05)" />
      <text x="50" y="62" textAnchor="middle" fontFamily="Georgia,serif" fontSize="42" fontWeight="bold" fill="url(#logoGrad)" letterSpacing="2">
        FM
      </text>
      <circle cx="50" cy="50" r="45" stroke="url(#logoGrad)" strokeWidth="1" fill="none" opacity="0.3" />
    </svg>
  );
}
