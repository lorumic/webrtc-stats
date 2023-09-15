/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *  Copyright (c) 2023 Michele Lo Russo. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

import React, { FC, useEffect, useRef } from "react";
import chromeWebm from "../assets/chrome.webm";
import chromeMp4 from "../assets/chrome.mp4";
import Stats from "./Stats";

interface HTMLVideoElementExtended extends HTMLVideoElement {
  captureStream?(): MediaStream;
  mozCaptureStream?(): MediaStream;
}

const WebRTCStats: FC = () => {
  const senderVideoRef = useRef<HTMLVideoElementExtended>(null);
  const receiverVideoRef = useRef<HTMLVideoElementExtended>(null);

  let stream: MediaStream;

  let senderPeer: RTCPeerConnection;
  let receiverPeer: RTCPeerConnection;

  const offerOptions: RTCOfferOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  };

  const maybeCreateStream = () => {
    if (!senderVideoRef.current) {
      return;
    }
    const senderVideo = senderVideoRef.current;
    if (senderVideo.captureStream) {
      stream = senderVideo.captureStream();
      startPeerConnection();
    } else if (senderVideo.mozCaptureStream) {
      stream = senderVideo.mozCaptureStream();
      startPeerConnection();
    } else {
      console.log("captureStream() not supported");
    }
  };

  const startPeerConnection = () => {
    // Initialise peer connection #1
    senderPeer = new RTCPeerConnection();
    senderPeer.onicecandidate = (e) => onIceCandidate(senderPeer, e);

    // Initialise peer connection #2
    receiverPeer = new RTCPeerConnection();
    receiverPeer.onicecandidate = (e) => onIceCandidate(receiverPeer, e);
    receiverPeer.ontrack = gotRemoteStream;

    stream.getTracks().forEach((track) => senderPeer.addTrack(track, stream));

    void senderPeer.createOffer(
      onCreateOfferSuccess,
      onCreateSessionDescriptionError,
      offerOptions,
    );
  };

  const onIceCandidate = (
    pc: RTCPeerConnection,
    event: RTCPeerConnectionIceEvent,
  ) => {
    if (event.candidate) {
      void getOtherPc(pc).addIceCandidate(event.candidate);
    }
  };

  const getOtherPc = (pc: RTCPeerConnection) => {
    return pc === senderPeer ? receiverPeer : senderPeer;
  };

  const gotRemoteStream = (event: RTCTrackEvent) => {
    const receiverVideo = receiverVideoRef.current;
    if (!receiverVideo) {
      return;
    }
    if (receiverVideo.srcObject !== event.streams[0]) {
      receiverVideo.srcObject = event.streams[0];
    }
  };

  const onCreateOfferSuccess = (desc: RTCSessionDescriptionInit) => {
    void senderPeer.setLocalDescription(desc);
    void receiverPeer.setRemoteDescription(desc);
    void receiverPeer.createAnswer(
      onCreateAnswerSuccess,
      onCreateSessionDescriptionError,
    );
  };

  const onCreateSessionDescriptionError = (error: DOMException) => {
    console.log(`Failed to create session description: ${error.message}`);
  };

  const onCreateAnswerSuccess = (desc: RTCSessionDescriptionInit) => {
    void receiverPeer.setLocalDescription(desc);
    void senderPeer.setRemoteDescription(desc);
  };

  useEffect(() => {
    if (senderVideoRef.current) {
      const senderVideo = senderVideoRef.current;
      // Video tag capture must be set up after video tracks are enumerated.
      senderVideo.oncanplay = maybeCreateStream;
      if (senderVideo.readyState >= 3) {
        // HAVE_FUTURE_DATA
        // Video is already ready to play, call maybeCreateStream in case oncanplay
        // fired before we registered the event handler.
        maybeCreateStream();
      }
      senderVideo.onplay = () => {
        void receiverVideoRef.current?.play();
      };
      senderVideo.onpause = () => {
        receiverVideoRef.current?.pause();
      };
      void senderVideo.play();
    }
  }, []);

  return (
    <>
      <h1>WebRTC Stats + ChartJS React example</h1>
      <h2>WebRTC Peers</h2>
      <div className="peers-container">
        <div className="video-container">
          <h3>Sender video</h3>
          <video ref={senderVideoRef} playsInline controls loop autoPlay muted>
            <source src={chromeWebm} type="video/webm" />
            <source src={chromeMp4} type="video/mp4" />
            <p>This browser does not support the video element.</p>
          </video>
        </div>

        <div className="video-container">
          <h3>Receiver video</h3>
          <video
            ref={receiverVideoRef}
            playsInline
            controls
            loop
            autoPlay
            muted
          ></video>
        </div>
      </div>
      <h2>Receiver Stats</h2>
      <Stats />
    </>
  );
};

export default WebRTCStats;