import { fabric } from "fabric";

export interface StoreTypes {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;

  videos: string[];
  images: string[];

  playing: boolean;
  fps: number;
  maxTime: number;
  setMaxTime: (time: number) => void;

  currentKeyFrame: number;
  getCurrentTimeInMs: () => number;
  setCurrentTimeInMs: (time: number) => void;
  rewindCurrentTimeInMs: (time: number, forward: boolean) => void;
}
