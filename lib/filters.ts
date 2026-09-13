import type { CarFilters } from "@/types/car";

// Enough for any real mileage while staying far below the API's safe number limit.
export const MILEAGE_MAX_DIGITS = 9;

export function toMileage(value: string): string {
  return value.replace(/\D/g, "").slice(0, MILEAGE_MAX_DIGITS);
}

/** Drops blank values so an untouched filter never becomes its own cache key. */
function cleanFilters(filters: CarFilters): CarFilters {
  return Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) => value !== undefined && value !== "",
    ),
  );
}

/**
 * Reads filters from URL search params. Anything the API would reject is
 * dropped, so a hand-edited link cannot trigger a failing request.
 */
export function parseFilters(
  read: (key: string) => string | null | undefined,
): CarFilters {
  let minMileage = toMileage(read("minMileage") ?? "");
  let maxMileage = toMileage(read("maxMileage") ?? "");

  if (minMileage && maxMileage && Number(minMileage) > Number(maxMileage)) {
    minMileage = "";
    maxMileage = "";
  }

  return cleanFilters({
    brand: read("brand")?.trim(),
    price: read("price")?.replace(/\D/g, ""),
    minMileage,
    maxMileage,
  });
}

export function filtersToSearch(filters: CarFilters): string {
  return new URLSearchParams(
    cleanFilters(filters) as Record<string, string>,
  ).toString();
}
