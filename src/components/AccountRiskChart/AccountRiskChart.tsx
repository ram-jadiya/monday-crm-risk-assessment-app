import React, { FC, PropsWithChildren, useMemo } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Scatter,
  LabelList,
  TooltipProps,
  ReferenceArea,
  Label,
} from "recharts";
import "./AccountRiskChart.scss";
import mondaySdk from "monday-sdk-js";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

const monday = mondaySdk();

type AccountRiskChartProps = PropsWithChildren<{
  chartData: ChartRow[] | undefined;
}>;

export interface ChartRow {
  deal_value: number | null | undefined;
  riskiness: number | string | null | undefined;
  item_id: number | string;
  item_name: string;
}

const getMinMidMax = (data: ChartRow[], key: string) => {
  var min = 1000000000;
  var mid;
  var max = 0;

  if (data) {
    data.map((row) => {
      const value: number | null = parseInt(row?.[key]?.toString() ?? "0");
      if (value) {
        if (value < min) min = value;
        if (value > max) max = value;
      }
      return row;
    });
    // prettier-ignore
    mid = min + ((max - min) / 2);
  }

  return [min, mid, max];
};

export const AccountRiskChart: FC<AccountRiskChartProps> = ({ chartData }) => {
  var [yMin, yMid, yMax] = useMemo(
    () => getMinMidMax(chartData ?? [], "riskiness"),
    [chartData]
  );
  var [xMin, xMid, xMax] = useMemo(
    () => getMinMidMax(chartData ?? [], "deal_value"),
    [chartData]
  );

  // when you click an item, open item card
  const handleChartClick = ({ item_id }) => {
    monday.execute("openItemCard", { itemId: item_id }).then((result) => {
      console.log({ msg: "item card closed?", result });
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      const { item_name, item_id, deal_value, riskiness } = payload[0].payload;
      return (
        <div
          style={{
            border: "solid 1px #c3c6d4",
            background: "white",
            padding: "8px",
            borderRadius: "4px",
          }}
        >
          <p>{`${item_name}`}</p>
          <p>{`ID: ${item_id}`}</p>
          <p>{`Deal value: ${deal_value}`}</p>
          <p>{`Risk score: ${riskiness}`}</p>
        </div>
      );
    }
  };

  return (
    <ResponsiveContainer
      className="responsiveContainer"
      height="90%"
      width="90%"
    >
      <ScatterChart
        className="riskChart"
        margin={{ right: 16, top: 16, left: 8, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {/*TODO: Allow axis to go above 100k */}
        <XAxis
          dataKey="deal_value"
          type="number"
          name="Deal value"
          label={{ value: "Deal Value", position: "insideBottom" }}
          padding={{ left: 12 }}
          height={50}
          domain={[0, "auto"]}
          tickFormatter={(l) => `$${l / 1000}k`}
          allowDataOverflow
        />
        <YAxis
          dataKey="riskiness"
          type="number"
          name="Risk"
          label={{ value: "Risk", angle: -90, position: "insideLeft" }}
        />
        <ZAxis range={[300, 300]} />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={<CustomTooltip />}
          isAnimationActive={false}
        />

        {[
          {
            key: "deprioritize",
            x1: xMin,
            x2: xMid,
            y1: yMid,
            y2: yMax,
            color: "red",
            label: "Deprioritize",
            position: "insideTopLeft",
          },
          {
            key: "invest",
            x1: xMid,
            x2: xMax,
            y1: yMid,
            y2: yMax,
            color: "green",
            label: "Invest",
            position: "insideTopRight",
          },
          {
            key: "quick-wins",
            x1: xMin,
            x2: xMid,
            y1: yMin,
            y2: yMid,
            color: "green",
            label: "Quick Wins",
            position: "insideBottomLeft",
          },
          {
            key: "ideals",
            x1: xMid,
            x2: xMax,
            y1: yMin,
            y2: yMid,
            color: "grey",
            label: "Ideals",
            position: "insideBottomRight",
          },
        ].map((area) => (
          <ReferenceArea
            key={area.key}
            x1={area.x1}
            x2={area.x2}
            y1={area.y1}
            y2={area.y2}
            stroke={area.color}
            strokeOpacity={0.8}
            fillOpacity={0.3}
          >
            <Label value={area.label} position={area.position as any} />
          </ReferenceArea>
        ))}

        <Scatter
          data={chartData}
          fill="#a855f7"
          style={{
            cursor: "pointer",
          }}
          onClick={handleChartClick}
          className="scatterPoint"
          shape="circle"
          isAnimationActive={false}
        >
          <LabelList
            dataKey="item_name"
            position="bottom"
            className="data-point-label"
          />
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
};
