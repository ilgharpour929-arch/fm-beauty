"use client";

import React, { useState } from "react";
import PersianCalendar from "./PersianCalendar";
import { formatJalali } from "@/lib/jalali";

interface PersianDatePickerInputProps {
  selectedDate: string; // Gregorian YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
  minDate?: string; // Gregorian YYYY-MM-DD
  placeholder?: string;
  className?: string;
}

export default function PersianDatePickerInput({
  selectedDate,
  onSelectDate,
  minDate,
  placeholder = "انتخاب تاریخ (شمسی / خورشیدی)...",
  className = "",
}: PersianDatePickerInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  const displayValue = selectedDate ? formatJalali(selectedDate) : placeholder;

  return (
    <div className={`relative w-full ${className}`}>
      {/* Clickable Date Input Menu Box */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-4 rounded-2xl glass-card border flex items-center justify-between text-right transition-all duration-200 cursor-pointer ${
          isOpen
            ? "border-[var(--color-accent)] shadow-[0_0_15px_rgba(217,119,6,0.2)] bg-white/10"
            : "border-white/10 hover:border-white/25 hover:bg-white/5"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent)] shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xs text-[var(--color-muted)] mb-0.5">تاریخ رزرو (تقویم ایران)</span>
            <span className={`text-base font-bold ${selectedDate ? "text-[var(--color-fg)]" : "text-[var(--color-muted)]"}`}>
              {displayValue}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedDate && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onSelectDate("");
                setIsOpen(false);
              }}
              className="p-1.5 rounded-lg hover:bg-rose-500/20 text-[var(--color-muted)] hover:text-rose-400 transition-colors text-xs"
              title="پاک کردن تاریخ"
            >
              ✕
            </span>
          )}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-[var(--color-muted)] transition-transform duration-300 ${isOpen ? "rotate-180 text-[var(--color-accent)]" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      {/* Backdrop to close when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 sm:bg-black/20 sm:backdrop-blur-[1px] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Popup Persian Calendar Menu */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 p-4 pb-8 z-50 animate-float-up shadow-2xl sm:absolute sm:top-full sm:bottom-auto sm:inset-x-auto sm:right-0 sm:left-0 sm:mt-3 sm:p-0">
          <PersianCalendar
            selectedDate={selectedDate}
            onSelectDate={(dateStr) => {
              onSelectDate(dateStr);
              setIsOpen(false);
            }}
            minDate={minDate}
          />
        </div>
      )}
    </div>
  );
}
