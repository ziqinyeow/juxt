import { fabric } from "fabric";
import { FabricUtils, CoverVideo, CoverImage } from "@/lib/utils/fabric";
import { create } from "zustand";
import { StoreTypes } from "../types/store";
import { Element, Placement, Shape, ShapeType } from "../types/track";
import { tracks } from "../samples/tracks";
import {
  PANEL_SLIDER_MAX_VALUE,
  PANEL_SLIDER_MIN_VALUE,
} from "@/lib/constants/panel";
import { FileWithPath } from "../types/file";
import { isHtmlImageElement, isHtmlVideoElement } from "../utils/html";
import { nanoid } from "nanoid";
import { IEvent } from "fabric/fabric-impl";
import { Project } from "../types/project";
import { createJSONStorage, persist } from "zustand/middleware";
import { idbStorage } from "./storage";
import { STROKE_COLOR, STROKE_WIDTH } from "../constants/colors";

export const useStore = create<StoreTypes>()(
  persist<StoreTypes>(
    (set, get) => ({
      projects: [],
      currentProjectId: "",
      setCurrentProjectId: (projectId) => {
        set((state) => ({ ...state, currentProjectId: projectId }));
      },
      addProject: (project: Project) => {
        set((state) => ({ ...state, projects: [...state.projects, project] }));
      },

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
        const center = get().canvas?.getCenter();

        const element: Element = {
          id,
          name: media.path,
          type: "video",
          placement: {
            x: (center?.left ?? 0) - 500,
            y: (center?.top ?? 0) - 300,
            width: 1000,
            height: 600,
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
        // get().refreshTracks();
        get().addElementToCanvas(element);
      },

      images: [],
      addImage: (media: FileWithPath) => {
        const id = nanoid();
        const center = get().canvas?.getCenter();
        const element: Element = {
          id,
          name: media.path,
          type: "image",
          placement: {
            x: (center?.left ?? 0) - 500,
            y: (center?.top ?? 0) - 300,
            width: 1000,
            height: 600,
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
        // get().refreshTracks();
        get().addElementToCanvas(element);
      },

      addShape: (
        type: ShapeType,
        shape: Shape,
        placement: Placement,
        properties = {}
      ) => {
        const id = nanoid();
        const element: Element = {
          id,
          name: type + "_" + id,
          type: "shape",
          fabricObject: shape,
          placement,
          timeframe: {
            start: 0,
            duration: 5000,
          },
          properties: {
            type,
            ...properties,
          },
        };
        get().canvas?.on("object:modified", (e) => {
          get().updatePlacement(e, element, shape);
        });
        get().addTrackAndElement(element);
      },

      addText: (text: fabric.IText, properties: any, placement: Placement) => {
        const id = nanoid();
        const element: Element = {
          id,
          name: "text_" + id,
          type: "text",
          fabricObject: text,
          placement,
          timeframe: {
            start: 0,
            duration: 5000,
          },
          properties,
        };
        text.on("selected", (e) => {
          get().setDisableKeyboardShortcut(true);
        });
        text.on("deselected", (e) => {
          get().setDisableKeyboardShortcut(false);
        });
        get().canvas?.on("object:modified", (e) => {
          get().updatePlacement(e, element, text);
        });
        get().addTrackAndElement(element);
      },

      // elements
      tracks: [],
      selectedElement: null,
      addTrackAndElement: (element: Element) => {
        const id = nanoid();
        set((state) => ({
          ...state,
          projects: state.projects.map((project) => {
            return project.id === state.currentProjectId
              ? {
                  ...project,
                  tracks: [
                    ...project.tracks,
                    {
                      id,
                      name: element.name,
                      elements: [element],
                    },
                  ],
                }
              : project;
          }),
        }));
        get().updateMaxTime();
        get().updateTime(get().getCurrentTimeInMs());
        get().canvas?.requestRenderAll();
      },

      addElementToCanvas: (element: Element) => {
        switch (element.type) {
          case "video": {
            const video = document.getElementById(element.properties.elementId);
            if (!isHtmlVideoElement(video)) return;
            const {
              id,
              placement: { height, rotation, scaleX, scaleY, width, x, y },
            } = element;
            video.width = 1000;
            video.height = 600;
            const videoObject = new CoverVideo(video, {
              name: id,
              left: x,
              top: y,
              width,
              height,
              scaleX,
              scaleY,
              angle: rotation,
              // objectCaching: false,
              selectable: true,
              // lockUniScaling: true,
            });
            videoObject.setControlsVisibility({ mtr: false });
            element.fabricObject = videoObject;
            get().canvas?.add(videoObject);
            // get().canvas?.centerObject(videoObject);
            // console.log(get().canvas?.getObjects());

            get().canvas?.on("object:modified", (e) => {
              get().updatePlacement(e, element, videoObject);
            });
          }
          case "image": {
            const image = document.getElementById(element.properties.elementId);
            if (!isHtmlImageElement(image)) return;
            const {
              id,
              placement: { height, rotation, scaleX, scaleY, width, x, y },
            } = element;
            const imageObject = new CoverImage(image, {
              name: id,
              left: x,
              top: y,
              width,
              height,
              angle: rotation,
              // objectCaching: false,
              selectable: true,
              // lockUniScaling: true,
              centeredScaling: true,
            });
            imageObject.setControlsVisibility({ mtr: false });
            element.fabricObject = imageObject;
            get().canvas?.add(imageObject);
            // get().canvas?.centerObject(imageObject);
            get().canvas?.on("object:modified", (e) => {
              get().updatePlacement(e, element, imageObject);
            });
          }
          case "shape": {
            // @ts-ignore
            const type = element.properties!.type as ShapeType;
            switch (type) {
              case "square": {
                const shape = new fabric.Rect({
                  left: element.placement.x,
                  top: element.placement.y,
                  width: element.placement.width,
                  height: element.placement.height,
                  scaleX: element.placement.scaleX,
                  scaleY: element.placement.scaleY,
                  angle: element.placement.rotation,
                  fill: "transparent",
                  stroke: STROKE_COLOR,
                  strokeWidth: STROKE_WIDTH,
                });
                element.fabricObject = shape;
                get().canvas?.on("object:modified", (e) => {
                  get().updatePlacement(e, element, shape);
                });
                get().canvas?.add(shape);
                break;
              }
              case "triangle": {
                const shape = new fabric.Triangle({
                  left: element.placement.x,
                  top: element.placement.y,
                  width: element.placement.width,
                  height: element.placement.height,
                  scaleX: element.placement.scaleX,
                  scaleY: element.placement.scaleY,
                  angle: element.placement.rotation,
                  fill: "transparent",
                  stroke: STROKE_COLOR,
                  strokeWidth: STROKE_WIDTH,
                });
                element.fabricObject = shape;
                get().canvas?.on("object:modified", (e) => {
                  get().updatePlacement(e, element, shape);
                });
                get().canvas?.add(shape);
                break;
              }
              case "polygon": {
                // @ts-ignore
                const shape = new fabric.Polyline(element.properties?.coords, {
                  left: element.placement.x,
                  top: element.placement.y,
                  width: element.placement.width,
                  height: element.placement.height,
                  scaleX: element.placement.scaleX,
                  scaleY: element.placement.scaleY,
                  angle: element.placement.rotation,
                  stroke: STROKE_COLOR,
                  strokeWidth: STROKE_WIDTH,
                  fill: "rgba(0,0,0,0)",
                });
                element.fabricObject = shape;
                get().canvas?.on("object:modified", (e) => {
                  get().updatePlacement(e, element, shape);
                });
                get().canvas?.add(shape);
                break;
              }
            }
            break;
          }

          default:
            break;
        }
        get().updateMaxTime();
        get().updateTime(get().getCurrentTimeInMs());
        get().canvas?.requestRenderAll();
      },

      refreshTracks: (canvas) => {
        const tracks =
          get().projects.find(
            (project) => project.id === get().currentProjectId
          )?.tracks ?? [];
        if (!canvas) return;
        // get().canvas?.remove(...(get().canvas?.getObjects() ?? []));

        for (let i = 0; i < tracks.length; i++) {
          const element = tracks[i].elements[0];
          switch (element.type) {
            case "video":
            case "image":
            case "shape": {
              const obj = element.fabricObject as fabric.Object;
              get().canvas?.remove(obj);
              get().addElementToCanvas(element);
            }

            default:
              break;
          }
        }
      },

      updatePlacement: (e: IEvent, element: Element, object: any) => {
        // const props = get().tracks.find((t) => {
        //   const ret = t.elements.find((_t) => _t.id === element.id);
        //   return ret;
        // })?.elements?.[0];

        if (!e.target) return;
        const target = e.target;
        if (target != object) return;
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
          placement: newPlacement,
        });
      },
      setSelectedElement: (element: Element | null) =>
        set((state) => ({ ...state, selectedElement: element })),

      updateElement: (elementId: string, data: Element | any) =>
        set((state) => ({
          ...state,
          projects: state.projects.map((project) => {
            return project.id === state.currentProjectId
              ? {
                  ...project,
                  tracks: project.tracks.map((t) => ({
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
                }
              : project;
          }),
        })),

      // panel properties
      hidePanel: false,
      setHidePanel: (hidePanel: boolean) =>
        set((state) => ({ ...state, hidePanel })),
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
      disableKeyboardShortcut: false,
      setDisableKeyboardShortcut: (disable: boolean) => {
        set((state) => ({ ...state, disableKeyboardShortcut: disable }));
      },

      fps: 25,
      maxTime: 0,
      setMaxTime: (time: number) =>
        set((state) => ({ ...state, maxTime: time })),
      updateMaxTime: () => {
        const currentProjectId = get().currentProjectId;
        const tracks =
          get().projects.find((project) => project.id === currentProjectId)
            ?.tracks ?? [];

        const newMaxTime = Math.max(
          ...tracks?.map((t) =>
            Math.max(
              ...t.elements.map(
                (_t) => _t.timeframe.start + _t.timeframe.duration
              )
            )
          )
        );
        get().setMaxTime(newMaxTime);
      },
      currentKeyFrame: 0,
      getCurrentTimeInMs: () => (get().currentKeyFrame * 1000) / get().fps,
      setCurrentTimeInMs: (time: number) =>
        set((state) => ({
          ...state,
          currentKeyFrame: Math.floor((time / 1000) * get().fps),
          // currentKeyFrame: Math.floor((time / 1000) * get().fps) + time,
        })),
      rewindCurrentTimeInMs: (time: number, forward: boolean) => {
        const isPlaying = get().playing;
        if (isPlaying) {
          get().setPlaying(false);
        }
        // get().updateVideoElement();
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

        if (isPlaying) {
          get().setPlaying(true);
        }
      },

      startedTime: 0,
      startedTimePlay: 0,
      playing: false,
      setPlaying: (playing: boolean) => {
        set((state) => ({ ...state, playing }));
        get().updateVideoElement();
        if (get().playing) {
          set((state) => ({
            ...state,
            startedTime: performance.now(),
            startedTimePlay: get().getCurrentTimeInMs(),
          }));
          requestAnimationFrame(() => {
            get().playframes();
          });
        }
      },
      playframes: () => {
        if (!get().playing) return;
        const elapsedTime = performance.now() - get().startedTime;
        const newTime = get().startedTimePlay + elapsedTime;
        get().updateTime(newTime);

        if (newTime > get().maxTime) {
          set((state) => ({ ...state, currentKeyFrame: 0, playing: false }));
        } else {
          requestAnimationFrame(() => {
            get().playframes();
          });
        }
      },
      updateTime: (time: number) => {
        // time in milliseconds
        get().setCurrentTimeInMs(time);
        const tracks = get().projects.find(
          (project) => project.id === get().currentProjectId
        )?.tracks;
        tracks?.forEach((track) => {
          track.elements.forEach((element) => {
            if (!element.fabricObject) return;
            const isInside =
              element.timeframe.start <= time &&
              time <= element.timeframe.start + element.timeframe.duration;
            element.fabricObject.visible = isInside;
          });
        });
        get().canvas?.requestRenderAll();
      },
      handleSeek: (seek: number) => {
        if (get().playing) {
          get().setPlaying(false);
        }
        get().updateTime(seek);
        get().updateVideoElement();
      },
      updateVideoElement: () => {
        const isPlaying = get().playing;
        // const elapsedTime = Date.now() - get().startedTime;
        // const newTime = get().startedTimePlay + elapsedTime;
        get().tracks.forEach((track) => {
          track.elements.forEach((element) => {
            if (element.type === "video") {
              const video = document.getElementById(
                element.properties.elementId
              );
              if (isHtmlVideoElement(video)) {
                const currentTime =
                  (get().getCurrentTimeInMs() - element.timeframe.start) / 1000;
                video.currentTime = currentTime;
                if (isPlaying) {
                  video.play();
                } else {
                  video.pause();
                }
              }
            }
          });
        });
      },
    }),
    {
      name: "store",
      storage: createJSONStorage(() => idbStorage),
      // @ts-ignore
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) =>
              !["currentProjectId"].includes(key) &&
              !["canvas"].includes(key) &&
              !["maxTime"].includes(key) &&
              !["currentKeyFrame"].includes(key) &&
              !["startedTime"].includes(key) &&
              !["startedTimePlay"].includes(key)
          )
        ),
    }
  )
);
