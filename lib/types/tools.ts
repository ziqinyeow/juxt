import { Cursor } from "./cursor";

export type Tool = {
  name: string;
  shortcut?: string;
  icon: JSX.Element;
};

export type Tools = {
  name: string;
  focus?: boolean;
  tools: Tool[];
};

export type ToolStoreType = {
  cursor: Cursor;
  setCursor: (cursor: Cursor) => void;
  using: Tool | null;
  setUsing: (tool: Tool) => void;
};
