import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formattedSourceText(input: string) {
  return input
    .replace(/\n+/g, " ") // Remplace mutliple conscutive lines
    .replace(/(\w) - (\w)/g, "$1$2") // Join hyphanted words
    .replace(/\s+/g, " ") //  Remplace mutliple conscutive spaces
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
