import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}

export function random<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

export function chance(probability: number) {
  if (probability < 0 || probability > 1) console.error('Please give a probability between 0 and 1, inclusive.');
  return Math.random() < probability;
}