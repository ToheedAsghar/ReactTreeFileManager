import { configureStore } from "@reduxjs/toolkit";
import explorerReducer from "./Slices/explorerSlice";

const LS_KEY = "explorerState";

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    explorer: explorerReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  const state = store.getState();
  saveState({
    explorer: state.explorer,
  });
});