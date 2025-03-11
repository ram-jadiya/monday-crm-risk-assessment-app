/**
 * Application Provider
 *
 * This component combines all providers needed for the application,
 * simplifying the component tree and ensuring correct provider nesting.
 */
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient, ReactQueryDevtools } from "../api/queryClient";
import { ErrorBoundary } from "../components/ErrorBoundary";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* Only show devtools in development */}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
