/**
 * Main Application Component
 *
 * This is the entry point of the application UI.
 * It orchestrates data flow but delegates most logic to custom hooks.
 */
import "./App.css";
import "@vibe/core/tokens";
import React from "react";
import { AttentionBox } from "@vibe/core";
import { AccountRiskChart } from "./components/AccountRiskChart/AccountRiskChart";
import { LoadingState } from "./components/LoadingState";
import {
  useAppContext,
  useAppSettings,
  useBoardItems,
  useItemTimelines,
  useChartData,
  useErrorHandling,
  useStorage,
} from "./hooks";

export default function AppContent() {
  // Application context and settings
  const appContext = useAppContext();
  const settings = useAppSettings();
  const currentBoard = appContext?.data?.boardIds ?? [];
  const boardIds = currentBoard;

  // Error handling
  const { error, handleError, clearError } = useErrorHandling();

  // Validating settings on load
  React.useEffect(() => {
    // Checking if we have a connected board
    if (!appContext.isLoading && appContext.data) {
      const selectedBoards = appContext?.data?.boardIds ?? [];
      if (selectedBoards.length === 0) {
        handleError("No board connected. Please select a board.");
      } else {
        clearError();
      }
    }

    // Checking x-axis configuration
    if (!settings.isLoading && settings.data) {
      if (!settings.data.hasOwnProperty("xAxis")) {
        handleError(
          "No deal value column set. Did you add this settings field to the app feature?"
        );
      } else if (settings.data.xAxis === null) {
        handleError(
          "No deal value column set. Choose a column in the app settings."
        );
      } else {
        clearError();
      }
    }
  }, [appContext, settings, handleError, clearError]);

  // Fetching board items with TanStack Query
  const { data: boardItemsData, isLoading: isBoardItemsLoading } =
    useBoardItems(currentBoard);

  // Extracting board data
  const boardData = React.useMemo(() => {
    if (!boardItemsData?.data?.boards) return [];

    return boardItemsData?.data?.boards;
  }, [boardItemsData?.data?.boards]);

  // Extracting item IDs from board items
  const itemIds = React.useMemo(() => {
    if (!boardData?.[0]?.items_page?.items) return [];

    return boardData[0].items_page.items.map((item) => ({
      id: item.id,
    }));
  }, [boardData]);

  // Fetching timelines for all items
  const { data: timelinesData, isLoading: isTimelinesLoading } =
    useItemTimelines(itemIds);

  // Get cached chart data
  const { data: chartDataFromCache, setData: setCachedChartData } = useStorage(
    "cachedData",
    []
  );

  // Extract column configuration
  const { dealValueColumn, riskColumn } = React.useMemo(() => {
    let dealValueColumn: Record<string, string[]> | undefined;
    let riskColumn: Record<string, string[]> | undefined;

    if (settings?.data && boardData && settings.data.xAxis) {
      const xAxisCols = Object.keys(settings.data.xAxis);
      if (xAxisCols.length > 0) {
        const boardColumns = boardData[0]?.columns;
        if (boardColumns && boardColumns.length > 0) {
          const dealValueColumnMetadata = boardColumns.find(
            (x) => x?.id === xAxisCols[0]
          );
          dealValueColumn = { [boardIds[0]]: [xAxisCols[0]] };

          if (dealValueColumnMetadata?.type !== "numbers") {
            handleError("Please select a number column for deal value.");
          }
        } else {
          handleError("Error: There are no columns on the board.");
        }
      }
    }

    if (settings?.data && boardData && settings.data.yAxis) {
      const yAxisCols = Object.keys(settings.data.yAxis);
      if (yAxisCols.length > 0) {
        const boardColumns = boardData[0]?.columns;
        if (boardColumns && boardColumns.length > 0) {
          riskColumn = { [boardIds[0]]: [yAxisCols[0]] };
        }
      }
    }

    return { dealValueColumn, riskColumn };
  }, [settings, boardData, boardIds, handleError]);

  const chartData = useChartData({
    boards: boardData,
    boardIds,
    dealValueColumn,
    riskColumn,
    timelines: timelinesData,
  });

  // Caching chart data when it changes
  React.useEffect(() => {
    if (chartData.length > 0) {
      setCachedChartData(chartData as never[]);
    }
  }, [chartData, setCachedChartData]);

  // Loading state
  const isLoading =
    isBoardItemsLoading ||
    isTimelinesLoading ||
    appContext.isLoading ||
    settings.isLoading;

  // Determine if all timelines are loaded
  const hasAllTimelinesLoaded =
    !isLoading &&
    timelinesData &&
    Object.keys(timelinesData).length === itemIds.length;

  return (
    <div className="App">
      {isLoading && !error && (
        <LoadingState message="Loading data..." className="Loader" />
      )}

      {!hasAllTimelinesLoaded && !isLoading && !error && (
        <AccountRiskChart chartData={chartDataFromCache} />
      )}

      {hasAllTimelinesLoaded && !isLoading && !error && (
        <AccountRiskChart chartData={chartData} />
      )}

      {error && (
        <AttentionBox
          text={JSON.stringify(error, null, 2)}
          title="Application error"
          type={AttentionBox.types.DANGER}
        />
      )}
    </div>
  );
}
