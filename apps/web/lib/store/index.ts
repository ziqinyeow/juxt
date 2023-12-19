import { fabric } from "fabric";
import { FabricUtils, CoverVideo, CoverImage } from "@/lib/utils/fabric";
import { create } from "zustand";
import { StoreTypes } from "../types/store";
import { Element, Placement, Pose, Shape, ShapeType } from "../types/track";
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
import _ from "lodash";

export const useStore = create<StoreTypes>()(
  // @ts-ignore
  persist<StoreTypes>(
    (set, get) => ({
      websocketConnected: 0,
      setWebsocketConnected: (websocketConnected) => {
        set((state) => ({ ...state, websocketConnected }));
      },
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
        get().projects.forEach((project) => {
          Object.entries(project.bucket).forEach(([key, value]) => {
            value.forEach(async (f) => {
              if (!(f.id in get().fileURLCache)) {
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
      addVideo: async (media: FileWithPath) => {
        const video = document.getElementById(media.path);
        if (!isHtmlVideoElement(video)) {
          return;
        }
        const id = nanoid();
        const center = get().canvas?.getCenter();
        const videoElement = document.getElementById(
          media.path
        ) as HTMLVideoElement;
        // const quality = videoElement.getVideoPlaybackQuality();
        // const totalVideoFrames = quality.totalVideoFrames;
        console.log(video.duration);

        const size = {
          width: videoElement.videoWidth,
          height: videoElement.videoHeight,
        };
        const workarea = get()
          .canvas?.getObjects()
          .find((obj) => obj.name === "workarea");

        const element: Element = {
          id,
          name: id,
          type: "video",
          placement: {
            x: workarea?.left! + workarea?.width! / 2 - size.width! / 2,
            y: workarea?.top! + workarea?.height! / 2 - size.height! / 2,
            width: size.width,
            height: size.height,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
          },
          timeframe: {
            start: 0,
            duration: video.duration * 1000 ?? 0,
          },
          properties: {
            mediaId: media.id,
            elementId: media.path,
            src: media.url ?? "",
            originalHeight: size.height,
            originalWidth: size.width,
            pose: [],
            duration: video.duration,
          },
        };
        get().addTrackAndElement(element);
        // get().refreshTracks();
        get().addElementToCanvas(element);
      },

      images: [],
      addImage: async (media: FileWithPath) => {
        const id = nanoid();
        const canvas = get().canvas;
        const imageElement = document.getElementById(
          media.path
        ) as HTMLImageElement;
        const size = await getHeightAndWidthFromDataUrl(imageElement?.src);

        const workarea = canvas
          ?.getObjects()
          .find((obj) => obj.name === "workarea");

        const element: Element = {
          id,
          name: id,
          type: "image",
          placement: {
            x: workarea?.left! + workarea?.width! / 2 - size.width! / 2,
            y: workarea?.top! + workarea?.height! / 2 - size.height! / 2,
            width: size.width!,
            height: size.height!,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
          },
          timeframe: {
            start: 0,
            duration: 5000,
          },
          properties: {
            mediaId: media.id,
            elementId: media.path,
            src: media.url ?? "",
            originalHeight: size.height,
            originalWidth: size.width,
            pose: [],
          },
        };
        get().addTrackAndElement(element);
        // get().refreshTracks();
        get().addElementToCanvas(element);
      },

      addPose: (elementId: string, pose: Pose) => {
        // @ts-ignore
        set((state) => ({
          ...state,
          projects: state.projects.map((project) => {
            return project.id === state.currentProjectId
              ? {
                  ...project,
                  tracks: project.tracks.map((track) => {
                    const element = track.elements.find(
                      (e) => e.id === elementId
                    );

                    if (!element) {
                      return track;
                    } else {
                      if (element.type === "image") {
                        const imageObject = get()
                          .canvas?.getObjects()
                          .find((obj) => obj.name === elementId);
                        // @ts-ignore
                        get().canvas?.remove(imageObject);

                        const points = pose.kpts.map((a) =>
                          a.map(([_x, _y]: number[]) => {
                            const { x, y } = getPoints({
                              x: _x,
                              y: _y,
                              original_image_width:
                                // @ts-ignore
                                element.properties.originalWidth!,
                              original_image_height:
                                // @ts-ignore
                                element.properties.originalHeight!,
                              scaled_image_width: imageObject?.width!,
                              scaled_image_height: imageObject?.height!,
                            });
                            const point = new fabric.Rect({
                              // radius: 1,
                              fill: "#2BEBC8",
                              width: 5,
                              height: 5,
                              rx: 16,
                              ry: 16,
                              originX: "center",
                              originY: "center",
                              hasControls: false,
                              left: Math.round(imageObject?.left! + x),
                              top: Math.round(imageObject?.top! + y),
                              // @ts-ignore
                              position: {
                                left:
                                  Math.round(imageObject?.left! + x) -
                                  imageObject?.left!,
                                top:
                                  Math.round(imageObject?.top! + y) -
                                  imageObject?.top!,
                              },
                            });
                            point.on("moving", function (options) {
                              var pos = get().canvas?.getPointer(options.e);

                              // @ts-ignore
                              point.position.left =
                                pos?.x! - imageObject?.left!;
                              // @ts-ignore
                              point.position.top = pos?.y! - imageObject?.top!;

                              point.set({
                                left: pos?.x,
                                top: pos?.y,
                              });
                            });
                            return point;
                          })
                        );
                        // @ts-ignore
                        get().canvas?.add(imageObject);
                        points.map((point) => {
                          point.map((p: fabric.Circle) => {
                            // p.on("moving", (e) => {})
                            get().canvas?.add(p);
                          });
                        });
                        imageObject?.on(
                          "moving",
                          function (event: fabric.IEvent<MouseEvent>) {
                            // event.target?.left!
                            points.map((point) => {
                              point.map((p: any) => {
                                p.set({
                                  left:
                                    imageObject?.left! +
                                    p.position.left * imageObject?.scaleX!,
                                  top:
                                    imageObject?.top! +
                                    p.position.top * imageObject?.scaleY!,
                                });
                              });
                            });
                          }
                        );
                        imageObject?.on("scaling", function () {
                          points.map((point) => {
                            point.map((p: any) => {
                              p.set({
                                left:
                                  imageObject?.left! +
                                  p.position.left * imageObject?.scaleX!,
                                top:
                                  imageObject?.top! +
                                  p.position.top * imageObject?.scaleY!,
                              });
                            });
                          });
                        });
                        element.fabricObject = imageObject;
                      }

                      return {
                        ...track,
                        elements: track.elements.map((e) =>
                          e.id === elementId
                            ? {
                                ...e,
                                properties: {
                                  ...e.properties,
                                  // @ts-ignore
                                  pose: [...e.properties?.pose, pose],
                                },
                              }
                            : e
                        ),
                      };
                    }
                  }),
                }
              : project;
          }),
        }));
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
          name: id,
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
          name: id,
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
            video.width = element.properties.originalWidth ?? 1920;
            video.height = element.properties.originalHeight ?? 1080;
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
              lockUniScaling: true,
              centeredScaling: true,
            });
            videoObject.setControlsVisibility({
              mtr: false,
              mr: false,
              ml: false,
              mb: false,
              mt: false,
            });

            if (element?.properties?.pose?.length > 0) {
              const points = element.properties.pose?.map((p) =>
                p.kpts.map((a) =>
                  a.map(([_x, _y]: number[]) => {
                    const { x, y } = getPoints({
                      x: _x,
                      y: _y,
                      original_image_width:
                        // @ts-ignore
                        element.properties.originalWidth!,
                      original_image_height:
                        // @ts-ignore
                        element.properties.originalHeight!,
                      scaled_image_width: videoObject?.width!,
                      scaled_image_height: videoObject?.height!,
                    });
                    const point = new fabric.Rect({
                      // radius: 1,
                      fill: "#2BEBC8",
                      width: 5,
                      height: 5,
                      rx: 16,
                      ry: 16,
                      originX: "center",
                      originY: "center",
                      hasControls: false,
                      left: Math.round(videoObject?.left! + x),
                      top: Math.round(videoObject?.top! + y),
                      // @ts-ignore
                      position: {
                        left:
                          Math.round(videoObject?.left! + x) -
                          videoObject?.left!,
                        top:
                          Math.round(videoObject?.top! + y) - videoObject?.top!,
                      },
                    });
                    point.on("moving", function (options) {
                      var pos = get().canvas?.getPointer(options.e);

                      // @ts-ignore
                      point.position.left = pos?.x! - videoObject?.left!;
                      // @ts-ignore
                      point.position.top = pos?.y! - videoObject?.top!;

                      point.set({
                        left: pos?.x,
                        top: pos?.y,
                      });
                    });
                    // p.points?.push(point);
                    return point;
                  })
                )
              );
              element.poseObject = points;
              // console.log(element);
              get().canvas?.add(videoObject);
              points?.[0].map((point) => {
                point.map((p: fabric.Circle) => {
                  // p.on("moving", (e) => {})
                  get().canvas?.add(p);
                });
              });
              videoObject.on(
                "moving",
                function (event: fabric.IEvent<MouseEvent>) {
                  // event.target?.left!
                  points?.[0].map((point) => {
                    point.map((p: any) => {
                      p.set({
                        left:
                          videoObject?.left! +
                          p.position.left * videoObject?.scaleX!,
                        top:
                          videoObject?.top! +
                          p.position.top * videoObject?.scaleY!,
                      });
                    });
                  });
                }
              );
              videoObject?.on("scaling", function () {
                points?.[0].map((point) => {
                  point.map((p: any) => {
                    p.set({
                      left:
                        videoObject?.left! +
                        p.position.left * videoObject?.scaleX!,
                      top:
                        videoObject?.top! +
                        p.position.top * videoObject?.scaleY!,
                    });
                  });
                });
                // canvas?.renderAll();
              });
              element.fabricObject = videoObject;
              // get().canvas?.add(videoObject);
            } else {
              get().canvas?.add(videoObject);

              element.fabricObject = videoObject;
              videoObject.on("selected", () => {
                get().setSelectedElement([...get().selectedElement, element]);
              });
              videoObject.on("deselected", () => {
                get().setSelectedElement(
                  get().selectedElement.filter((el) => el.id !== element.id)
                );
              });
            }

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
            // console.log(image.height, image.)
            const imageObject = new CoverImage(image, {
              name: id,
              left: x,
              top: y,
              width,
              height,
              angle: rotation,
              // objectCaching: false,
              selectable: true,
              lockUniScaling: true,
              centeredScaling: true,
            });
            imageObject.setControlsVisibility({
              mtr: false,
              mr: false,
              ml: false,
              mb: false,
              mt: false,
            });

            // const canvas = get().canvas;
            // const center = canvas?.getCenter();
            // const id = "trQVNf5uz-8N_s4VH1jMI";
            // // console.log(canvas?.getObjects());
            // const image = canvas?.getObjects().find((obj) => obj.name === id);

            // const imageElement = document.getElementById(
            //   "/football.jpeg"
            // ) as HTMLImageElement;

            // var point = new fabric.Circle({
            //   radius: 5,
            //   fill: "red",
            //   originX: "center",
            //   originY: "center",
            //   hasControls: false,
            //   left: image?.left! + (image?.width! * image?.scaleX!) / 2,
            //   top: image?.top! + (image?.height! * image?.scaleY!) / 2,
            //   position: {
            //     left:
            //       image?.left! +
            //       (image?.width! * image?.scaleX!) / 2 -
            //       image?.left!,
            //     top:
            //       image?.top! +
            //       (image?.height! * image?.scaleY!) / 2 -
            //       image?.top!,
            //   },
            // });

            // image?.on("moving", function () {
            //   point.set({
            //     left: image?.left! + point.position.left * image?.scaleX!,
            //     top: image?.top! + point.position.top * image?.scaleY!,
            //   });
            // });

            // image?.on("scaling", function () {
            //   point.set({
            //     left: image?.left! + position.left * image?.scaleX!,
            //     top: image?.top! + position.top * image?.scaleY!,
            //   });
            //   // canvas?.renderAll();
            // });

            // // Enable point to be moved independently
            // point.on("moving", function (options) {
            //   var pos = canvas?.getPointer(options.e);

            //   point.position.left = pos?.x! - image?.left!;
            //   point.position.top = pos?.y! - image?.top!;

            //   point.set({
            //     left: pos?.x,
            //     top: pos?.y,
            //   });
            // });
            // canvas?.add(point);

            if (element?.properties?.pose?.length > 0) {
              const points = element.properties.pose[0].kpts.map((a) =>
                a.map(([_x, _y]: number[]) => {
                  const { x, y } = getPoints({
                    x: _x,
                    y: _y,
                    original_image_width:
                      // @ts-ignore
                      element.properties.originalWidth!,
                    original_image_height:
                      // @ts-ignore
                      element.properties.originalHeight!,
                    scaled_image_width: imageObject?.width!,
                    scaled_image_height: imageObject?.height!,
                  });
                  const point = new fabric.Rect({
                    // radius: 1,
                    fill: "#2BEBC8",
                    width: 5,
                    height: 5,
                    rx: 16,
                    ry: 16,
                    originX: "center",
                    originY: "center",
                    hasControls: false,
                    left: Math.round(imageObject?.left! + x),
                    top: Math.round(imageObject?.top! + y),
                    // @ts-ignore
                    position: {
                      left:
                        Math.round(imageObject?.left! + x) - imageObject?.left!,
                      top:
                        Math.round(imageObject?.top! + y) - imageObject?.top!,
                    },
                  });
                  point.on("moving", function (options) {
                    var pos = get().canvas?.getPointer(options.e);

                    // @ts-ignore
                    point.position.left = pos?.x! - imageObject?.left!;
                    // @ts-ignore
                    point.position.top = pos?.y! - imageObject?.top!;

                    point.set({
                      left: pos?.x,
                      top: pos?.y,
                    });
                  });
                  return point;
                })
              );

              // console.log(points);
              get().canvas?.add(imageObject);
              points.map((point) => {
                point.map((p: fabric.Circle) => {
                  // p.on("moving", (e) => {})
                  get().canvas?.add(p);
                });
              });
              imageObject.on(
                "moving",
                function (event: fabric.IEvent<MouseEvent>) {
                  // event.target?.left!
                  points.map((point) => {
                    point.map((p: any) => {
                      p.set({
                        left:
                          imageObject?.left! +
                          p.position.left * imageObject?.scaleX!,
                        top:
                          imageObject?.top! +
                          p.position.top * imageObject?.scaleY!,
                      });
                    });
                  });
                }
              );
              imageObject?.on("scaling", function () {
                points.map((point) => {
                  point.map((p: any) => {
                    p.set({
                      left:
                        imageObject?.left! +
                        p.position.left * imageObject?.scaleX!,
                      top:
                        imageObject?.top! +
                        p.position.top * imageObject?.scaleY!,
                    });
                  });
                });
                // canvas?.renderAll();
              });
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

              // const group = new fabric.Group(
              //   [
              //     imageObject,
              //     ...points.map((point) => {
              //       const group = new fabric.Group(point);
              //       return group;
              //     }),
              //   ],
              //   {
              //     name: element.id,
              //   }
              // );
              // group.on("selected", () => {
              //   get().setSelectedElement([...get().selectedElement, element]);
              // });
              // group.on("deselected", () => {
              //   get().setSelectedElement(
              //     get().selectedElement.filter((el) => el.id !== element.id)
              //   );
              // });
              // group.on("modified", (e: any) => {
              //   get().updatePlacement(e, element, group);
              // });
              // get().canvas?.add(group);
              // element.fabricObject = group;
            } else {
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
              element.fabricObject = imageObject;
              get().canvas?.add(imageObject);
            }
            // get().canvas?.centerObject(imageObject);
            break;
          }
          case "text": {
            // @ts-ignore
            const text = new fabric.IText(element.properties?.text, {
              name: element.id,
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
                  name: element.id,
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
                  name: element.id,
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
                  name: element.id,
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

        console.log("refresh");

        get().canvas?.remove(
          ...(get()
            .canvas?.getObjects()
            .filter((o: any) => o.id !== "workarea") ?? [])
        );

        for (let i = 0; i < tracks.length; i++) {
          const element = tracks[i].elements[0];
          switch (element.type) {
            case "video":
            case "text":
            case "image":
            case "shape": {
              get().addElementToCanvas(element);
              break;
            }

            default:
              break;
          }
        }
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

      getElement: (elementId: string) => {
        return get()
          .projects.find((project) => project.id === get().currentProjectId)
          ?.tracks.find(
            (track) =>
              track.elements.findIndex((element) => element.id === elementId) >=
              0
          )
          ?.elements.find((element) => element.id === elementId);
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
      hideSidePanel: false,
      setHideSidePanel: (hideSidePanel: boolean) =>
        set((state) => ({ ...state, hideSidePanel })),

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

      fps: 100,
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
            // @ts-ignore
            if (element.properties?.pose) {
            }
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
        console.log(get().getCurrentTimeInMs(), seek);
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
