import { Moon, Sun, Sunset, type LucideIcon } from "lucide-react";

export interface ShiftVisual {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  dot: string;
  bar: string;
}

const BY_NAME: Record<string, ShiftVisual> = {
  morning: { icon: Sun, iconBg: "bg-amber-100", iconColor: "text-amber-600", dot: "bg-amber-500", bar: "bg-amber-500" },
  afternoon: { icon: Sun, iconBg: "bg-orange-100", iconColor: "text-orange-600", dot: "bg-orange-500", bar: "bg-orange-500" },
  evening: { icon: Sunset, iconBg: "bg-rose-100", iconColor: "text-rose-600", dot: "bg-rose-500", bar: "bg-rose-500" },
  night: { icon: Moon, iconBg: "bg-ink-900", iconColor: "text-brand-400", dot: "bg-ink-700", bar: "bg-ink-700" },
};

const BY_INDEX: ShiftVisual[] = [BY_NAME.morning, BY_NAME.afternoon, BY_NAME.evening, BY_NAME.night];

export function getShiftVisual(name: string, index = 0): ShiftVisual {
  return BY_NAME[name.trim().toLowerCase()] ?? BY_INDEX[index % BY_INDEX.length];
}

export function formatTime(value: string): string {
  const [h, m] = value.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

/** 24-hour "HH:MM" — used on the Shifts table/timeline, which display raw 24h times. */
export function formatTime24(value: string): string {
  return value.slice(0, 5);
}
