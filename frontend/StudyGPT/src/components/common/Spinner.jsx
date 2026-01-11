import React from "react";

const Spinner = ({ size = 20 }) => {
  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      aria-label="Loading"
      role="status"
    >
      <div className="absolute inset-0 rounded-full border-2 border-cyan-900/30" />
      <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-cyan-900" />
    </div>
  );
};

export default Spinner;
