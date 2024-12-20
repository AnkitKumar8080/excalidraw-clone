"use client";

import { useAppSelector } from "@/lib/hooks/reduxHooks";
import { drawStroke } from "@/lib/utils";
import { Point } from "@/types";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import useCanvas from "@/lib/hooks/useCanvas";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);

  const { elements } = useAppSelector((state) => state.strokeElements);
  const strokeSetting = useAppSelector((state) => state.strokeSetting);

  const { createStrokeElement, updateStrokeElementPoints } = useCanvas();

  const handleMouseDown = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    setIsDrawing(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const { offsetX, offsetY } = event.nativeEvent;
    const point: Point = { x: offsetX, y: offsetY };
    setCurrentStroke([point]);

    // create a new strokeElement in redux state
    createStrokeElement(offsetX, offsetY);
  };

  const handleMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = event.nativeEvent;

    // update the element with new points
    const lastElementIndex = elements.length - 1;
    if (lastElementIndex >= 0) {
      updateStrokeElementPoints(elements[lastElementIndex], [
        { x: offsetX, y: offsetY },
      ]);
    }

    setCurrentStroke((prev) => [...prev, { x: offsetX, y: offsetY }]);
  };

  const handleMouseUp = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!isDrawing) return;

    setIsDrawing(false);
  };

  // useEffect to render all the stroke elements stored in the state
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    elements?.forEach((element) => {
      if (element?.points && element.strokeSetting) {
        return drawStroke(ctx, element.points, element.strokeSetting);
      }
    });

    ctx.restore();
  }, [elements]);

  return (
    <canvas
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      width={window.innerWidth}
      height={window.innerHeight}
      className="bg-white"
      ref={canvasRef}
    />
  );
};
export default Canvas;
