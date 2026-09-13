import { isAxiosError } from "axios";

interface ApiErrorBody {
  message?: string;
  validation?: Record<string, { message?: string }>;
}

/** A 4xx means the request itself is wrong, so sending it again cannot help. */
export function isClientError(error: unknown): boolean {
  const status = isAxiosError(error) ? error.response?.status : undefined;

  return status !== undefined && status >= 400 && status < 500;
}

/**
 * Turns the backend's validation detail into a readable sentence, for example
 * `"email" must be a valid email` into `Email must be a valid email.`
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError<ApiErrorBody>(error) || !isClientError(error)) {
    return fallback;
  }

  const body = error.response?.data;
  const detail = body?.validation
    ? Object.values(body.validation)[0]?.message
    : body?.message;

  if (!detail) return fallback;

  const text = detail.replace(/"/g, "").replace(/\.$/, "");

  return `${text.charAt(0).toUpperCase()}${text.slice(1)}.`;
}
