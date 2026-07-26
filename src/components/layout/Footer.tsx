import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d4a373" />
                    <stop offset="100%" stopColor="#e8c4a0" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" stroke="url(#logoGrad2)" strokeWidth="1.5" fill="rgba(212,168,83,0.05)" />
                <text x="50" y="60" textAnchor="middle" fontFamily="Georgia,serif" fontSize="30" fontWeight="bold" fill="url(#logoGrad2)" letterSpacing="1">FM</text>
              </svg>
              <span className="font-bold text-[var(--color-accent)]">FM Beauty</span>
            </div>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              سالن زیبایی تخصصی مژه فاطمه محمدی. ارائه خدمات اکستنشن مژه، لیفت مژه و لیفت ابرو با بالاترین کیفیت.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-[var(--color-fg)] mb-3">خدمات</h3>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li><Link href="/services" className="hover:text-[var(--color-accent)] transition-colors">اکستنشن مژه والیوم</Link></li>
              <li><Link href="/services" className="hover:text-[var(--color-accent)] transition-colors">اکستنشن مژه اسپایکی</Link></li>
              <li><Link href="/services" className="hover:text-[var(--color-accent)] transition-colors">اکستنشن مژه نچرال</Link></li>
              <li><Link href="/services" className="hover:text-[var(--color-accent)] transition-colors">ترمیم مژه</Link></li>
              <li><Link href="/services" className="hover:text-[var(--color-accent)] transition-colors">لیفت مژه و لمینیت</Link></li>
              <li><Link href="/services" className="hover:text-[var(--color-accent)] transition-colors">لیفت ابرو</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-[var(--color-fg)] mb-3">ارتباط با ما</h3>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li>فاطمه محمدی</li>
              <li>ساعات کاری: ۹:۰۰ تا ۲۰:۰۰</li>
              <li>تماس: ۰۹۱۲×××××××</li>
              <li>اینستاگرام: @fm_beauty</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-6 text-center text-sm text-[var(--color-muted)]/60">
          <p>تمامی حقوق برای FM Beauty محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
