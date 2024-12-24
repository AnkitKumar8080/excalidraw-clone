"use client";
import React from "react";
import ColorPicker from "./ColorPicker";
import StrokeWidthPicker from "./StrokeWidthPicker";
import StrokeStylePicker from "./StrokeStylePicker";
import { TfiLayoutLineSolid, TfiLineDashed, TfiLineDotted } from "@/icons";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/reduxHooks";
import {
  setStrokeBackground,
  setStrokeColor,
} from "@/lib/features/strokeSlice";
import { StrokeStyleState, StrokeWidthState } from "@/types";

const StrokeSettings = () => {
  const dispatch = useAppDispatch();

  const strokeColors = ["#000000", "#e03131", "#2f9e44", "#1971c2", "#f08c00"];
  const strokeBgColors = [
    "#ebebeb",
    "#ffc9c9",
    "#b2f2bb",
    "#a5d8ff",
    "#ffec99",
  ];

  const strokeWidths: StrokeWidthState[] = [
    {
      widthIcon: <TfiLayoutLineSolid strokeWidth={1} />,
      strokeWidth: "thin",
    },
    {
      widthIcon: <TfiLayoutLineSolid strokeWidth={2} />,
      strokeWidth: "bold",
    },
    {
      widthIcon: <TfiLayoutLineSolid strokeWidth={3} />,
      strokeWidth: "extrabold",
    },
  ];

  const strokeStyles: StrokeStyleState[] = [
    {
      strokeIcon: <TfiLayoutLineSolid strokeWidth={1} />,
      strokeStyle: "solid",
    },
    {
      strokeIcon: <TfiLineDotted strokeWidth={1} />,
      strokeStyle: "dotted",
    },
    {
      strokeIcon: <TfiLineDashed strokeWidth={1} />,
      strokeStyle: "dashed",
    },
  ];
  const handleStrokeColorChange = (color: string): void => {
    dispatch(setStrokeColor(color));
  };
  const handleStrokeBackgroundChange = (color: string): void => {
    dispatch(setStrokeBackground(color));
  };

  const { strokeColor, strokeBackground, strokeWidth, strokeStyle } =
    useAppSelector((state) => state.strokeSetting);

  const { selectedTool } = useAppSelector((state) => state.tool);

  return (
    <div
      className={`${
        (selectedTool === "pan" ||
          selectedTool === "select" ||
          selectedTool === "eraser") &&
        "hidden"
      } absolute top-28 left-5 rounded-md shadow-lg text-black border-l-2 border-t-2 space-y-4 p-3 bg-white`}
    >
      <div>
        <h2 className="text-gray-700 text-sm font-medium mb-0.5">Stroke</h2>
        <ColorPicker
          colors={strokeColors}
          handleColorChange={handleStrokeColorChange}
          selectedColor={strokeColor}
        />
      </div>

      <div
        className={`${
          (selectedTool === "text" ||
            selectedTool === "line" ||
            selectedTool === "drawing") &&
          "hidden"
        }`}
      >
        <h2 className="text-gray-700 text-sm font-medium mb-0.5">
          {" "}
          Background
        </h2>
        <ColorPicker
          colors={strokeBgColors}
          handleColorChange={handleStrokeBackgroundChange}
          selectedColor={strokeBackground}
        />
      </div>

      <div className={`${selectedTool === "text" && "hidden"}`}>
        <h2 className="text-gray-700 text-sm font-medium mb-0.5">
          Stroke width
        </h2>
        <StrokeWidthPicker widths={strokeWidths} selectedWidth={strokeWidth} />
      </div>

      <div
        className={`${
          (selectedTool === "text" || selectedTool === "drawing") && "hidden"
        }`}
      >
        <h2 className="text-gray-700 text-sm font-medium mb-0.5">
          Stroke style
        </h2>
        <StrokeStylePicker styles={strokeStyles} selectedStyle={strokeStyle!} />
      </div>
    </div>
  );
};

export default StrokeSettings;
