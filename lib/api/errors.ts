import { isAxiosError } from "axios";

/** A 4xx means the request itself is wrong, so sending it again cannot help. */
export function isClientError(error: unknown): boolean {
  const status = isAxiosError(error) ? error.response?.status : undefined;

  return status !== undefined && status >= 400 && status < 500;
}
