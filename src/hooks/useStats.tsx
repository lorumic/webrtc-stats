import { useContext } from "react";
import { StatsContext } from "../context/stats";

export default function useStats() {
  return useContext(StatsContext);
}
