/**
 * Board-related API hooks
 *
 * This file contains hooks that interact with board-related GraphQL endpoints.
 * Using TanStack Query provides caching, loading states, and error handling.
 */
import { useQuery } from "@tanstack/react-query";
import { getBoardItems } from "../queries";
import { apiRequest } from "../client";
import { GetBoardItemsQueryResult } from "../../types/general";

/**
 * Custom hook to fetch board items with proper caching and state management
 *
 * @param boardId - Array of board IDs to fetch
 * @returns Query result with data, loading state, and error state
 */
export function useBoardItems(boardId: string[] | number[]) {
  return useQuery({
    queryKey: ["boardItems", boardId],
    queryFn: async () =>
      apiRequest<GetBoardItemsQueryResult>(getBoardItems, {
        boardId,
      }),
    enabled: boardId.length > 0,
    select: (data) => data?.data,
  });
}
