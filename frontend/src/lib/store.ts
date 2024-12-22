import { configureStore } from "@reduxjs/toolkit";
import toolReducer from "@/lib/features/toolsSlice";
import strokeSettingSlice from "@/lib/features/strokeSlice";
import strokeElementsSlice from "./features/canvasSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      tool: toolReducer,
      strokeSetting: strokeSettingSlice,
      canvas: strokeElementsSlice,
    },
  });
};

// export the types of make store
export type AppStore = ReturnType<typeof makeStore>;

// export the types of rootState and AppDispatch state
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
