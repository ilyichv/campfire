import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Registry items rendered in docs previews resolve `@/lib/utils` here —
 * the same module a scaffolded deck provides. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
