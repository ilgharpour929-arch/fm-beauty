export function cn(...inputs: (string | boolean | null | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatPrice(price: number): string {
  return price.toLocaleString("fa-IR") + " تومان";
}

export function calculateDeposit(price: number): number {
  return Math.round(price * 0.3);
}

export function generateTimeSlots(): string[] {
  const slots: string[] = [];

  for (let hour = 9; hour < 19; hour++) {
    const start = `${hour.toString().padStart(2, "0")}:00`;
    const end = `${(hour + 1).toString().padStart(2, "0")}:30`;
    slots.push(`${start} - ${end}`);
  }

  return slots;
}

export function generateDailySlots(): { start: string; end: string; label: string }[] {
  const slots: { start: string; end: string; label: string }[] = [];
  const startHour = 9;
  const endHour = 20;

  for (let hour = startHour; hour < endHour; hour++) {
    const start = `${hour.toString().padStart(2, "0")}:00`;
    const endH = hour + 1;
    const endM = 30;
    const end = `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;
    slots.push({ start, end, label: `${start} - ${end}` });
  }

  return slots;
}

export function getPersianDate(date: Date): string {
  return date.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getPersianDayName(date: Date): string {
  return date.toLocaleDateString("fa-IR", { weekday: "long" });
}

export function formatDateInput(date: Date): string {
  return date.toISOString().split("T")[0];
}
