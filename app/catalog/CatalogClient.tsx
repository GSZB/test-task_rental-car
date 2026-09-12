"use client";

import { useState, useSyncExternalStore } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import CarList from "@/components/CarList/CarList";
import EmptyState from "@/components/EmptyState/EmptyState";
import Filters from "@/components/Filters/Filters";
import Loader from "@/components/Loader/Loader";
import LoadMoreButton from "@/components/LoadMoreButton/LoadMoreButton";
import { cleanFilters } from "@/lib/filters";
import {
  carFilterOptionsQueryOptions,
  carsInfiniteQueryOptions,
} from "@/lib/queries/cars";
import type { CarFilters } from "@/types/car";
import css from "./Catalog.module.css";

const NO_FILTERS: CarFilters = {};

const subscribeToNothing = () => () => {};

export default function CatalogClient() {
  const [draft, setDraft] = useState<CarFilters>(NO_FILTERS);
  const [applied, setApplied] = useState<CarFilters>(NO_FILTERS);
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
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery(carsInfiniteQueryOptions(applied));

  const cars = data?.pages.flatMap((page) => page.cars) ?? [];
  // Covers the first load and filter changes, but not Load more.
  const isBusy =
    isHydrated && (isFetching || status === "pending") && !isFetchingNextPage;
  // Only a successful response with no cars means the filters matched nothing.
  const isEmpty = status === "success" && cars.length === 0;

  const handleReset = () => {
    setDraft(NO_FILTERS);
    setApplied(NO_FILTERS);
  };

  return (
    <>
      <div className={css.catalog__filters}>
        <Filters
          value={draft}
          options={filterOptions}
          onChange={setDraft}
          onSearch={() => setApplied(cleanFilters(draft))}
          onReset={handleReset}
        />
      </div>

      <div className={css.catalog__results}>
        {status === "error" && (
          <p className={css.catalog__message} role="alert">
            Could not load the cars. Please check your connection and try again.
          </p>
        )}

        {cars.length > 0 && (
          <>
            <CarList cars={cars} />
            {hasNextPage && (
              <div className={css["catalog__load-more"]}>
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
