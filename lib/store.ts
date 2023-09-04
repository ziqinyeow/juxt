import { fabric } from "fabric";
import { create } from "zustand";
import { StoreTypes } from "./types/store";

export const useStore = create<StoreTypes>()((set, get) => ({
  canvas: null,
  setCanvas: (canvas: fabric.Canvas | null) =>
    set((state) => ({ ...state, canvas })),

  //   medias
  videos: [],
  images: [],

  // media player properties
  playing: false,
  setPlaying: (playing: boolean) => {
    set((state) => ({ ...state, playing }));
  },

  fps: 60,
  maxTime: 30 * 1000,
  setMaxTime: (time: number) => set((state) => ({ ...state, maxTime: time })),

  currentKeyFrame: 0,
  getCurrentTimeInMs: () => (get().currentKeyFrame * 1000) / get().fps,
  setCurrentTimeInMs: (time: number) =>
    set((state) => ({
      ...state,
      currentKeyFrame: Math.floor((time / 1000) * get().fps) + time,
    })),
  rewindCurrentTimeInMs: (time: number, forward: boolean) => {
    const currentKeyFrame = get().currentKeyFrame;
    const fps = get().fps;
    const maxTime = get().maxTime;
    const offset = forward
      ? Math.floor((time / 1000) * fps)
      : -Math.floor((time / 1000) * fps);
    const newTime =
      currentKeyFrame + offset < 0
        ? 0
        : currentKeyFrame + offset >= (maxTime * fps) / 1000
        ? (maxTime * fps) / 1000
        : currentKeyFrame + offset;

    set((state) => ({
      ...state,
      currentKeyFrame: newTime,
    }));
  },
}));
