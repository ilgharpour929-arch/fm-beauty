import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-light)] px-6 py-16 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <span className="font-display text-lg font-semibold text-[var(--color-fg)] block mb-4">FM Beauty</span>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed">
            سالن زیبایی حرفه‌ای با خدمات تخصصی اکستنشن مژه، لیفت و لمینیت. تجربه‌ای لوکس و مدرن.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold tracking-[0.06em] uppercase text-[var(--color-fg)] mb-4 font-sans">دسترسی سریع</h4>
          <div className="flex flex-col gap-2 text-sm text-[var(--color-muted)]">
            <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">صفحه اصلی</Link>
            <Link href="/booking" className="hover:text-[var(--color-accent)] transition-colors">رزرو آنلاین</Link>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold tracking-[0.06em] uppercase text-[var(--color-fg)] mb-4 font-sans">حساب کاربری</h4>
          <div className="flex flex-col gap-2 text-sm text-[var(--color-muted)]">
            <Link href="/api/auth/signin" className="hover:text-[var(--color-accent)] transition-colors">ورود</Link>
            <Link href="/api/auth/signin" className="hover:text-[var(--color-accent)] transition-colors">ثبت نام</Link>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold tracking-[0.06em] uppercase text-[var(--color-fg)] mb-4 font-sans">اطلاعات تماس</h4>
          <p className="text-sm text-[var(--color-muted)]">فاطمه محمدی</p>
          <p className="text-sm text-[var(--color-muted)]">ساعت کاری: ۹ صبح تا ۸ شب</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[var(--color-border-light)] flex flex-wrap justify-between items-center gap-4">
        <p className="text-xs text-[var(--color-muted)]">© 2026 FM Beauty. تمامی حقوق محفوظ است.</p>
      </div>
    </footer>
  );
}