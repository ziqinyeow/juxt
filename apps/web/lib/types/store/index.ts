import { fabric } from "fabric";
import { Element, Placement, Pose, Shape, ShapeType, Tracks } from "../track";
import { BucketType, FileWithPath } from "../file";
// import { IEvent } from "fabric/fabric-impl";
import { Project } from "../project";
import { FabricCanvas, Handler } from "@/canvas";
import { SendMessage } from "react-use-websocket";
// import { IEvent } from "fabric/fabric-impl";

export interface StoreTypes {
  lastWebsocketMessage: MessageEvent<any> | null;
  setLastWebsocketMessage: (
    lastWebsocketMessage: MessageEvent<any> | null
  ) => void;
  sendWebsocketMessage: SendMessage;
  setSendWebsocketMessage: (sendWebsocketMessage: SendMessage) => void;
  test: any;
  setTest: any;
  fileURLCache: Record<string, Record<string, string>>;
  setFileURLCache: (cache: Record<string, string>) => void;
  addFileURLCache: (cache: Record<string, Record<string, any>>) => void;
  refreshFileURLCache: (projectId: string) => void;
  refreshAllFileURLCache: () => void;

  projects: Project[];
  currentProjectId: string;
  setCurrentProjectId: (projectId: string) => void;
  addProject: (project: Project) => void;
  editProject: (id: string, project: {}) => void;
  deleteProject: (id: string) => void;
  mergeBucket: (projectId: string, bucket: BucketType) => void;
  mergeFileListToBucket: (projectId: string, fileList: FileList | null) => void;

  handler: Handler | null;
  setHandler: (handler: Handler | null) => void;
  canvas: FabricCanvas | null;
  setCanvas: (canvas: FabricCanvas | null) => void;

  videos: string[];
  addVideo: (media: FileWithPath) => void;
  images: string[];
  addImage: (media: FileWithPath) => void;
  addPose: (elementId: string, pose: Pose) => void;

  // elements
  tracks: Tracks[];
  selectedElement: Element[];
  setSelectedElement: (element: Element[]) => void;
  // addElement: (element: Element) => void;
  addShape: (
    type: ShapeType,
    shape: Shape,
    placement: Placement,
    properties?: {}
  ) => void;
  addText: (text: fabric.IText, properties: any, placement: Placement) => void;
  addTrackAndElement: (element: Element) => void;
  refreshTracks: (canvas?: fabric.Canvas | null) => void;
  updatePlacement: (e: any, element: Element, object: any) => void;
  addElementToCanvas: (element: Element) => void;
  removeTrackAndElement: (elementIds: string[]) => void;
  updateElement: (elementId: string, data: any) => void;

  //
  hidePanel: boolean;
  setHidePanel: (hidePanel: boolean) => void;
  panelScale: number;
  addPanelScale: (n: number) => void;
  setPanelScale: (panelScale: number) => void;

  fps: number;
  maxTime: number;
  setMaxTime: (time: number) => void;
  updateMaxTime: () => void;

  disableKeyboardShortcut: boolean;
  setDisableKeyboardShortcut: (disable: boolean) => void;
  startedTime: number;
  startedTimePlay: number;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
  playframes: () => void;
  updateTime: (time: number) => void;
  handleSeek: (seek: number) => void;
  updateVideoElement: () => void;

  currentKeyFrame: number;
  getCurrentTimeInMs: () => number;
  setCurrentTimeInMs: (time: number) => void;
  rewindCurrentTimeInMs: (time: number, forward: boolean) => void;
}
