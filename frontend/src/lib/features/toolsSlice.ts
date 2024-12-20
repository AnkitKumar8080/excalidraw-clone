import { ToolState, ToolType } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ToolState = {
  selectedTool: "pan",
};

const toolSlice = createSlice({
  name: "tool",
  initialState,
  reducers: {
    selectTool: (state, action: PayloadAction<ToolType>) => {
      state.selectedTool = action.payload;
    },
  },
});

export const { selectTool } = toolSlice.actions;
export default toolSlice.reducer;
