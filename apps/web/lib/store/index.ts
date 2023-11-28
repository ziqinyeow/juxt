import { fabric } from "fabric";
import { FabricUtils, CoverVideo, CoverImage } from "@/lib/utils/fabric";
import { create } from "zustand";
import { StoreTypes } from "../types/store";
import { Element, Placement, Shape, ShapeType } from "../types/track";
import {
  PANEL_SLIDER_MAX_VALUE,
  PANEL_SLIDER_MIN_VALUE,
} from "@/lib/constants/panel";
import { BucketType, FileWithPath } from "../types/file";
import { isHtmlImageElement, isHtmlVideoElement } from "../utils/html";
import { nanoid } from "nanoid";
// import { IEvent } from "fabric/fabric-impl";
import { Project } from "../types/project";
import { createJSONStorage, persist } from "zustand/middleware";
import { getFile, idbStorage, storeFile } from "./storage";
import { STROKE_COLOR, STROKE_WIDTH } from "../constants/colors";
import { merge } from "../utils/file";
import { checkFileType } from "@/components/Dropzone/utils";
import { FabricCanvas, Handler } from "@/canvas";
import {
  addPoints,
  getHeightAndWidthFromDataUrl,
  getPoints,
} from "../utils/pose";

export const useStore = create<StoreTypes>()(
  // @ts-ignore
  persist<StoreTypes>(
    (set, get) => ({
      lastWebsocketMessage: null,
      setLastWebsocketMessage: (lastWebsocketMessage) => {
        set((state) => ({ ...state, lastWebsocketMessage }));
      },
      sendWebsocketMessage: () => {},
      setSendWebsocketMessage: (sendWebsocketMessage) => {
        set((state) => ({ ...state, sendWebsocketMessage }));
      },
      test: {},
      setTest: (test: any) => set((state) => ({ ...state, test })),
      fileURLCache: {},
      setFileURLCache: (cache) => {
        set((state) => ({ ...state, fileURLCache: { cache } }));
      },
      addFileURLCache: (cache) => {
        // console.log({ file: { ...{ test: "test" }, ...cache } });
        set((state) => ({
          ...state,
          fileURLCache: { ...state.fileURLCache, ...cache },
        }));
      },
      refreshFileURLCache: (projectId) => {
        const bucket = get().projects.find(
          (project) => project.id === projectId
        )?.bucket;
        if (!bucket) return;
        const fileURLCache = get().fileURLCache;
        Object.entries(bucket).map(([key, value]) => {
          return value.map(async (f) => {
            if (!(f.id in fileURLCache)) {
              const file = await getFile(f?.id);
              if (file) {
                const url = URL.createObjectURL(file);
                get().addFileURLCache({ [f.id]: { url, file } });
              }
            }
          });
        });
      },
      refreshAllFileURLCache: () => {
        const fileURLCache = get().fileURLCache;
        get().projects.forEach((project) => {
          Object.entries(project.bucket).forEach(([key, value]) => {
            value.forEach(async (f) => {
              if (!(f.id in fileURLCache)) {
                const file = await getFile(f?.id);
                if (file) {
                  // console.log(file);
                  const url = URL.createObjectURL(file);
                  get().addFileURLCache({ [f.id]: { url, file } });
                }
              }
            });
          });
        });
        // console.log("cache", get().fileURLCache);
      },

      projects: [],
      currentProjectId: "",
      setCurrentProjectId: (projectId) => {
        set((state) => ({ ...state, currentProjectId: projectId }));
      },
      addProject: (project: Project) => {
        set((state) => ({ ...state, projects: [...state.projects, project] }));
      },
      editProject: (id, project) => {
        set((state) => ({
          ...state,
          projects: state.projects.map((p) => {
            return p.id === id ? { ...p, ...project } : p;
          }),
        }));
      },
      deleteProject: (id: string) => {
        set((state) => ({
          ...state,
          projects: state.projects.filter((p) => p.id !== id),
        }));
      },
      mergeBucket: (projectId: string, bucket: BucketType) => {
        let curr = {
          ...get().projects.find((project) => project.id === projectId)?.bucket,
        }; // copy to avoid side effects
        Object.keys(bucket).forEach((k) => {
          if (k in curr) {
            curr[k] = merge(
              curr[k],
              bucket[k],
              (a: FileWithPath, b: FileWithPath) => a.path === b.path
            );
          } else {
            curr[k] = bucket[k];
          }
        });
        set((state) => ({
          ...state,
          projects: state.projects.map((p) => {
            return p.id === projectId ? { ...p, bucket: curr } : p;
          }),
        }));
      },
      mergeFileListToBucket: (projectId: string, fileList: FileList | null) => {
        if (!fileList) {
          return;
        }
        const curr = {
          ...get().projects.find((project) => project.id === projectId)?.bucket,
        }; // copy to avoid side effects
        set((state) => ({
          ...state,
          projects: state.projects.map((p) => {
            return p.id === projectId
              ? {
                  ...p,
                  bucket: {
                    ...curr,
                    "/": merge(
                      [...curr["/"]],
                      Array.from(fileList).map((file) => {
                        // const id = (await storeFile(file)) ?? nanoid();
                        const type = checkFileType(file);
                        const media = type === "image" || type === "video";
                        return {
                          id: nanoid(),
                          dir: false,
                          type,
                          path: `/` + file.name,
                          // file,
                          // url: media ? URL.createObjectURL(file) : "",
                        };
                      }),
                      (a: FileWithPath, b: FileWithPath) => a.path === b.path
                    ),
                  },
                }
              : p;
          }),
        }));
      },

      handler: null,
      setHandler: (handler: Handler | null) =>
        set((state) => ({ ...state, handler })),
      canvas: null,
      setCanvas: (canvas: FabricCanvas | null) =>
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
        shape.on("selected", () => {
          get().setSelectedElement([...get().selectedElement, element]);
        });
        shape.on("deselected", () => {
          get().setSelectedElement(
            get().selectedElement.filter((el) => el.id !== element.id)
          );
        });
        shape.on("modified", (e) => {
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
          get().setSelectedElement([...get().selectedElement, element]);
        });
        text.on("deselected", (e) => {
          get().setDisableKeyboardShortcut(false);
          get().setSelectedElement(
            get().selectedElement.filter((el) => el.id !== id)
          );
        });
        text.on("changed", (e) => {
          element.properties.text = text.text ?? "";
        });
        get().canvas?.on("object:modified", (e) => {
          get().updatePlacement(e, element, text);
        });
        get().addTrackAndElement(element);
      },

      // elements
      tracks: [],
      selectedElement: [],
      setSelectedElement: (element: Element[]) =>
        set((state) => ({
          ...state,
          selectedElement: element.filter((obj, i) => {
            return i === element.findIndex((o) => obj.id === o.id);
          }),
        })),
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
      removeTrackAndElement: (elementIds: string[]) => {
        set((state) => ({
          ...state,
          projects: state.projects.map((project) => {
            return project.id === state.currentProjectId
              ? {
                  ...project,
                  tracks:
                    project.tracks.filter(
                      (track) => !elementIds?.includes(track.elements[0].id)
                    ) ?? [],
                }
              : project;
          }),
        }));
        get().refreshTracks(get().canvas);
        get().updateMaxTime();
        get().updateTime(get().getCurrentTimeInMs());
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
            videoObject.on("selected", () => {
              get().setSelectedElement([...get().selectedElement, element]);
            });
            videoObject.on("deselected", () => {
              get().setSelectedElement(
                get().selectedElement.filter((el) => el.id !== element.id)
              );
            });
            get().canvas?.add(videoObject);
            // get().canvas?.centerObject(videoObject);
            // console.log(get().canvas?.getObjects());

            get().canvas?.on("object:modified", (e) => {
              get().updatePlacement(e, element, videoObject);
            });
            break;
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
            imageObject.on("selected", () => {
              get().setSelectedElement([...get().selectedElement, element]);
            });
            imageObject.on("deselected", () => {
              get().setSelectedElement(
                get().selectedElement.filter((el) => el.id !== element.id)
              );
            });
            imageObject.on("modified", (e: any) => {
              get().updatePlacement(e, element, imageObject);
            });
            get().canvas?.add(imageObject);
            // get().canvas?.centerObject(imageObject);
            break;
          }
          case "text": {
            // @ts-ignore
            const text = new fabric.IText(element.properties?.text, {
              left: element.placement.x,
              top: element.placement.y,
              width: element.placement.width,
              height: element.placement.height,
              scaleX: element.placement.scaleX,
              scaleY: element.placement.scaleY,
              angle: element.placement.rotation,
              fontSize: 50,
              fontFamily: "Andale Mono",
              fill: "white",
            });
            text.on("selected", (e) => {
              get().setDisableKeyboardShortcut(true);
              get().setSelectedElement([...get().selectedElement, element]);
            });
            text.on("deselected", (e) => {
              get().setDisableKeyboardShortcut(false);
              get().setSelectedElement(
                get().selectedElement.filter((el) => el.id !== element.id)
              );
            });
            text.on("changed", (e) => {
              // @ts-ignore
              element.properties.text = text.text ?? "";
            });
            element.fabricObject = text;
            get().canvas?.on("object:modified", (e) => {
              get().updatePlacement(e, element, text);
            });
            get().canvas?.add(text);
            break;
          }
          case "shape": {
            // @ts-ignore
            const type = element.properties!.type as ShapeType;
            // const center = get().canvas?.getCenter();
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
                shape.on("selected", (e) => {
                  get().setSelectedElement([...get().selectedElement, element]);
                });
                shape.on("deselected", (e) => {
                  get().setSelectedElement(
                    get().selectedElement.filter((el) => el.id !== element.id)
                  );
                });
                shape?.on("modified", (e) => {
                  console.log(shape.left, shape.top);
                  get().updatePlacement(e, element, shape);
                });
                // console.log(shape.left, shape.top);
                get().canvas?.add(shape);
                // get().canvas?.centerObject(shape);
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
                shape.on("selected", (e) => {
                  get().setSelectedElement([...get().selectedElement, element]);
                });
                shape.on("deselected", (e) => {
                  get().setSelectedElement(
                    get().selectedElement.filter((el) => el.id !== element.id)
                  );
                });
                shape.on("modified", (e) => {
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
                shape.on("selected", (e) => {
                  get().setSelectedElement([...get().selectedElement, element]);
                });
                shape.on("deselected", (e) => {
                  get().setSelectedElement(
                    get().selectedElement.filter((el) => el.id !== element.id)
                  );
                });
                shape.on("modified", (e) => {
                  get().updatePlacement(e, element, shape);
                });
                get().canvas?.add(shape);
                break;
              }
            }
          }

          default:
            break;
        }
        get().updateMaxTime();
        get().updateTime(get().getCurrentTimeInMs());
        get().canvas?.requestRenderAll();
      },

      refreshTracks: async () => {
        const tracks =
          get().projects.find(
            (project) => project.id === get().currentProjectId
          )?.tracks ?? [];

        // console.log("refresh");

        get().canvas?.remove(
          ...(get()
            .canvas?.getObjects()
            .filter((o: any) => o.id !== "workarea") ?? [])
        );

        for (let i = 0; i < tracks.length; i++) {
          const element = tracks[i].elements[0];
          switch (element.type) {
            case "video":
            case "image":
            case "text":
            case "shape": {
              get().addElementToCanvas(element);
            }

            default:
              break;
          }
        }
        const canvas = get().canvas;
        const center = canvas?.getCenter();
        const id = "_Rekd4H8wA6m7BkHvU9Du";
        // console.log(canvas?.getObjects());
        const image = canvas?.getObjects().find((obj) => obj.name === id);

        const imageElement = document.getElementById(
          "/football.jpeg"
        ) as HTMLImageElement;
        const size = await getHeightAndWidthFromDataUrl(imageElement?.src);
        [
          [
            [370.2985884348551, 221.90800952911377],
            [376.7936407725016, 212.1654313802719],
            [369.21607971191406, 210.0004140138626],
            [352.97844886779785, 197.0103098154068],
            [338.90583546956384, 190.5152577161789],
            [324.8332220713297, 233.81560504436493],
            [279.3678557078044, 227.32055294513702],
            [296.6879952748617, 285.77602183818817],
            [233.902489344279, 282.5284957885742],
            [298.8530127207438, 308.50870418548584],
            [207.92227999369305, 335.5714212656021],
            [280.4503644307454, 340.98396468162537],
            [224.15991083780926, 344.2314907312393],
            [330.24576568603516, 430.8321853876114],
            [239.31503295898438, 457.89490246772766],
            [302.100538889567, 532.5880016088486],
            [219.82987594604492, 545.5781058073044],
          ],
          [
            [484.2794990539551, 236.9162654876709],
            [495.3659453392029, 225.8298192024231],
            [476.2166290283203, 224.82196044921875],
            [521.5702729225159, 223.8141016960144],
            [470.16947650909424, 225.8298192024231],
            [558.8610467910767, 269.16774559020996],
            [481.25592279434204, 271.18346309661865],
            [626.3875832557678, 295.37207317352295],
            [466.13804149627686, 329.6392707824707],
            [691.8984022140503, 317.54496574401855],
            [441.94943141937256, 379.02434968948364],
            [589.096809387207, 374.99291467666626],
            [536.688154220581, 376.0007734298706],
            [535.6802954673767, 411.2758297920227],
            [479.24020528793335, 442.5194511413574],
            [546.7667417526245, 489.88881254196167],
            [495.3659453392029, 512.0617051124573],
          ],
          [
            [596.4959487915039, 159.50757217407227],
            [603.3007173538208, 149.30041933059692],
            [595.3618206977844, 148.16629123687744],
            [633.9221758842468, 150.4345474243164],
            [655.470609664917, 150.4345474243164],
            [608.9713578224182, 201.47031164169312],
            [690.628580570221, 182.1901340484619],
            [564.7403621673584, 263.84735679626465],
            [734.8595762252808, 199.20205545425415],
            [525.0458788871765, 301.27358388900757],
            [788.1635966300964, 212.81159257888794],
            [658.8729939460754, 334.16329860687256],
            [695.1650929450989, 330.7609143257141],
            [690.628580570221, 432.83244276046753],
            [624.849151134491, 402.2109842300415],
            [754.139753818512, 485.0023350715637],
            [611.2396140098572, 507.68489694595337],
          ],
        ].map((a) =>
          a.map(async ([_x, _y]) => {
            const { x, y } = getPoints({
              x: _x,
              y: _y,
              original_image_width: size.width!,
              original_image_height: size.height!,
              scaled_image_width: image?.width,
              scaled_image_height: image?.height,
            });
            addPoints({
              x: Math.round(image?.left! + x),
              y: Math.round(image?.top! + y),
              canvas: get().canvas!,
            });
          })
        );

        // const imageElement = document.getElementById("/football.jpeg");
        // console.log(imageElement?.);

        // const obj = new fabric.Rect({
        //   left: (image?.left ?? 0) + x,
        //   top: (image?.top ?? 0) + y,
        //   width: 5,
        //   height: 5,
        //   rx: 16,
        //   ry: 16,
        //   fill: "#2BEBC8",
        // });
        // get().canvas?.add(obj);
      },

      updatePlacement: (e: any, element: Element, object: any) => {
        if (!e.target) return;
        const target = e.target;
        if (target != object) return;
        // const center = get().canvas?.getCenter();
        const placement = element.placement;
        const newPlacement: Placement = {
          ...placement,
          x: target.left ?? placement.x, //- (center?.left ?? 0), //- (center?.left ?? 0),
          y: target.top ?? placement.y, //- (center?.top ?? 0),
          rotation: target.angle ?? placement.rotation,
          width:
            target.width && target.scaleX
              ? target.width * target.scaleX
              : placement.width,
          height:
            target.height && target.scaleY
              ? target.height * target.scaleY
              : placement.height,
          scaleX: element.type === "text" ? target.scaleX ?? 1 : 1,
          scaleY: element.type === "text" ? target.scaleX ?? 1 : 1,
        };
        get().updateElement(element.id, {
          placement: newPlacement,
        });
      },

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

        get().setMaxTime(Math.max(0, newMaxTime));
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
        get().updateVideoElement();
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
        // console.log("updating");
        const tracks = get().projects.find(
          (project) => project.id === get().currentProjectId
        )?.tracks;

        tracks?.forEach((track) => {
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
              !["fileURLCache"].includes(key) &&
              !["currentProjectId"].includes(key) &&
              !["selectedElement"].includes(key) &&
              !["handler"].includes(key) &&
              !["canvas"].includes(key) &&
              !["disableKeyboardShortcut"].includes(key) &&
              !["playing"].includes(key) &&
              !["maxTime"].includes(key) &&
              !["currentKeyFrame"].includes(key) &&
              !["startedTime"].includes(key) &&
              !["startedTimePlay"].includes(key)
          )
        ),
    }
  )
);
