/**
 * TanStack Query Configuration
 *
 * This file configures the global TanStack Query client with options that make sense
 * for our application's data fetching needs.
 */
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a client with sensible defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep data fresh for 5 minutes before refetching
      staleTime: 1000 * 60 * 5,

      // Cache successful responses for 1 hour
      gcTime: 1000 * 60 * 60,

      // Only retry failed queries once
      retry: 1,

      // Use optimistic updates
      refetchOnWindowFocus: false,

      // Enable refetching when reconnecting
      refetchOnReconnect: true,
    },
  },
});

// Export DevTools for development environments
export { ReactQueryDevtools };
