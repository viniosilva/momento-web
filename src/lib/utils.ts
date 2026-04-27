import {  clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type {ClassValue} from "clsx";
import type { SubmitEvent } from "react";

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function submitForm(e: SubmitEvent, form: any) {
  e.preventDefault();
  form.handleSubmit();
}