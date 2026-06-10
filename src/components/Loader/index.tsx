import React from "react";
import "./loader.scss";

const Loader = () => {
  return (
    <div
      className="lds-dual-ring"
      role="status"
      aria-label="Loading weather"
    />
  );
};

export default Loader;
