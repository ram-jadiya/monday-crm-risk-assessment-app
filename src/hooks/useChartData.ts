/**
 * Chart Data Hook
 *
 * Centralizes chart data generation logic for better separation of concerns.
 */
import { useMemo } from "react";
import { ChartRow } from "../components/AccountRiskChart/AccountRiskChart";
import { useErrorHandling } from "../utils/error";

interface UseChartDataParams {
  boards: any[] | undefined;
  boardIds: (string | number)[];
  dealValueColumn: Record<string, string[]> | undefined;
  riskColumn: Record<string, string[]> | undefined;
  timelines: Record<string, string[]> | undefined;
}

export function useChartData({
  boards,
  boardIds,
  dealValueColumn,
  riskColumn,
  timelines,
}: UseChartDataParams) {
  const { handleError } = useErrorHandling();

  return useMemo(() => {
    try {
      if (!boards || !dealValueColumn) return [];

      if (boards.length === 0) return [];

      const data: ChartRow[] = [];
      const currentBoard = boardIds[0].toString();
      const itemsList = boards[0]?.items_page?.items;

      if (!itemsList || itemsList.length === 0) {
        handleError("Error retrieving data from board: Board has no items.");
        return [];
      }

      itemsList.forEach((item) => {
        const dealValue = item.column_values.find(
          (x) => x.id === dealValueColumn[currentBoard][0]
        );

        let riskFromColumn;
        if (riskColumn) {
          riskFromColumn = item.column_values.find(
            (x) => x.id === riskColumn[currentBoard][0]
          )?.text;
        }

        const timelineCount = timelines?.[item.id]?.length ?? 0;
        const riskiness = riskFromColumn ?? timelineCount ?? 0;

        data.push({
          deal_value: parseInt(dealValue?.text ?? "0"),
          riskiness,
          item_id: item.id,
          item_name: item.name,
        });
      });

      return data;
    } catch (error) {
      handleError("Could not generate chart data", error);
      return [];
    }
  }, [boards, boardIds, dealValueColumn, riskColumn, timelines, handleError]);
}
