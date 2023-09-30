import { fabric } from "fabric";
import { FabricUtils, CoverVideo, CoverImage } from "@/lib/utils/fabric";
import { create } from "zustand";
import { StoreTypes } from "../types/store";
import { Element, Placement } from "../types/track";
import { tracks } from "../samples/tracks";
import {
  PANEL_SLIDER_MAX_VALUE,
  PANEL_SLIDER_MIN_VALUE,
} from "@/lib/constants/panel";
import { FileWithPath } from "../types/file";
import { isHtmlImageElement, isHtmlVideoElement } from "../utils/html";
import { nanoid } from "nanoid";

export const useStore = create<StoreTypes>()((set, get) => ({
  canvas: null,
  setCanvas: (canvas: fabric.Canvas | null) =>
    set((state) => ({ ...state, canvas })),

  // medias
  videos: [],
  addVideo: (media: FileWithPath) => {
    const video = document.getElementById(media.path);
    if (!isHtmlVideoElement(video)) {
      return;
    }
    const id = nanoid();
    const element: Element = {
      id,
      name: media.path,
      type: "video",
      placement: {
        x: 0,
        y: 0,
        width: 550,
        height: 300,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
      timeframe: {
        start: 0,
        duration: video.duration * 1000 ?? 0,
      },
      properties: {
        elementId: media.path,
        src: media.url ?? "",
      },
    };
    get().addTrackAndElement(element);
    get().addElementToCanvas(element);
  },

  images: [],
  addImage: (media: FileWithPath) => {
    const id = nanoid();
    const element: Element = {
      id,
      name: media.path,
      type: "image",
      placement: {
        x: 0,
        y: 0,
        width: 550,
        height: 300,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
      timeframe: {
        start: 0,
        duration: 5000,
      },
      properties: {
        elementId: media.path,
        src: media.url ?? "",
      },
    };
    get().addTrackAndElement(element);
    get().addElementToCanvas(element);
  },

  // elements
  tracks: [],
  selectedElement: null,
  addElement: (trackId: string, element: Element) => {
    set((state) => ({
      ...state,
      tracks: get().tracks.map((t) =>
        t.id === trackId
          ? {
              id: t.id,
              name: t.name,
              elements: [...t.elements, element],
            }
          : t
      ),
    }));
  },
  addTrackAndElement: (element: Element) => {
    const id = nanoid();
    set((state) => ({
      ...state,
      tracks: [
        ...get().tracks,
        {
          id,
          name: element.name,
          elements: [element],
        },
      ],
    }));
  },
  addElementToCanvas: (element: Element) => {
    switch (element.type) {
      case "video":
        const video = document.getElementById(element.properties.elementId);
        if (!isHtmlVideoElement(video)) return;
        const videoObject = new CoverVideo(video, {
          name: element.id,
          left: element.placement.x,
          top: element.placement.y,
          width: element.placement.width,
          height: element.placement.height,
          scaleX: element.placement.scaleX,
          scaleY: element.placement.scaleY,
          angle: element.placement.rotation,
          objectCaching: false,
          selectable: true,
          lockUniScaling: true,
        });
        element.fabricObject = videoObject;

        // console.log(get().canvas?.getWidth());

        // get().canvas?.on("object:modified", function (e) {
        //   if (!e.target) return;
        //   const target = e.target;
        //   if (target != fabricObject) return;
        //   const placement = element.placement;
        //   const newPlacement: Placement = {
        //     ...placement,
        //     x: target.left ?? placement.x,
        //     y: target.top ?? placement.y,
        //     rotation: target.angle ?? placement.rotation,
        //     width:
        //       target.width && target.scaleX
        //         ? target.width * target.scaleX
        //         : placement.width,
        //     height:
        //       target.height && target.scaleY
        //         ? target.height * target.scaleY
        //         : placement.height,
        //     scaleX: 1,
        //     scaleY: 1,
        //   };
        //   get().updateElement(element.id, {
        //     ...element,
        //     placement: newPlacement,
        //   });
        // });
        get().canvas?.add(videoObject);
        get().canvas?.requestRenderAll();

        break;
      case "image":
        const image = document.getElementById(element.properties.elementId);
        if (!isHtmlImageElement(image)) return;
        const imageObject = new CoverImage(image, {
          name: element.id,
          left: element.placement.x,
          top: element.placement.y,
          width: element.placement.width,
          height: element.placement.height,
          angle: element.placement.rotation,
          // objectCaching: false,
          selectable: true,
          lockUniScaling: true,
        });
        element.fabricObject = imageObject;
        get().canvas?.add(imageObject);
        get().canvas?.on("object:modified", function (e) {
          if (!e.target) return;
          const target = e.target;
          if (target != imageObject) return;
          const placement = element.placement;
          const newPlacement: Placement = {
            ...placement,
            x: target.left ?? placement.x,
            y: target.top ?? placement.y,
            rotation: target.angle ?? placement.rotation,
            width:
              target.width && target.scaleX
                ? target.width * target.scaleX
                : placement.width,
            height:
              target.height && target.scaleY
                ? target.height * target.scaleY
                : placement.height,
            scaleX: 1,
            scaleY: 1,
          };
          get().updateElement(element.id, {
            ...element,
            placement: newPlacement,
          });
        });

        get().canvas?.requestRenderAll();

      default:
        break;
    }
  },
  setSelectedElement: (element: Element | null) =>
    set((state) => ({ ...state, selectedElement: element })),

  updateElement: (elementId: string, data: Element | any) =>
    set((state) => ({
      ...state,
      tracks: get().tracks.map((t) => ({
        ...t,
        elements: t.elements.map((element) =>
          element.id === elementId
            ? {
                ...element,
                ...data,
              }
            : element
        ),
      })),
    })),

  // panel properties
  panelScale: 50,
  addPanelScale: (n: number) => {
    if (n < 0) {
      set((state) => ({
        ...state,
        panelScale: Math.max(PANEL_SLIDER_MIN_VALUE, state.panelScale + n),
      }));
    } else {
      set((state) => ({
        ...state,
        panelScale: Math.min(PANEL_SLIDER_MAX_VALUE, state.panelScale + n),
      }));
    }
  },
  setPanelScale: (panelScale: number) =>
    set((state) => ({ ...state, panelScale })),

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
