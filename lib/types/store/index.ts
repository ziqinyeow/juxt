import { fabric } from "fabric";
import { Element, Placement, Shape, ShapeType, Tracks } from "../track";
import { FileWithPath } from "../file";
import { IEvent } from "fabric/fabric-impl";

export interface StoreTypes {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;

  videos: string[];
  addVideo: (media: FileWithPath) => void;
  images: string[];
  addImage: (media: FileWithPath) => void;

  // elements
  tracks: Tracks[];
  selectedElement: Element | null;
  // addElement: (element: Element) => void;
  addShape: (type: ShapeType, shape: Shape, placement: Placement) => void;
  addText: (text: fabric.IText, properties: any, placement: Placement) => void;
  addTrackAndElement: (element: Element) => void;
  refreshTracks: () => void;
  updatePlacement: (e: IEvent, element: Element, object: any) => void;
  addElementToCanvas: (element: Element) => void;
  setSelectedElement: (element: Element | null) => void;
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
