"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isClientError } from "@/lib/api/errors";

interface TanStackProviderProps {
  children: React.ReactNode;
}

export default function TanStackProvider({ children }: TanStackProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) =>
              !isClientError(error) && failureCount < 3,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
