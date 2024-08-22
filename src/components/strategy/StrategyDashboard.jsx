import React from "react";
import AddStrategy from "./AddStrategy";
import AddHashTags from "./AddHashTags";
import { useNavigate } from "react-router-dom";

const StrategyDashboard = () => {
  const navigate = useNavigate()
  return (
    <div className="">
      <button onClick={() => navigate(-1)} className="text-blue-500 text-xs mb-4">
        ← Back
      </button>
      <div className="flex flex-wrap gap-x-4">
        <AddStrategy />
        <AddHashTags />
      </div>
    </div>
  );
};

export default StrategyDashboard;
