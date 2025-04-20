import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidPythonIdentifier(name: string): boolean {
  // Python identifier rules
  const validPattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  return validPattern.test(name);
}
