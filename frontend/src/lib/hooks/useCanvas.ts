"use client";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { addStrokeElement, updateStrokeElement } from "../features/canvasSlice";
import { Point, StrokeElement } from "@/types";

const useCanvas = () => {
  const dispatch = useAppDispatch();
  const { selectedTool } = useAppSelector((state) => state.tool);
  const strokeSetting = useAppSelector((state) => state.strokeSetting);
  const { elements } = useAppSelector((state) => state.canvas);

  const createStrokeElement = (
    x1: number,
    y1: number,
    x2?: number,
    y2?: number
  ): StrokeElement => {
    // generate a id which will be index of the element in the elements array
    const id = elements.length;

    const strokeElement = {
      id: id,
      x1,
      y1,
      x2: 0,
      y2: 0,
      type: selectedTool,
      points: [{ x: x1, y: y1 }],
      strokeSetting: strokeSetting,
    };

    if (selectedTool === "drawing") {
      dispatch(addStrokeElement(strokeElement));
    }

    return strokeElement;
  };

  // updating the stroke element
  const updateStrokeElementPoints = (
    strokeElement: StrokeElement,
    points: Point[]
  ) => {
    const updatedStrokeElement = {
      ...strokeElement,
      points: [...(strokeElement.points || []), ...points],
    };
    dispatch(
      updateStrokeElement({
        id: strokeElement.id,
        updatedElement: updatedStrokeElement,
      })
    );
  };
  return { createStrokeElement, updateStrokeElementPoints };
};

export default useCanvas;
