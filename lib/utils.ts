import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRM(value: number | null | undefined): string {
  if (value == null) return 'RM 0'
  return `RM ${value.toLocaleString('en-MY', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function formatMins(value: number | null | undefined): string {
  if (value == null) return '0'
  return Math.round(value).toLocaleString('en-MY')
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}
