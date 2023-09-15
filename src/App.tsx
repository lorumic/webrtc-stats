import React, { FC } from "react";
import "./App.css";
import WebRTCStats from "./components/WebRTCStats";

const App: FC = () => {
  return (
    <div className="App">
      <WebRTCStats />
    </div>
  );
};

export default App;
