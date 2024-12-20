import { ReactNode } from "react";

export type ToolType =
  | "pan"
  | "select"
  | "square"
  | "rectangle"
  | "circle"
  | "line"
  | "drawing"
  | "eraser"
  | "text";

export type ToolState = {
  selectedTool: ToolType;
};

export type CursorStyleType =
  | "grab"
  | "not-allowed"
  | "crosshair"
  | "grab"
  | "default"
  | "line";

export type StrokeWidthType = "thin" | "bold" | "extrabold";

export type StrokeStyleType = "solid" | "dashed" | "dotted";

export type Point = { x: number; y: number; pressure?: number };

export type StrokeState = {
  strokeColor: string;
  strokeBackground?: string;
  strokeWidth: StrokeWidthType;
  strokeStyle?: StrokeStyleType;
};

export type StrokeWidthState = {
  widthIcon: ReactNode;
  strokeWidth: StrokeWidthType;
};

export type StrokeStyleState = {
  strokeIcon: ReactNode;
  strokeStyle: StrokeStyleType;
};

export type StrokeElement = {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: ToolType;
  points?: Point[];
  strokeSetting?: StrokeState;
};

export type StrokeElementsState = {
  elements: StrokeElement[];
};
