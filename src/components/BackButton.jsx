import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
    const navigate = useNavigate()
  return (
    <button onClick={() => navigate(-1)} className="text-blue-500 text-xs mb-4">
      ← Back
    </button>
  );
};

export default BackButton;
