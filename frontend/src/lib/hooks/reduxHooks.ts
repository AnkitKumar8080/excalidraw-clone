"use client";

import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppStore, AppDispatch, RootState } from "../store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
