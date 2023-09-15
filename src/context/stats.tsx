import React, { createContext, FC, ReactNode, useState } from "react";
import { Stats, StatsHistory } from "../types/stats";
import {
  statSectionsMap,
  statsLabelsMap,
  sectionAndNameToId,
  getFormattedValueFromGraphId,
} from "utils/stats";

export const STATS_TIME_WINDOW = 5 * 60 * 1000; // ms (5 minutes)
export const STATS_UPDATE_INTERVAL = 3000; // ms

interface StatsContextProps {
  statsHistory: StatsHistory;
  updateStats: (newStats: Stats) => void;
}

const initialState: StatsContextProps = {
  statsHistory: {},
  updateStats: () => undefined,
};

export const StatsContext = createContext<StatsContextProps>(initialState);

interface StatsProviderProps {
  children: ReactNode;
}

const StatsProvider: FC<StatsProviderProps> = ({ children }) => {
  const statsHistory = useState<StatsHistory>({})[0];
  const [statsVersion, setStatsVersion] = useState(0);

  const updateStats = (newStats: Stats) => {
    const now = Date.now();
    const discardThreshold = now - STATS_TIME_WINDOW;

    Object.entries(newStats).forEach(([statSectionKey, statSectionValue]) => {
      Object.entries(statSectionValue).forEach(([statKey, statValue]) => {
        const section = statSectionsMap.get(statSectionKey) ?? "";
        const name = statsLabelsMap.get(statKey) ?? "";
        if (!section || !name) {
          return;
        }
        const graphId = sectionAndNameToId(section, name);

        if (!(graphId in statsHistory)) {
          statsHistory[graphId] = {
            dataPoints: [],
          };
        }

        statsHistory[graphId].dataPoints.push({
          timestamp: now,
          value: getFormattedValueFromGraphId(graphId, statValue as number),
        });

        statsHistory[graphId].dataPoints = statsHistory[
          graphId
        ].dataPoints.filter(
          (dataPoint) => dataPoint.timestamp > discardThreshold,
        );
      });
    });

    if (now > statsVersion + STATS_UPDATE_INTERVAL) {
      setStatsVersion(now);
    }
  };

  return (
    <StatsContext.Provider
      value={{
        statsHistory,
        updateStats,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};

export default StatsProvider;
