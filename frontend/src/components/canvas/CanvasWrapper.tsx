import React from "react";
import Canvas from "./Canvas";
import Toolbar from "../toolbar/Toolbar";
import StrokeSettings from "../strokeSettings/StrokeSettings";

const CanvasWrapper = () => {
  return (
    <div className="w-full h-full relative">
      <Toolbar />
      <Canvas />
      <StrokeSettings />
    </div>
  );
};

export default CanvasWrapper;
