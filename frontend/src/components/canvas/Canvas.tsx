"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks/reduxHooks";
import {
  drawCircle,
  drawLine,
  drawSquareOrRectangle,
  drawStroke,
  drawText,
  getElementAtPosition,
} from "@/lib/utils";
import {
  Point,
  SelectedElementType,
  StrokeElement,
  StrokeState,
} from "@/types";
import React, { useEffect, useRef, useState } from "react";
import useCanvas from "@/lib/hooks/useCanvas";
import {
  removeStrokeElementById,
  replaceStrokeElementPoints,
  setSelectedElement,
  updateStrokeElement,
} from "@/lib/features/canvasSlice";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  // state to manually trigger rerendering of canvas
  const [date, setDate] = useState<number>(Date.now());
  const [showInput, setShowInput] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputPosition, setInputPosition] = useState<Point>({ x: 0, y: 0 });
  const [inputText, setInputText] = useState<string>("");
  const { elements, panOffset, scale, scaleOffset, action, selectedElement } =
    useAppSelector((state) => state.canvas);
  const { selectedTool } = useAppSelector((state) => state.tool);
  const strokeSetting = useAppSelector((state) => state.strokeSetting);

  const {
    createStrokeElement,
    updateStrokeElementPoints,
    updateStrokeElementForShape,
    updateStrokeElementForText,
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

    if (showInput) {
      return;
    }
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
        }
        if (foundElement?.type === "line") {
          const offsetX1 = x - foundElement.x1;
          const offsetY1 = y - foundElement.y1;
          const offsetX2 = x - foundElement.x2;
          const offsetY2 = y - foundElement.y2;

          selectedStrokeElement = {
            ...selectedStrokeElement,
            offsetX1,
            offsetY1,
            offsetX2,
            offsetY2,
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
    }

    if (selectedTool === "text") {
      setInputPosition({ x, y });
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      setShowInput(true);
      // create a new stroke element
      createStrokeElement(x, y);
    } else {
      // create a new strokeElement in redux state
      createStrokeElement(x, y);
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

    if (selectedTool === "circle") {
      const lastElementIndex = elements.length - 1;
      if (lastElementIndex >= 0) {
        const startX = elements[lastElementIndex].x1;
        const startY = elements[lastElementIndex].y1;

        // calculate teh radius using the distance formuala
        const radius = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
        return updateStrokeElementForShape(
          elements[lastElementIndex],
          radius,
          radius
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

      if (
        selectedElement?.type === "rectangle" ||
        selectedElement?.type === "circle" ||
        selectedElement?.type === "text"
      ) {
        const updatedSelectedElement: StrokeElement = {
          ...selectedElement,
          x1: x - selectedElement.offsetX!,
          y1: y - selectedElement.offsetY!,
        };

        dispatch(
          updateStrokeElement({
            id: selectedElement.id,
            updatedElement: updatedSelectedElement,
          })
        );
      }

      if (selectedElement?.type === "line") {
        const updatedSelectedElement: StrokeElement = {
          ...selectedElement,
          x1: x - selectedElement.offsetX1!,
          y1: y - selectedElement.offsetY1!,
          x2: x - selectedElement.offsetX2!,
          y2: y - selectedElement.offsetY2!,
        };

        dispatch(
          updateStrokeElement({
            id: selectedElement.id,
            updatedElement: updatedSelectedElement,
          })
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

  const handleInputBlur = () => {
    setIsDrawing(false);
    setShowInput(false);

    const lastElementIndex = elements.length - 1;
    if (lastElementIndex >= 0) {
      if (!inputText) {
        return dispatch(removeStrokeElementById(elements[lastElementIndex].id));
      }
      updateStrokeElementForText(elements[lastElementIndex], inputText);
    }

    setInputText("");
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

      if (element.strokeSetting && element.type === "circle") {
        if (!canvasRef.current) return;
        return drawCircle(
          canvasRef.current,
          element.x1,
          element.y1,
          element.x2,
          element.strokeSetting
        );
      }

      if (
        element.type === "text" &&
        element.strokeSetting &&
        element.textValue
      ) {
        if (!canvasRef.current) return;
        return drawText(
          canvasRef.current,
          element.x1,
          element.y1,
          element.textValue,
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
    <div>
      <canvas
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        width={window.innerWidth}
        height={window.innerHeight}
        className="bg-white"
        ref={canvasRef}
      />

      {showInput && (
        <input
          ref={inputRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="fixed font-medium outline-none bg-transparent text-gray-950 border-gray-200 border-2"
          style={{
            left: `${inputPosition.x}px`,
            top: `${inputPosition.y}px`,
            color: `${strokeSetting.strokeColor}`,
          }}
          onBlur={handleInputBlur}
        />
      )}
    </div>
  );
};
export default Canvas;
