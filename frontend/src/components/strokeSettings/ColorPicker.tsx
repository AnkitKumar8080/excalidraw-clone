"use client";

import React from "react";

type ColorPickerProps = {
  colors: string[];
  handleColorChange: (color: string) => void;
  selectedColor: string | undefined;
};

const ColorPicker = ({
  colors,
  handleColorChange,
  selectedColor,
}: ColorPickerProps) => {
  return (
    <div className="flex gap-1 items-center">
      <div className="flex">
        {colors?.map((color, idx) => (
          <div
            key={idx}
            className={`size-6 p-[1px] rounded-md border-black border-[1x] hover:border-[1px] inline-block m-0.5`}
          >
            <button
              className={`size-full rounded-md`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="border-l-2 border-gray-300 h-6" />
        <div
          className={`size-7 rounded-md`}
          style={{ backgroundColor: selectedColor }}
        ></div>
      </div>
    </div>
  );
};

export default ColorPicker;
