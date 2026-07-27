// Utility for 100% accurate Iranian / Jalali (Shamsi) calendar conversion & formatting
// Uses native Intl.DateTimeFormat (zero external dependencies, full React 19 compatibility)

export interface JalaliDateParts {
  year: number;
  month: number;
  day: number;
}

const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(num: number | string): string {
  return String(num).replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d)]);
}

export function getJalaliParts(date: Date): JalaliDateParts {
  const dtf = new Intl.DateTimeFormat("en-US-u-ca-persian", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const parts = dtf.formatToParts(date);
  let year = 0;
  let month = 0;
  let day = 0;

  for (const part of parts) {
    if (part.type === "year") year = parseInt(part.value, 10);
    if (part.type === "month") month = parseInt(part.value, 10);
    if (part.type === "day") day = parseInt(part.value, 10);
  }
  return { year, month, day };
}

export function getJalaliMonthName(month: number): string {
  return PERSIAN_MONTHS[month - 1] || "";
}

export function formatJalali(dateStr?: string | null): string {
  if (!dateStr) return "—";
  try {
    // Check if it's already YYYY-MM-DD
    const parts = dateStr.split("T")[0].split("-");
    if (parts.length === 3) {
      const gYear = parseInt(parts[0], 10);
      const gMonth = parseInt(parts[1], 10) - 1;
      const gDay = parseInt(parts[2], 10);
      const d = new Date(gYear, gMonth, gDay, 12, 0, 0);
      const j = getJalaliParts(d);
      return `${toPersianDigits(j.day)} ${getJalaliMonthName(j.month)} ${toPersianDigits(j.year)}`;
    }
    const d = new Date(dateStr);
    const j = getJalaliParts(d);
    return `${toPersianDigits(j.day)} ${getJalaliMonthName(j.month)} ${toPersianDigits(j.year)}`;
  } catch {
    return dateStr;
  }
}

// Find the Gregorian Date corresponding to the 1st day of a Jalali month/year
export function getFirstDayOfJalaliMonth(jYear: number, jMonth: number): Date {
  // Approximate Gregorian start (Jalali year + 621)
  let gYear = jYear + 621;
  // March is month index 2
  let d = new Date(gYear, 2, 1, 12, 0, 0);

  // Adjust forward or backward until we hit jYear, jMonth, 1
  for (let i = 0; i < 400; i++) {
    const parts = getJalaliParts(d);
    if (parts.year === jYear && parts.month === jMonth && parts.day === 1) {
      return d;
    }
    if (
      parts.year < jYear ||
      (parts.year === jYear && parts.month < jMonth)
    ) {
      d.setDate(d.getDate() + 1);
    } else {
      d.setDate(d.getDate() - 1);
    }
  }
  return d;
}

export interface JalaliDayItem {
  day: number;
  dateStr: string; // YYYY-MM-DD in Gregorian for backend compatibility
  isPast: boolean;
  isToday: boolean;
  dayOfWeek: number; // 0 = Saturday (شنبه), 6 = Friday (جمعه)
}

export function getMonthDays(jYear: number, jMonth: number, todayStr: string): JalaliDayItem[] {
  const firstDay = getFirstDayOfJalaliMonth(jYear, jMonth);
  const items: JalaliDayItem[] = [];
  const current = new Date(firstDay.getTime());

  while (true) {
    const parts = getJalaliParts(current);
    if (parts.month !== jMonth || parts.year !== jYear) break;

    // Convert JS getDay() (0=Sun..6=Sat) to Iranian week index (0=Sat..6=Fri)
    const jsDay = current.getDay();
    const irDay = (jsDay + 1) % 7;

    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, "0");
    const d = String(current.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;

    items.push({
      day: parts.day,
      dateStr,
      isPast: dateStr < todayStr,
      isToday: dateStr === todayStr,
      dayOfWeek: irDay,
    });

    current.setDate(current.getDate() + 1);
  }

  return items;
}
