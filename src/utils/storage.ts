/**
 * Storage utilities
 *
 * This file provides a clean interface for interacting with Monday's storage,
 * reducing redundancy throughout the application.
 */
import mondaySdk from "monday-sdk-js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Initialize Monday SDK
const monday = mondaySdk();

/**
 * Save data to Monday's storage
 *
 * @param key - Storage key
 * @param value - Data to store (will be JSON stringified)
 * @returns Promise resolving to the storage API response
 */
export async function saveToStorage(key: string, value: any): Promise<any> {
  try {
    return await monday.storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to storage (${key}):`, error);
    throw error;
  }
}

/**
 * Retrieve data from Monday's storage
 *
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Promise resolving to the parsed data or default value
 */
export async function getFromStorage<T = any>(
  key: string,
  defaultValue?: T
): Promise<T> {
  try {
    const response = await monday.storage.getItem(key);
    return response?.data?.value
      ? JSON.parse(response.data.value)
      : defaultValue!;
  } catch (error) {
    console.error(`Error retrieving from storage (${key}):`, error);
    return defaultValue as T;
  }
}

/**
 * React Query hook for Monday storage
 *
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Query result with data and mutation function
 */
export function useStorage<T>(key: string, defaultValue?: T) {
  const queryClient = useQueryClient();

  // Query to read from storage
  const query = useQuery({
    queryKey: ["storage", key],
    queryFn: () => getFromStorage<T>(key, defaultValue),
  });

  // Mutation to write to storage
  const mutation = useMutation({
    mutationFn: (newValue: T) => saveToStorage(key, newValue),
    onSuccess: () => {
      // Invalidate the query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["storage", key] });
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    setData: mutation.mutate,
    status: mutation.status,
  };
}
