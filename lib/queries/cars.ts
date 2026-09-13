import {
  infiniteQueryOptions,
  keepPreviousData,
  queryOptions,
} from "@tanstack/react-query";
import {
  CARS_PER_PAGE,
  fetchCarFilterOptions,
  fetchCars,
} from "@/lib/api/cars";
import type { CarFilters } from "@/types/car";

export const carKeys = {
  list: (filters: CarFilters) => ["cars", "list", filters] as const,
  filterOptions: ["cars", "filters"] as const,
};

export function carsInfiniteQueryOptions(filters: CarFilters = {}) {
  return infiniteQueryOptions({
    queryKey: carKeys.list(filters),
    queryFn: ({ pageParam }) =>
      fetchCars({ ...filters, page: pageParam, perPage: CARS_PER_PAGE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    // Keeps the current cars on screen while a new filter combination loads.
    placeholderData: keepPreviousData,
  });
}

export function carFilterOptionsQueryOptions() {
  return queryOptions({
    queryKey: carKeys.filterOptions,
    queryFn: fetchCarFilterOptions,
    staleTime: Infinity,
  });
}
