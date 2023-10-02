import { create } from "zustand";
import { Tool, ToolStoreType } from "../types/tools";
import { Cursor } from "../types/cursor";

export const useTool = create<ToolStoreType>()((set, get) => ({
  cursor: "pointer",
  setCursor: (cursor: Cursor) => {
    set((state) => ({ ...state, cursor }));
  },

  using: null,
  setUsing: (tool: Tool) => {
    set((state) => ({ ...state, using: tool }));
  },
}));
