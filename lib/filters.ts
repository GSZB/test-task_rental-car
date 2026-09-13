import type { CarFilters } from "@/types/car";

// The API rejects numeric params beyond its safe number limit. Nine digits is
// far below that and more than any real price or mileage needs.
export const MAX_NUMBER_DIGITS = 9;

export function toDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, MAX_NUMBER_DIGITS);
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
  let minMileage = toDigits(read("minMileage") ?? "");
  let maxMileage = toDigits(read("maxMileage") ?? "");

  if (minMileage && maxMileage && Number(minMileage) > Number(maxMileage)) {
    minMileage = "";
    maxMileage = "";
  }

  return cleanFilters({
    brand: read("brand")?.trim(),
    price: toDigits(read("price") ?? ""),
    minMileage,
    maxMileage,
  });
}

export function filtersToSearch(filters: CarFilters): string {
  return new URLSearchParams(
    cleanFilters(filters) as Record<string, string>,
  ).toString();
}
