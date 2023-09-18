export const STATS_SECTIONS = {
  video: "Video",
  audio: "Audio",
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
