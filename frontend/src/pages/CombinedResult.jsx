// src/pages/CombinedResult.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import ScanResult from "./ScanResult";    // pest / leaf UI
import SoilResult from "./SoilResult";    // soil UI

function CombinedResult() {
  const { state } = useLocation();
  let result = state?.result;

  if (!result) {
    try {
      const cached = localStorage.getItem("kisan_mitra_last_soil_scan");
      if (cached) {
        result = JSON.parse(cached);
      }
    } catch (e) {}
  }

  const routedTo = result?.routed_to;

  if (routedTo === "soil" || result?.soil_type) {
    return <SoilResult />;
  }

  // default: leaf / pest
  return <ScanResult />;
}

export default CombinedResult;
