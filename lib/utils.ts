import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "Unknown";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function formatYear(dateStr: string): string {
  return dateStr ? new Date(dateStr).getFullYear().toString() : "N/A";
}

export function formatCurrency(amount: number): string {
  if (!amount) return "N/A";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(amount);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + "…";
}

export function getRatingColor(rating: number): string {
  if (rating >= 8) return "text-emerald-400";
  if (rating >= 7) return "text-violet-light";
  if (rating >= 6) return "text-amber-400";
  return "text-rose-light";
}

export function getRatingLabel(rating: number): string {
  if (rating >= 8.5) return "Masterpiece";
  if (rating >= 7.5) return "Excellent";
  if (rating >= 7) return "Great";
  if (rating >= 6) return "Good";
  if (rating >= 5) return "Average";
  return "Poor";
}

export const MOODS = [
  { label: "Feel Good", emoji: "✨", value: "feel-good" },
  { label: "Thrilling", emoji: "⚡", value: "thrilling" },
  { label: "Thoughtful", emoji: "🧠", value: "thoughtful" },
  { label: "Heartwarming", emoji: "❤️", value: "heartwarming" },
  { label: "Scary", emoji: "👻", value: "scary" },
  { label: "Funny", emoji: "😂", value: "funny" },
  { label: "Epic", emoji: "🌌", value: "epic" },
  { label: "Emotional", emoji: "💧", value: "emotional" },
];

export const DECADES = [
  { label: "1970s", value: "1970" },
  { label: "1980s", value: "1980" },
  { label: "1990s", value: "1990" },
  { label: "2000s", value: "2000" },
  { label: "2010s", value: "2010" },
  { label: "2020s", value: "2020" },
];
