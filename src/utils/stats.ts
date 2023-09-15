import { Stat, Stats, StatsGroup } from "types/stats";

export const GRAPHS_WRAPPER_ID = "graphs-wrapper";

export const STATS_SECTIONS = {
  video: "Video",
  audioOutput: "Audio",
};

export const statSectionsMap = new Map(Object.entries(STATS_SECTIONS));

export const STATS_LABELS = {
  bytesReceived: "Data received",
  fps: "FPS",
  decodeTime: "Decode time",
  jitter: "Jitter",
  packetsReceived: "Packets received",
  packetsLost: "Packets lost",
  totalSamplesReceived: "Total samples received",
};

export const statsLabelsMap = new Map(Object.entries(STATS_LABELS));

export const STATS_UNITS: Record<string, string> = {
  mB: "MB",
  ms: "ms",
  fps: "FPS",
  packets: "packets",
};

export const MB_STATS = ["video-datareceived", "audio-datareceived"];

export const MS_STATS = ["video-decodetime", "video-jitter", "audio-jitter"];

export const formatMb = (v: number) => {
  return +(v / 1000 / 1000).toFixed(2);
};

export const formatMs = (v: number) => {
  return +(v * 1000).toFixed(2);
};

export const getStatsSections = (stats?: Stats) => {
  if (!stats) {
    return [];
  }

  const video: Stat[] = [
    {
      name: STATS_LABELS.bytesReceived,
      value: formatMb(stats.video.bytesReceived),
      unit: STATS_UNITS.mB,
    },
    {
      name: STATS_LABELS.fps,
      value: stats.video.fps,
      unit: STATS_UNITS.fps,
    },
    {
      name: STATS_LABELS.decodeTime,
      value: formatMs(stats.video.decodeTime),
      unit: STATS_UNITS.ms,
    },
    {
      name: STATS_LABELS.jitter,
      value: formatMs(stats.video.jitter),
      unit: STATS_UNITS.ms,
    },
    {
      name: STATS_LABELS.packetsReceived,
      value: stats.video.packetsReceived,
      unit: STATS_UNITS.packets,
    },
    {
      name: STATS_LABELS.packetsLost,
      value: stats.video.packetsLost,
      unit: STATS_UNITS.packets,
    },
  ];

  const audio: Stat[] = [
    {
      name: STATS_LABELS.bytesReceived,
      value: formatMb(stats.audioOutput.bytesReceived),
      unit: STATS_UNITS.mB,
    },
    {
      name: STATS_LABELS.jitter,
      value: formatMs(stats.audioOutput.jitter),
      unit: STATS_UNITS.ms,
    },
    {
      name: STATS_LABELS.packetsReceived,
      value: stats.audioOutput.packetsReceived,
      unit: STATS_UNITS.packets,
    },
    {
      name: STATS_LABELS.packetsLost,
      value: stats.audioOutput.packetsLost,
      unit: STATS_UNITS.packets,
    },
    {
      name: STATS_LABELS.totalSamplesReceived,
      value: stats.audioOutput.totalSamplesReceived,
    },
  ];

  const statsSections: StatsGroup[] = [
    { title: STATS_SECTIONS.video, stats: video },
    { title: STATS_SECTIONS.audioOutput, stats: audio },
  ];

  return statsSections;
};

export const formatValue = (value: number, unit?: string) => {
  switch (unit) {
    case STATS_UNITS.mB:
      return formatMb(value);
    case STATS_UNITS.ms:
      return formatMs(value);
    default:
      return value;
  }
};

export const getUnitFromGraphId = (graphId: string) => {
  if (MB_STATS.includes(graphId)) {
    return STATS_UNITS.mB;
  } else if (MS_STATS.includes(graphId)) {
    return STATS_UNITS.ms;
  }
};

export const getFormattedValueFromGraphId = (
  graphId: string,
  value: number,
) => {
  const unit = getUnitFromGraphId(graphId);
  return formatValue(value, unit);
};

export const graphTitleToId = (title: string) => {
  return title.toLowerCase().replace(/ /g, "");
};

export const sectionAndNameToId = (section: string, name: string) => {
  return graphTitleToId(`${section}-${name}`);
};
