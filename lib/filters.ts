import type { CarFilters } from "@/types/car";

// The API rejects numeric params beyond its safe number limit. Nine digits is
// far below that and more than any real price or mileage needs.
export const MAX_NUMBER_DIGITS = 9;

const FILTER_KEYS = ["brand", "price", "minMileage", "maxMileage"] as const;

const NUMBER_PATTERN = new RegExp(`^\\d{1,${MAX_NUMBER_DIGITS}}$`);

export function toDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, MAX_NUMBER_DIGITS);
}

/**
 * Accepts only whole numbers from a link. Stripping other characters instead
 * would silently turn `50.5` into `505`.
 */
function readNumber(value: string | null | undefined): string {
  return value && NUMBER_PATTERN.test(value) ? value : "";
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
  let minMileage = readNumber(read("minMileage"));
  let maxMileage = readNumber(read("maxMileage"));

  if (minMileage && maxMileage && Number(minMileage) > Number(maxMileage)) {
    minMileage = "";
    maxMileage = "";
  }

  return cleanFilters({
    brand: read("brand")?.trim(),
    price: readNumber(read("price")),
    minMileage,
    maxMileage,
  });
}

/**
 * Writes the params in a fixed order, so the same filters always produce the
 * same URL whatever order they were chosen in.
 */
export function filtersToSearch(filters: CarFilters): string {
  const params = new URLSearchParams();

  for (const key of FILTER_KEYS) {
    const value = filters[key];

    if (value) params.set(key, value);
  }

  return params.toString();
}
