"use client";

import React, { ReactNode } from "react";
import ToolbarBtn from "./ToolbarBtn";
import {
  FaRegCircle,
  FaRegSquare,
  IoText,
  LuEraser,
  LuPencil,
  RxCursorArrow,
  TfiLayoutLineSolid,
} from "@/icons";
import { CursorStyleType, ToolType } from "@/types";
import { useAppSelector } from "@/lib/hooks/reduxHooks";
const Toolbar = () => {
  const iconBtnStyle = "h-4 w-4";
  const { selectedTool } = useAppSelector((state) => state.tool);
  const toolbarBtns = [
    // {
    //   tool: "pan",
    //   icon: <IoHandRightOutline className={iconBtnStyle} />,
    //   cursorStyle: "grab",
    // },
    {
      tool: "select",
      icon: <RxCursorArrow className={iconBtnStyle} />,
      cursorStyle: "default",
    },
    {
      tool: "rectangle",
      icon: <FaRegSquare className={iconBtnStyle} />,
      cursorStyle: "crosshair",
    },
    {
      tool: "circle",
      icon: <FaRegCircle className={iconBtnStyle} />,
      cursorStyle: "crosshair",
    },
    {
      tool: "line",
      icon: <TfiLayoutLineSolid className={iconBtnStyle} />,
      cursorStyle: "line",
    },
    {
      tool: "drawing",
      icon: <LuPencil className={iconBtnStyle} />,
      cursorStyle: "crosshair",
    },
    {
      tool: "eraser",
      icon: <LuEraser className={iconBtnStyle} />,
      cursorStyle: "not-allowed",
    },
    {
      tool: "text",
      icon: <IoText className={iconBtnStyle} />,
      cursorStyle: "text",
    },
  ];

  return (
    <div className="flex bg-white text-gray-900 gap-2 p-1 drop-shadow-lg rounded-md max-w-max absolute left-1/2 top-4 -translate-x-1/2 border-gray-200 border-t-[1px] transition-colors duration-33300">
      {toolbarBtns.map(({ tool, icon, cursorStyle }, idx) => (
        <ToolbarBtn
          key={idx}
          tool={tool as ToolType}
          icon={icon as ReactNode}
          cursorStyle={cursorStyle as CursorStyleType}
          active={selectedTool === tool}
        />
      ))}
    </div>
  );
};

export default Toolbar;
