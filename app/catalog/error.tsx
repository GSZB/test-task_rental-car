"use client";

import Container from "@/components/Container/Container";
import ErrorState from "@/components/ErrorState/ErrorState";

interface CatalogErrorProps {
  reset: () => void;
}

export default function CatalogError({ reset }: CatalogErrorProps) {
  return (
    <Container>
      <ErrorState
        title="Could not load the catalog"
        description="The car list is unavailable right now. Check your connection and try again."
        onRetry={reset}
      />
    </Container>
  );
}
