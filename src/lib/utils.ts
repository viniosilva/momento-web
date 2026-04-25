import { clsx, type ClassValue } from "clsx"
import type { SubmitEvent } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function submitForm(e: SubmitEvent, form: any) {
  e.preventDefault();
  form.handleSubmit();
}