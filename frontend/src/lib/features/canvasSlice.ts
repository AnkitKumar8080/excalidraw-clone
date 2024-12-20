import { StrokeElement, StrokeElementsState } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: StrokeElementsState = {
  elements: [],
};

export const strokeElementsSlice = createSlice({
  name: "strokeElements",
  initialState,
  reducers: {
    addStrokeElement: (state, action: PayloadAction<StrokeElement>) => {
      state.elements.push(action.payload);
    },

    // update stroke elements
    updateStrokeElement: (
      state,
      action: PayloadAction<{ id: number; updatedElement: StrokeElement }>
    ) => {
      const { id, updatedElement } = action.payload;

      const index = state.elements.findIndex((element) => element.id === id);

      if (index >= 0) {
        state.elements[index] = updatedElement;
      }
    },
  },
});

export const { addStrokeElement, updateStrokeElement } =
  strokeElementsSlice.actions;
export default strokeElementsSlice.reducer;
