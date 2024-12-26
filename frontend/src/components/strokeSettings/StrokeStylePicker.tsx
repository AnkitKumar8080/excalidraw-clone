"use client";
import { setStrokeStyle } from "@/lib/features/strokeSlice";
import { useAppDispatch } from "@/lib/hooks/reduxHooks";
import { StrokeStyleType } from "@/types";
import React, { ReactNode } from "react";

type strokeStylePicker = {
  styles: {
    strokeIcon: ReactNode;
    strokeStyle: StrokeStyleType;
  }[];
  selectedStyle: StrokeStyleType;
};

const StrokeStylePicker = ({ styles, selectedStyle }: strokeStylePicker) => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex gap-2">
      {styles?.map((stroke, idx) => (
        <div
          onClick={() => dispatch(setStrokeStyle(stroke.strokeStyle))}
          key={idx}
          className={`p-1 ${
            selectedStyle !== stroke.strokeStyle && "hover:bg-gray-300"
          } rounded-md cursor-pointer ${
            selectedStyle === stroke.strokeStyle ? "bg-gray-400" : "bg-gray-200"
          }`}
        >
          {stroke.strokeIcon}
        </div>
      ))}
    </div>
  );
};

export default StrokeStylePicker;
