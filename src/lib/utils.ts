import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Stable, locale-correct EUR formatting. Never string-concatenate money. */
export function eur(cents: number, opts?: { decimals?: boolean }) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: opts?.decimals ? 2 : 0,
    maximumFractionDigits: opts?.decimals ? 2 : 0,
  }).format(cents / 100);
}

export function formatDateES(iso: string, style: "long" | "short" = "long") {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function relativeES(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const rtf = new Intl.RelativeTimeFormat("es-ES", { numeric: "auto" });
  const mins = Math.round(-diff / 60000);
  if (Math.abs(mins) < 60) return rtf.format(mins, "minute");
  const hours = Math.round(mins / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  return rtf.format(Math.round(hours / 24), "day");
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
