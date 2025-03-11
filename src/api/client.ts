/**
 * API Client Configuration
 *
 * This file creates and exports the API client instances used throughout the application.
 * Centralizing this allows us to easily update API versions or configurations.
 */
import { QueryVariables, SeamlessApiClient } from "@mondaydotcomorg/api";

export const API_VERSION = "2025-01";

export const seamlessApiClient = new SeamlessApiClient(API_VERSION);

export async function apiRequest<TData>(
  query: string,
  variables?: QueryVariables
): Promise<{ data: TData; method: string; requestId: string }> {
  try {
    const response: any = await seamlessApiClient.request(
      query,
      variables,
      API_VERSION
    );
    return {
      data: response.data,
      method: response.method,
      requestId: response.requestId,
    };
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}
