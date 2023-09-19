import { fabric } from "fabric";
import { Element, Tracks } from "./track";

export interface StoreTypes {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;

  videos: string[];
  images: string[];

  // elements
  tracks: Tracks[];
  selectedElement: Element | null;
  addElement: (trackId: string, element: Element) => void;
  setSelectedElement: (element: Element) => void;
  updateElement: (elementId: string, data: any) => void;

  //
  panelScale: number;
  addPanelScale: (n: number) => void;
  setPanelScale: (panelScale: number) => void;

  playing: boolean;
  fps: number;
  maxTime: number;
  setMaxTime: (time: number) => void;

  currentKeyFrame: number;
  getCurrentTimeInMs: () => number;
  setCurrentTimeInMs: (time: number) => void;
  rewindCurrentTimeInMs: (time: number, forward: boolean) => void;
}
