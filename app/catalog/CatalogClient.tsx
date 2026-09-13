"use client";

import { useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import CarList from "@/components/CarList/CarList";
import EmptyState from "@/components/EmptyState/EmptyState";
import Filters from "@/components/Filters/Filters";
import Loader from "@/components/Loader/Loader";
import LoadMoreButton from "@/components/LoadMoreButton/LoadMoreButton";
import { isClientError } from "@/lib/api/errors";
import { filtersToSearch, parseFilters } from "@/lib/filters";
import {
  carFilterOptionsQueryOptions,
  carsInfiniteQueryOptions,
} from "@/lib/queries/cars";
import type { CarFilters } from "@/types/car";
import css from "./Catalog.module.css";

const subscribeToNothing = () => () => {};

export default function CatalogClient() {
  const searchParams = useSearchParams();
  // The URL is the source of truth, so a refresh, a shared link and the Back
  // button all restore the same filters.
  const applied = parseFilters((key) => searchParams.get(key));
  const appliedSearch = filtersToSearch(applied);
  // The query status differs between the server render and the first client
  // render, so anything driven by it waits until after hydration.
  const isHydrated = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

  const { data: filterOptions } = useQuery(carFilterOptionsQueryOptions());
  const {
    data,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    isFetching,
  } = useInfiniteQuery(carsInfiniteQueryOptions(applied));

  const cars = data?.pages.flatMap((page) => page.cars) ?? [];
  // Covers the first load and filter changes, but not Load more.
  const isBusy =
    isHydrated && (isFetching || status === "pending") && !isFetchingNextPage;
  // Only a successful response with no cars means the filters matched nothing.
  const isEmpty = status === "success" && cars.length === 0;

  // pushState updates the search params without a server round trip, so the
  // current cars stay on screen while the new ones load.
  const applyFilters = (filters: CarFilters) => {
    const search = filtersToSearch(filters);

    if (search === appliedSearch) return;

    window.history.pushState(
      null,
      "",
      search ? `?${search}` : window.location.pathname,
    );
  };

  const handleReset = () => applyFilters({});

  return (
    <>
      <div className={css.catalog__filters}>
        <Filters
          key={appliedSearch}
          initialValue={applied}
          options={filterOptions}
          onSearch={applyFilters}
          onReset={handleReset}
        />
      </div>

      <div className={css.catalog__results}>
        {status === "error" && cars.length === 0 && (
          <p className={css.catalog__message} role="alert">
            {isClientError(error)
              ? "These filters could not be applied. Please check the values and try again."
              : "Could not load the cars. Please check your connection and try again."}
          </p>
        )}

        {cars.length > 0 && (
          <>
            <CarList cars={cars} />
            {hasNextPage && (
              <div className={css["catalog__load-more"]}>
                {isFetchNextPageError && (
                  <p className={css["catalog__load-more-error"]} role="alert">
                    Could not load more cars. Please try again.
                  </p>
                )}
                <LoadMoreButton
                  onClick={() => fetchNextPage()}
                  isLoading={isFetchingNextPage}
                />
              </div>
            )}
          </>
        )}

        {isEmpty && !isBusy && <EmptyState onReset={handleReset} />}

        {isBusy && (
          <div className={css.catalog__overlay}>
            <Loader />
          </div>
        )}
      </div>
    </>
  );
}
