/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *  Copyright (c) 2023 Michele Lo Russo. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

import React, { FC } from "react";
import { Stats } from "../types/stats";
import useStats from "hooks/useStats";
import StatsGraph from "./StatsGraph";
import { STATS_UNITS } from "utils/stats";
import { STATS_UPDATE_INTERVAL } from "context/stats";

interface Props {
  targetPeer: RTCPeerConnection;
  isPlaying: boolean;
}

const StatsGraphs: FC<Props> = ({ targetPeer, isPlaying }) => {
  const { updateStats } = useStats();

  // call getStats every second
  setInterval(() => {
    if (isPlaying) {
      targetPeer.getStats(null).then(onStatsUpdate, (err) => console.log(err));
    }
  }, STATS_UPDATE_INTERVAL);

  const onStatsUpdate = (statsReport: RTCStatsReport) => {
    const stats = {} as Stats;
    statsReport.forEach((report) => {
      if (report.type !== "inbound-rtp") {
        return;
      }
      if (report.kind === "video") {
        stats.video = {
          fps: report.framesPerSecond,
          bytesReceived: report.bytesReceived,
          jitter: report.jitter,
          decodeTime: report.totalDecodeTime,
          packetsReceived: report.packetsReceived,
          packetsLost: report.packetsLost,
        };
      }
      if (report.kind === "audio") {
        stats.audio = {
          bytesReceived: report.bytesReceived,
          jitter: report.jitter,
          totalSamplesReceived: report.totalSamplesReceived,
          packetsReceived: report.packetsReceived,
          packetsLost: report.packetsLost,
        };
      }
    });
    updateStats(stats);
  };

  return (
    <>
      {isPlaying ? (
        <>
          <h3>Video</h3>
          <div className="graphs-row">
            <StatsGraph
              item={{ title: "Video - Data received", unit: STATS_UNITS.mB }}
            />
            <StatsGraph
              item={{ title: "Video - Jitter", unit: STATS_UNITS.ms }}
            />
            <StatsGraph
              item={{ title: "Video - FPS", unit: STATS_UNITS.fps }}
            />
          </div>
          <h3>Audio</h3>
          <div className="graphs-row">
            <StatsGraph
              item={{ title: "Audio - Data received", unit: STATS_UNITS.mB }}
            />
            <StatsGraph
              item={{ title: "Audio - Jitter", unit: STATS_UNITS.ms }}
            />
            <StatsGraph item={{ title: "Audio - Total samples received" }} />
          </div>
        </>
      ) : (
        <>Hit the play button on both videos to see some stats graphs</>
      )}
    </>
  );
};

export default StatsGraphs;
