import { useQuery } from "@tanstack/react-query";
import mondaySdk from "monday-sdk-js";

/**
 * Custom hook to fetch and cache data from Monday.com's local storage.
 *
 * @param {string} key - The key under which the data is stored in Monday.com's storage.
 * @param {any} [initialData=undefined] - The default value to return if no data is found in storage.
 */
export function useCachedData(key: string, initialData: any = undefined) {
  return useQuery({
    queryKey: ["cachedData", key],
    queryFn: async () => {
      const monday = mondaySdk();
      const response = await monday.storage.getItem(key);
      const data = response?.data?.value
        ? JSON.parse(response.data.value)
        : initialData;
      return data;
    },
  });
}
