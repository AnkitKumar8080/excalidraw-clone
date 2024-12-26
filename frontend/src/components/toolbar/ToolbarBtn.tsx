"use client";

import { selectTool } from "@/lib/features/toolsSlice";
import { useAppDispatch } from "@/lib/hooks/reduxHooks";
import { CursorStyleType, ToolType } from "@/types";
import { ReactNode } from "react";

type ToolbarBtnProps = {
  tool: ToolType;
  icon: ReactNode;
  cursorStyle: CursorStyleType;
  active: boolean;
};

const ToolbarBtn = ({ icon, tool, active }: ToolbarBtnProps) => {
  const dispatch = useAppDispatch();
  return (
    <button
      className={`p-2 hover:cursor-pointer rounded-md ${
        active ? "bg-purple-200" : "bg-white"
      } ${!active && "hover:bg-purple-100"}`}
      onClick={() => {
        dispatch(selectTool(tool));
      }}
    >
      {icon}
    </button>
  );
};

export default ToolbarBtn;
