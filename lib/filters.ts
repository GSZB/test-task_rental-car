import type { CarFilters } from "@/types/car";

/** Drops blank values so an untouched filter never becomes its own cache key. */
export function cleanFilters(filters: CarFilters): CarFilters {
  return Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) => value !== undefined && value !== "",
    ),
  );
}
