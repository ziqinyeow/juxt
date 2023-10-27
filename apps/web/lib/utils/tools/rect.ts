import { fabric } from "fabric";
import { IEvent } from "fabric/fabric-impl";
import { setToDefaultCanvas } from ".";

const STROKE_COLOR = "#2BEBC8";
const STROKE_WIDTH = 3;

export function drawRect(
  canvas: fabric.Canvas,
  mouseUp: (shape: fabric.Rect) => void
) {
  let isDown = false,
    origX = 0,
    origY = 0,
    shape: any = null;

  function onMouseDown(o: IEvent) {
    var pointer = canvas!.getPointer(o.e);
    isDown = true;
    origX = pointer.x;
    origY = pointer.y;

    shape = new fabric.Rect({
      left: origX,
      top: origY,
      fill: "transparent",
      stroke: STROKE_COLOR,
      strokeWidth: STROKE_WIDTH,
      selectable: false,
    });
    canvas?.add(shape);
  }

  function onMouseMove(o: IEvent) {
    if (!isDown) return;
    const pointer = canvas?.getPointer(o.e);
    const { x, y } = pointer;

    if (x < 0 || y < 0) return;

    if (origX > x) {
      shape.set({
        left: Math.abs(x),
      });
    }
    if (origY > pointer.y) {
      shape.set({
        top: Math.abs(y),
      });
    }

    shape.set({
      width: Math.abs(origX - x),
    });
    shape.set({
      height: Math.abs(origY - y),
    });
    canvas?.renderAll();
  }

  function onMouseUp(o: IEvent) {
    shape.setCoords();
    isDown = false;
    setToDefaultCanvas(canvas);
    mouseUp(shape);
  }

  canvas?.on("mouse:down", onMouseDown);
  canvas?.on("mouse:move", onMouseMove);
  canvas?.on("mouse:up", onMouseUp);
}
