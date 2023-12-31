export interface StatsDataPoint {
  timestamp: number;
  value: number;
}

export interface GraphStat {
  dataPoints: StatsDataPoint[];
}

export type StatsHistory = Record<string, GraphStat>;

export interface GraphItem {
  title: string;
  unit?: string;
}

export interface Stats {
  video: {
    fps: number;
    bytesReceived: number;
    jitter: number;
    decodeTime: number;
    packetsReceived: number;
    packetsLost: number;
  };
  audio: {
    bytesReceived: number;
    jitter: number;
    totalSamplesReceived: number;
    packetsReceived: number;
    packetsLost: number;
  };
}
