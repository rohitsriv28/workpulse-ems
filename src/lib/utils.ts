import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, isValid } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "INR",
): string {
  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(
  dateStr: string | Date,
  formatStr: string = "MMM dd, yyyy",
): string {
  try {
    const d = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
    if (!isValid(d)) return typeof dateStr === "string" ? dateStr : "";
    return format(d, formatStr);
  } catch {
    return String(dateStr);
  }
}

export function formatTime(isoOrTimeStr: string): string {
  if (!isoOrTimeStr) return "--:--";
  if (isoOrTimeStr.includes("T")) {
    try {
      const d = parseISO(isoOrTimeStr);
      return format(d, "hh:mm a");
    } catch {
      return isoOrTimeStr;
    }
  }
  // If "09:00:00" or "18:30"
  const parts = isoOrTimeStr.split(":");
  if (parts.length >= 2) {
    const hour = parseInt(parts[0], 10);
    const minute = parts[1];
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  }
  return isoOrTimeStr;
}

export function formatMinutesDuration(totalMinutes: number): string {
  if (totalMinutes <= 0) return "0m";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${minutes}m`;
}
