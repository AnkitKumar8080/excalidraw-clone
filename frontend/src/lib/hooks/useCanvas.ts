"use client";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { addStrokeElement, updateStrokeElement } from "../features/canvasSlice";
import { Point, StrokeElement, ToolType } from "@/types";

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

    const strokeElement: StrokeElement = {
      id: id,
      x1,
      y1,
      x2: 0,
      y2: 0,
      type: selectedTool,
      strokeSetting: strokeSetting,
    };

    if (selectedTool === "drawing") {
      strokeElement.points = [{ x: x1, y: y1 }];
    }

    if (selectedTool === "drawing" || selectedTool === "line") {
      strokeElement.x2 = x1;
      strokeElement.y2 = y1;
    }

    const toolsArray: ToolType[] = [
      "circle",
      "drawing",
      "line",
      "rectangle",
      "text",
    ];

    if (toolsArray.includes(selectedTool)) {
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

  const updateStrokeElementForShape = (
    strokeElement: StrokeElement,
    x2: number,
    y2: number
  ) => {
    const updatedStrokeElement = {
      ...strokeElement,
      x2: x2,
      y2: y2,
    } as StrokeElement;

    dispatch(
      updateStrokeElement({
        id: strokeElement.id,
        updatedElement: updatedStrokeElement,
      })
    );
  };

  // function for updating the text element
  const updateStrokeElementForText = (
    strokeElement: StrokeElement,
    textValue: string
  ) => {
    const updatedStrokeElement: StrokeElement = {
      ...strokeElement,
      textValue,
    };
    dispatch(
      updateStrokeElement({
        id: strokeElement.id,
        updatedElement: updatedStrokeElement,
      })
    );
  };
  return {
    createStrokeElement,
    updateStrokeElementPoints,
    updateStrokeElementForShape,
    updateStrokeElementForText,
  };
};

export default useCanvas;
