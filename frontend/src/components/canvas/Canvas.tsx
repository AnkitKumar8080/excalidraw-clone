"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks/reduxHooks";
import {
  drawLine,
  drawSquareOrRectangle,
  drawStroke,
  getElementAtPosition,
} from "@/lib/utils";
import { Point, SelectedElementType } from "@/types";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import useCanvas from "@/lib/hooks/useCanvas";
import {
  removeStrokeElementById,
  replaceStrokeElementPoints,
  setSelectedElement,
} from "@/lib/features/canvasSlice";
import StrokeSettings from "../strokeSettings/StrokeSettings";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  // state to manually trigger rerendering of canvas
  const [date, setDate] = useState<number>(Date.now());

  const { elements, panOffset, scale, scaleOffset, action, selectedElement } =
    useAppSelector((state) => state.canvas);
  const { selectedTool } = useAppSelector((state) => state.tool);

  const {
    createStrokeElement,
    updateStrokeElementPoints,
    updateStrokeElementForShape,
  } = useCanvas();

  const dispatch = useAppDispatch();

  const getMouseCoordinates = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ): Point => {
    const x = (event.clientX - panOffset.x * scale + scaleOffset.x) / scale;
    const y = (event.clientY - panOffset.y * scale + scaleOffset.y) / scale;

    return { x, y };
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    // if (action === "writing") return;
    setIsDrawing(true);

    const { x, y } = getMouseCoordinates(event);

    if (selectedTool === "select") {
      // get the selected element if clicked on it
      const foundElement = getElementAtPosition(x, y, elements);

      if (foundElement) {
        let selectedStrokeElement: SelectedElementType = {
          ...foundElement,
        };

        if (foundElement?.type === "drawing" && foundElement.points) {
          const xOffsets = foundElement.points.map((point) => x - point.x);
          const yOffsets = foundElement.points.map((point) => y - point.y);

          selectedStrokeElement = {
            ...selectedStrokeElement,
            xOffsets,
            yOffsets,
          };
        } else {
          const offsetX = x - selectedStrokeElement.x1;
          const offsetY = y - selectedStrokeElement.y1;
          selectedStrokeElement = {
            ...selectedStrokeElement,
            offsetX,
            offsetY,
          };
        }
        dispatch(setSelectedElement(selectedStrokeElement));
      }
    }
    if (selectedTool === "eraser") {
      const foundElement = getElementAtPosition(x, y, elements);

      if (foundElement) {
        dispatch(removeStrokeElementById(foundElement.id));
      }
    } else {
      // create a new strokeElement in redux state
      createStrokeElement(x, y);
      // setDate(Date.now());
    }
  };

  const handleMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!isDrawing) return;
    if (selectedTool === "pan") {
      return;
    }

    const { x, y } = getMouseCoordinates(event);

    if (selectedTool === "line") {
      const lastElementIndex = elements.length - 1;
      if (lastElementIndex >= 0) {
        return updateStrokeElementForShape(elements[lastElementIndex], x, y);
      }
    }

    if (selectedTool === "rectangle") {
      const lastElementIndex = elements.length - 1;
      if (lastElementIndex >= 0) {
        const width = x - elements[lastElementIndex].x1;
        const height = y - elements[lastElementIndex].y1;
        return updateStrokeElementForShape(
          elements[lastElementIndex],
          width,
          height
        );
      }
    }

    if (selectedTool === "drawing") {
      // update the element with new points
      const lastElementIndex = elements.length - 1;
      if (lastElementIndex >= 0) {
        return updateStrokeElementPoints(elements[lastElementIndex], [
          { x, y },
        ]);
      }
    }

    if (selectedTool === "select") {
      // update the position of the points with the new offset values

      if (
        selectedElement?.type === "drawing" &&
        "points" in selectedElement &&
        "xOffsets" in selectedElement &&
        "yOffsets" in selectedElement
      ) {
        const newPoints = selectedElement.points?.map((_, index) => ({
          x: x - selectedElement.xOffsets![index],
          y: y - selectedElement.yOffsets![index],
        }));

        if (newPoints?.length)
          dispatch(
            replaceStrokeElementPoints({ id: selectedElement.id, newPoints })
          );
      }
    }
  };

  const handleMouseUp = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!isDrawing) return;

    setIsDrawing(false);
    dispatch(setSelectedElement(null));
  };

  // useEffect to render all the stroke elements stored in the state
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    elements?.forEach((element) => {
      if (element?.points && element.strokeSetting) {
        if (element.type === "drawing") {
          return drawStroke(ctx, element.points, element.strokeSetting);
        }
      }
      if (element.strokeSetting && element.type === "line") {
        if (!canvasRef.current) return;
        return drawLine(
          canvasRef.current,
          element.x1,
          element.y1,
          element.x2,
          element.y2,
          element.strokeSetting
        );
      }

      if (element.strokeSetting && element.type === "rectangle") {
        if (!canvasRef.current) return;
        return drawSquareOrRectangle(
          canvasRef.current,
          element.x1,
          element.y1,
          element.x2,
          element.y2,
          element.strokeSetting
        );
      }
    });
  }, [elements, date]);

  // useLayoutEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;

  //   canvas.width = window.innerWidth;
  //   canvas.height = window.innerHeight;
  // }, []);

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
