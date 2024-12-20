"use client";

import { setStrokeWidth } from "@/lib/features/strokeSlice";
import { useAppDispatch } from "@/lib/hooks/reduxHooks";
import { StrokeWidthType } from "@/types";
import { ReactNode } from "react";

type StrokeWidthPicketProps = {
  widths: {
    widthIcon: ReactNode;
    strokeWidth: StrokeWidthType;
  }[];
  selectedWidth: StrokeWidthType;
};

const StrokeWidthPicker = ({
  widths: strokes,
  selectedWidth,
}: StrokeWidthPicketProps) => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex gap-2">
      {strokes?.map((stroke, idx) => (
        <div
          onClick={() => dispatch(setStrokeWidth(stroke.strokeWidth))}
          key={idx}
          className={`p-1 rounded-md cursor-pointer ${
            selectedWidth !== stroke.strokeWidth && "hover:bg-gray-300"
          } ${
            selectedWidth === stroke.strokeWidth
              ? "bg-gray-400"
              : "bg-gray-200 "
          }`}
        >
          {stroke.widthIcon}
        </div>
      ))}
    </div>
  );
};

export default StrokeWidthPicker;
