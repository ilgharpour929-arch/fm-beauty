"use client";

import React, { useState, useEffect } from "react";
import {
  getJalaliParts,
  getJalaliMonthName,
  toPersianDigits,
  getMonthDays,
  JalaliDayItem,
} from "@/lib/jalali";

interface PersianCalendarProps {
  selectedDate: string; // Gregorian YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
  minDate?: string; // Gregorian YYYY-MM-DD (e.g. today)
}

const WEEKDAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

export default function PersianCalendar({
  selectedDate,
  onSelectDate,
  minDate,
}: PersianCalendarProps) {
  const todayStr = minDate || new Date().toISOString().split("T")[0];
  
  // Initialize view with selectedDate or today
  const initDate = selectedDate ? new Date(selectedDate) : new Date(todayStr);
  const initParts = getJalaliParts(initDate);

  const [viewYear, setViewYear] = useState<number>(initParts.year);
  const [viewMonth, setViewMonth] = useState<number>(initParts.month);

  useEffect(() => {
    if (selectedDate) {
      const p = getJalaliParts(new Date(selectedDate));
      setViewYear(p.year);
      setViewMonth(p.month);
    }
  }, [selectedDate]);

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleGoToday = () => {
    const p = getJalaliParts(new Date(todayStr));
    setViewYear(p.year);
    setViewMonth(p.month);
    onSelectDate(todayStr);
  };

  const days: JalaliDayItem[] = getMonthDays(viewYear, viewMonth, todayStr);
  const firstDayOffset = days.length > 0 ? days[0].dayOfWeek : 0;

  return (
    <div className="glass-card-dark p-5 rounded-2xl border border-white/10 shadow-xl max-w-md mx-auto select-none">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-[var(--color-fg)] transition-all flex items-center justify-center cursor-pointer"
          title="ماه قبل"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-lg font-extrabold text-[var(--color-fg)]">
            {getJalaliMonthName(viewMonth)} {toPersianDigits(viewYear)}
          </span>
          <button
            type="button"
            onClick={handleGoToday}
            className="text-xs px-2.5 py-1 rounded-lg bg-[var(--color-accent)]/15 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/25 font-bold transition-all cursor-pointer"
          >
            امروز
          </button>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-[var(--color-fg)] transition-all flex items-center justify-center cursor-pointer"
          title="ماه بعد"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* Weekdays Header */}
      <div className="grid grid-cols-7 gap-1 mb-3 text-center">
        {WEEKDAYS.map((w, i) => (
          <div
            key={i}
            className={`text-xs font-bold py-1.5 rounded-lg ${
              i === 6 ? "text-rose-400 bg-rose-500/10" : "text-[var(--color-muted)]"
            }`}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="h-10" />
        ))}

        {/* Month days */}
        {days.map((item) => {
          const isSelected = item.dateStr === selectedDate;
          const isFriday = item.dayOfWeek === 6;

          return (
            <button
              key={item.dateStr}
              type="button"
              disabled={item.isPast}
              onClick={() => onSelectDate(item.dateStr)}
              className={`h-10 w-full rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-200 cursor-pointer ${
                item.isPast
                  ? "opacity-20 cursor-not-allowed text-[var(--color-muted)] bg-transparent"
                  : isSelected
                  ? "bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-[var(--color-bg)] shadow-md shadow-[var(--color-accent)]/40 scale-105 z-10"
                  : item.isToday
                  ? "border-2 border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/5 hover:bg-[var(--color-accent)]/20"
                  : isFriday
                  ? "text-rose-400 bg-rose-500/5 hover:bg-rose-500/20"
                  : "text-[var(--color-fg)] bg-white/5 hover:bg-white/15 hover:scale-105 hover:text-[var(--color-accent)]"
              }`}
              title={item.dateStr}
            >
              {toPersianDigits(item.day)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
