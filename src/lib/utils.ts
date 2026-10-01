import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string | undefined): string {
  if (price === undefined || price === null) return "$0";
  const num = typeof price === "number" ? price : parseFloat(String(price));
  return isNaN(num) ? "$0" : `$${num.toFixed(0)}`;
}

export function formatDate(dateStr: string | Date | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
