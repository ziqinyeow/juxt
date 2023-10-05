import { fabric } from "fabric";
import { IEvent } from "fabric/fabric-impl";

export const drawText = (
  canvas: fabric.Canvas,
  mouseUp: (shape: fabric.IText) => void
) => {
  let text: any = null;
  const onMouseDown = (o: IEvent) => {
    const pointer = canvas.getPointer(o.e);
    text = new fabric.IText("text", {
      left: pointer.x,
      top: pointer.y,
      fontSize: 50,
      fontFamily: "Andale Mono",
      fill: "white",
    });
    canvas?.add(text);
  };
  const onMouseUp = (o: IEvent) => {
    mouseUp(text);
  };
  canvas.on("mouse:down", onMouseDown);
  canvas.on("mouse:up", onMouseUp);
};
