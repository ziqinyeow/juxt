import { fabric } from "fabric";
import { IEvent } from "fabric/fabric-impl";

export function drawRect(canvas: fabric.Canvas) {
  let isDown = false,
    origX = 0,
    origY = 0,
    rectangle: any = null;

  function onMouseDown(o: IEvent) {
    var pointer = canvas!.getPointer(o.e);
    isDown = true;
    origX = pointer.x;
    origY = pointer.y;

    rectangle = new fabric.Rect({
      left: origX,
      top: origY,
      fill: "transparent",
      stroke: "red",
      strokeWidth: 3,
      selectable: false,
    });
    canvas.add(rectangle);
  }

  function onMouseMove(o: IEvent) {
    if (!isDown) return;
    var pointer = canvas.getPointer(o.e);
    if (origX > pointer.x) {
      rectangle.set({
        left: Math.abs(pointer.x),
      });
    }
    if (origY > pointer.y) {
      rectangle.set({
        top: Math.abs(pointer.y),
      });
    }

    rectangle.set({
      width: Math.abs(origX - pointer.x),
    });
    rectangle.set({
      height: Math.abs(origY - pointer.y),
    });
    canvas.renderAll();
  }

  function onMouseUp(o: IEvent) {
    rectangle.setCoords();
    isDown = false;
  }

  canvas?.on("mouse:down", onMouseDown);
  canvas?.on("mouse:move", onMouseMove);
  canvas?.on("mouse:up", onMouseUp);
}
