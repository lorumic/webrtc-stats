import React, { FC } from "react";
import "./App.css";
import WebRTCStats from "./components/WebRTCStats";
import StatsProvider from "context/stats";

const App: FC = () => {
  return (
    <div className="App">
      <StatsProvider>
        <WebRTCStats />
      </StatsProvider>
    </div>
  );
};

export default App;
