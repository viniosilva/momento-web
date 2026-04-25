import { toast } from "sonner";

/**
 * Extracts error message from unknown error and displays as error toast.
 * Follows the philosophy: Early Exit for null/undefined, Parse Don't Validate for the error structure.
 */
export function showApiError(error: unknown): void {
  // Early Exit: Guard clause for null/undefined errors
  if (!error) {
    toast.error("An unknown error occurred");
    return;
  }

  // Parse the error to extract message
  const message = parseErrorMessage(error);

  toast.error(message);
}

/**
 * Parses error message from various error formats.
 * Makes Illegal States Unrepresentable by normalizing to a string.
 */
function parseErrorMessage(error: unknown): string {
  // If it's already a string, return it
  if (typeof error === "string") {
    return error;
  }

  // If it's an object with a message property
  if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;

    if (typeof err.message === "string") {
      return err.message;
    }

    // If it's an Error instance
    if (err instanceof Error) {
      return err.message;
    }
  }

  // Fallback for unparseable errors
  return "An unknown error occurred";
}