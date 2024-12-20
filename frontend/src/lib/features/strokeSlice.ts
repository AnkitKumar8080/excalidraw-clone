import { StrokeState, StrokeStyleType, StrokeWidthType } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: StrokeState = {
  strokeColor: "#1e1e1e",
  strokeBackground: "#ebebeb",
  strokeWidth: "thin",
  strokeStyle: "solid",
};

const strokeSettingSlice = createSlice({
  name: "strokeSetting",
  initialState,
  reducers: {
    setStrokeColor: (state, action: PayloadAction<string>) => {
      state.strokeColor = action.payload;
    },

    setStrokeBackground: (state, action: PayloadAction<string>) => {
      state.strokeBackground = action.payload;
    },

    setStrokeWidth: (state, action: PayloadAction<StrokeWidthType>) => {
      state.strokeWidth = action.payload;
    },

    setStrokeStyle: (state, action: PayloadAction<StrokeStyleType>) => {
      state.strokeStyle = action.payload;
    },
  },
});

export const {
  setStrokeColor,
  setStrokeBackground,
  setStrokeWidth,
  setStrokeStyle,
} = strokeSettingSlice.actions;

export default strokeSettingSlice.reducer;
