/**
 * Timeline-related API hooks
 *
 * This file contains hooks that interact with timeline-related GraphQL endpoints.
 * Separating concerns by domain improves maintainability.
 */
import { useQuery } from "@tanstack/react-query";
import { getItemTimeline } from "../queries";
import { apiRequest } from "../client";
import { GetItemTimelineQueryResult } from "../../types/general";

/**
 * Custom hook to fetch a single item's timeline
 *
 * @param itemId - ID of the item to fetch timeline for
 * @returns Query result with data, loading state, and error state
 */
export function useItemTimeline(itemId: string | number) {
  return useQuery({
    queryKey: ["itemTimeline", itemId],
    queryFn: async () => {
      return apiRequest<GetItemTimelineQueryResult>(getItemTimeline, {
        itemId,
      });
    },
    enabled: !!itemId,
    select: (response) =>
      response?.data?.data?.timeline?.timeline_items_page?.timeline_items,
  });
}

/**
 * Custom hook to fetch multiple timelines in parallel
 * Using useQueries for parallel fetching improves performance
 *
 * @param itemIds - Array of item IDs to fetch timelines for
 * @returns Combined query results with all timelines and their states
 */
export function useItemTimelines(itemIds: Array<{ id: string | number }>) {
  return useQuery({
    queryKey: ["itemTimelines", itemIds.map((item) => item.id)],
    queryFn: async () => {
      const results: Record<string, any> = {};

      // Sequential fetching - could be optimized with Promise.all for parallel fetching
      for (const item of itemIds) {
        const response = await apiRequest<GetItemTimelineQueryResult>(
          getItemTimeline,
          { itemId: item.id }
        );
        const timelineData =
          response.data.data?.timeline?.timeline_items_page?.timeline_items;
        results[item.id] = timelineData;
      }

      return results;
    },
    enabled: itemIds.length > 0,
  });
}
// export function useItemTimelines(itemIds: Array<{ id: string | number }>) {
//   const results = useQueries({
//     queries: itemIds.map((item) => ({
//       queryKey: ["itemTimeline", item.id],
//       queryFn: async () => {
//         const response = await apiRequest<GetItemTimelineQueryResult>(
//           getItemTimeline,
//           { itemId: item.id }
//         );
//         return {
//           id: item.id,
//           timeline:
//             response?.data?.data?.timeline?.timeline_items_page?.timeline_items,
//         };
//       },
//       enabled: itemIds.length > 0,
//     })),
//   });

//   // Combine all results into a map of id -> timeline
//   const isLoading = results.some((result) => result.isLoading);
//   const isError = results.some((result) => result.isError);
//   const error = results.find((result) => result.error)?.error;

//   // Format data as a record with item IDs as keys
//   //   const data = results.reduce((acc, result) => {
//   //     if (result.data) {
//   //       acc[result.data.id] = result.data.timeline;
//   //     }
//   //     return acc;
//   //   }, {} as Record<string | number, any[]>);
//   const data = results;

//   return {
//     data,
//     isLoading,
//     isError,
//     error,
//     // Individual results for more granular control
//     results,
//   };
// }
