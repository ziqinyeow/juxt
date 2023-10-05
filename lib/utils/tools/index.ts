//// @ts-nocheck
import { fabric } from "fabric";
import { IEvent } from "fabric/fabric-impl";

const STROKE_COLOR = "#2BEBC8";
const STROKE_WIDTH = 3;

export const setToDrawingCanvas = (
  canvas: fabric.Canvas,
  cursor = "crosshair"
) => {
  canvas!.selection = false;
  canvas!.defaultCursor = cursor;
  canvas!.hoverCursor = cursor;
  canvas?.discardActiveObject();
  canvas?.forEachObject(function (obj) {
    obj.selectable = false;
  });
};

export const setToDefaultCanvas = (canvas: fabric.Canvas) => {
  canvas!.selection = true;
  canvas!.defaultCursor = "default";
  canvas!.hoverCursor = "all-scroll";
  canvas?.forEachObject(function (obj) {
    obj.selectable = true;
  });
  canvas.off("mouse:down");
  canvas.off("mouse:move");
  canvas.off("mouse:up");
  canvas.off("mouse:dblclick");
  canvas?.requestRenderAll();
};

export { drawRect } from "./rect";
export { drawTriangle } from "./triangle";
export { drawPolygon } from "./polygon";
export { drawText } from "./text";
export { buildHumanSkeleton } from "./pose";
