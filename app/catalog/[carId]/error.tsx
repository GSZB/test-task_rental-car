"use client";

import Container from "@/components/Container/Container";
import ErrorState from "@/components/ErrorState/ErrorState";

interface CarDetailsErrorProps {
  reset: () => void;
}

export default function CarDetailsError({ reset }: CarDetailsErrorProps) {
  return (
    <Container>
      <ErrorState
        title="Could not load this car"
        description="The car details are unavailable right now. Check your connection and try again."
        reset={reset}
      />
    </Container>
  );
}
