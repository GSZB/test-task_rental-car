import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Container from "@/components/Container/Container";
import {
  carFilterOptionsQueryOptions,
  carsInfiniteQueryOptions,
} from "@/lib/queries/cars";
import CatalogClient from "./CatalogClient";
import css from "./Catalog.module.css";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Browse available cars for rent, filter them by brand, price and mileage, and load more results page by page.",
};

export default async function CatalogPage() {
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchInfiniteQuery(carsInfiniteQueryOptions()),
    queryClient.prefetchQuery(carFilterOptionsQueryOptions()),
  ]);

  return (
    <Container>
      <section className={css.catalog}>
        <h1 className={css.catalog__title}>Car catalog</h1>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <CatalogClient />
        </HydrationBoundary>
      </section>
    </Container>
  );
}
