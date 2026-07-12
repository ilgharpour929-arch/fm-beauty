export function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d4a853" />
                    <stop offset="100%" stopColor="#b8923e" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" stroke="url(#logoGrad2)" strokeWidth="1.5" fill="rgba(212,168,83,0.05)" />
                <text x="50" y="60" textAnchor="middle" fontFamily="Georgia,serif" fontSize="30" fontWeight="bold" fill="url(#logoGrad2)" letterSpacing="1">FM</text>
              </svg>
              <span className="font-bold text-gold">FM Beauty</span>
            </div>
            <p className="text-sm text-cream/50 leading-relaxed">
              سالن زیبایی تخصصی مژه فاطمه محمدی. ارائه خدمات اکستنشن مژه، لیفت مژه و لیفت ابرو با بالاترین کیفیت.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-cream mb-3">خدمات</h3>
            <ul className="space-y-2 text-sm text-cream/50">
              <li>اکستنشن مژه والیوم</li>
              <li>اکستنشن مژه اسپایکی</li>
              <li>اکستنشن مژه نچرال</li>
              <li>ترمیم مژه</li>
              <li>لیفت مژه و لمینیت</li>
              <li>لیفت ابرو</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-cream mb-3">ارتباط با ما</h3>
            <ul className="space-y-2 text-sm text-cream/50">
              <li>فاطمه محمدی</li>
              <li>ساعات کاری: ۹:۰۰ تا ۲۰:۰۰</li>
              <li>تماس: ۰۹۱۲×××××××</li>
              <li>اینستاگرام: @fm_beauty</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-6 text-center text-sm text-cream/30">
          <p>تمامی حقوق برای FM Beauty محفوظ است. طراحی و توسعه با ❤️</p>
        </div>
      </div>
    </footer>
  );
}
