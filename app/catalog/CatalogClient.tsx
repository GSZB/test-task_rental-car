"use client";

import { useState } from "react";
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

export default function CatalogClient() {
  const [draft, setDraft] = useState<CarFilters>(NO_FILTERS);
  const [applied, setApplied] = useState<CarFilters>(NO_FILTERS);

  const { data: filterOptions } = useQuery(carFilterOptionsQueryOptions());
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isError,
  } = useInfiniteQuery(carsInfiniteQueryOptions(applied));

  const cars = data?.pages.flatMap((page) => page.cars) ?? [];
  const isReloading = isFetching && !isFetchingNextPage;

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
        {isError && (
          <p className={css.catalog__message} role="alert">
            Could not load the cars. Please try again later.
          </p>
        )}

        {!isError && cars.length > 0 && (
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

        {!isError && cars.length === 0 && !isReloading && (
          <EmptyState onReset={handleReset} />
        )}

        {isReloading && (
          <div className={css.catalog__overlay}>
            <Loader />
          </div>
        )}
      </div>
    </>
  );
}
