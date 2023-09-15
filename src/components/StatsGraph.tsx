import "chartjs-adapter-date-fns";

import React, { FC, MutableRefObject, useRef } from "react";

import {
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Tick,
  TimeScale,
  Tooltip,
  TooltipItem,
} from "chart.js";
import { STATS_TIME_WINDOW } from "context/stats";
import useStats from "hooks/useStats";
import { isInteger } from "lodash";
import { Line } from "react-chartjs-2";
import { GraphItem } from "types/stats";
import { graphTitleToId } from "utils/stats";

interface Props {
  item: GraphItem;
}

const StatsGraph: FC<Props> = ({ item }: Props) => {
  const { statsHistory } = useStats();

  const chartRef: MutableRefObject<ChartJS<
    "line",
    number[],
    number | undefined
  > | null> = useRef(null);

  const graphId = graphTitleToId(item.title);
  const dataPoints = statsHistory[graphId].dataPoints;
  const values = dataPoints.map((dataPoint) => dataPoint.value);

  const now = Date.now();

  const graphOptions = {
    animation: {
      duration: 0,
    },
    borderColor: "rgb(15, 149, 161)",
    interaction: {
      intersect: false,
      mode: "index",
    },
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            return `${item.title}: ${context.parsed.y}${
              item.unit ? ` ${item.unit}` : ""
            }`;
          },
        },
        displayColors: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        min: now - STATS_TIME_WINDOW,
        max: now,
        ticks: {
          autoSkipPadding: 15,
          maxRotation: 0,
        },
        time: {
          unit: "minute",
        },
        type: "time",
      },
      y: {
        ticks: {
          callback: (value: number, _index: number, ticks: Tick[]) => {
            if (value < 0) {
              return null;
            }

            if (values.every(isInteger)) {
              return isInteger(value) || ticks.length === 1
                ? Math.round(value)
                : null;
            }

            return Math.round((value + Number.EPSILON) * 100) / 100;
          },
        },
        title: {
          display: Boolean(item.unit),
          text: item.unit,
        },
      },
    },
  };

  ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Tooltip);

  return (
    <div className="graph-wrapper">
      <Line
        ref={chartRef}
        className="graph-canvas"
        options={graphOptions}
        datasetIdKey={item.title}
        data={{
          labels: dataPoints.map((dataPoint) => dataPoint.timestamp),
          datasets: [
            {
              data: values,
              pointRadius: 1,
            },
          ],
        }}
      />
    </div>
  );
};

export default StatsGraph;
