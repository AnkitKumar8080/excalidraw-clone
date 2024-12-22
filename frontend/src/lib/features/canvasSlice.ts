import {
  StrokeElement,
  CanvasState,
  Point,
  ActionType,
  SelectedElementType,
} from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CanvasState = {
  elements: [],
  scale: 1,
  scaleOffset: { x: 0, y: 0 },
  panOffset: { x: 0, y: 0 },
  action: "none",
  selectedElement: null,
};

export const strokeElementsSlice = createSlice({
  name: "strokeElements",
  initialState,
  reducers: {
    addStrokeElement: (state, action: PayloadAction<StrokeElement>) => {
      state.elements.push(action.payload);
    },

    // refresh elements state for re render
    refreshElementsState: (state) => {
      state.elements = [...state.elements];
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

    // update a stroke element points at particular index with new points
    replaceStrokeElementPoints: (
      state,
      action: PayloadAction<{ id: number; newPoints: Point[] }>
    ) => {
      const { id, newPoints } = action.payload;

      const index = state.elements.findIndex((element) => element.id === id);

      if (index >= 0) {
        state.elements[index].points = newPoints;
      }
    },

    // remove a strke element by id
    removeStrokeElementById: (state, action: PayloadAction<number>) => {
      const id = action.payload;

      const index = state.elements.findIndex((element) => element.id === id);

      if (index >= 0) {
        state.elements.splice(index, 1);
      }
    },

    // update the scale
    setScale: (state, action: PayloadAction<number>) => {
      state.scale = action.payload;
    },

    // update the offset scale
    setScaleOffset: (state, action: PayloadAction<Point>) => {
      state.scaleOffset = action.payload;
    },

    // update the panOffset
    setPanOffset: (state, action: PayloadAction<Point>) => {
      state.panOffset = action.payload;
    },

    // update the action
    setAction: (state, action: PayloadAction<ActionType>) => {
      state.action = action.payload;
    },

    // set the selected element
    setSelectedElement: (
      state,
      action: PayloadAction<SelectedElementType | null>
    ) => {
      state.selectedElement = action.payload;
    },
  },
});

export const {
  addStrokeElement,
  updateStrokeElement,
  setSelectedElement,
  setAction,
  setPanOffset,
  setScale,
  replaceStrokeElementPoints,
  removeStrokeElementById,
} = strokeElementsSlice.actions;
export default strokeElementsSlice.reducer;
