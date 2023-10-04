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
    canvas.add(shape);
  }

  function onMouseMove(o: IEvent) {
    if (!isDown) return;
    const pointer = canvas.getPointer(o.e);
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
    canvas.renderAll();
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

export function drawTriangle(
  canvas: fabric.Canvas,
  mouseUp: (shape: fabric.Triangle) => void
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

    shape = new fabric.Triangle({
      left: origX,
      top: origY,
      fill: "transparent",
      stroke: STROKE_COLOR,
      strokeWidth: STROKE_WIDTH,
      selectable: false,
    });
    canvas.add(shape);
  }

  function onMouseMove(o: IEvent) {
    if (!isDown) return;
    const pointer = canvas.getPointer(o.e);
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
    canvas.renderAll();
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

// https://jsfiddle.net/77vg88mc/34/
export function drawPolygon(
  canvas: fabric.Canvas,
  mouseUp: (shape: fabric.Polyline) => void
) {
  let roof = null;
  let roofPoints: any = [];
  let lines: any[] = [];
  let lineCounter = 0;
  let drawingObject = {
    type: "",
    background: "",
    border: "",
  };
  let x = 0,
    y = 0;

  class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
  }

  function setStartingPoint(options: any) {
    x = options.pointer.x;
    y = options.pointer.y;
  }

  function makeRoof(roofPoints: any) {
    var left = findLeftPaddingForRoof(roofPoints);
    var top = findTopPaddingForRoof(roofPoints);
    roofPoints.push(new Point(roofPoints[0]?.x, roofPoints[0]?.y));
    var roof = new fabric.Polyline(roofPoints, {
      stroke: STROKE_COLOR,
      strokeWidth: STROKE_WIDTH,
      fill: "rgba(0,0,0,0)",
    });
    roof.set({
      left: left,
      top: top,
    });

    return roof;
  }

  function findTopPaddingForRoof(roofPoints: any) {
    var result = 999999;
    for (var f = 0; f < lineCounter; f++) {
      if (roofPoints[f].y < result) {
        result = roofPoints[f].y;
      }
    }
    return Math.abs(result);
  }

  function findLeftPaddingForRoof(roofPoints: any) {
    var result = 999999;
    for (var i = 0; i < lineCounter; i++) {
      if (roofPoints[i].x < result) {
        result = roofPoints[i].x;
      }
    }
    return Math.abs(result);
  }

  if (drawingObject.type == "roof") {
    drawingObject.type = "";
    lines.forEach(function (value, index, ar) {
      canvas.remove(value);
    });
    //canvas.remove(lines[lineCounter - 1]);
    roof = makeRoof(roofPoints);
    canvas.add(roof);
    canvas.renderAll();
  } else {
    drawingObject.type = "roof"; // roof type
  }

  const onMouseDoubleClick = () => {
    drawingObject.type = "";
    lines.forEach(function (value, index, ar) {
      canvas.remove(value);
    });
    //canvas.remove(lines[lineCounter - 1]);
    roof = makeRoof(roofPoints);
    canvas.add(roof);
    mouseUp(roof);
    canvas.renderAll();

    //clear arrays
    roofPoints = [];
    lines = [];
    lineCounter = 0;
  };

  const onMouseUp = (o: IEvent) => {
    canvas.selection = true;
  };

  const onMouseDown = (o: IEvent) => {
    if (drawingObject.type == "roof") {
      canvas.selection = false;
      setStartingPoint(o); // set x,y
      roofPoints.push(new Point(x, y));
      var points = [x, y, x, y];
      const line = new fabric.Line(points, {
        stroke: STROKE_COLOR,
        strokeWidth: STROKE_WIDTH,
        selectable: false,
      });
      line.x1 = x;
      line.x2 = y;
      lines.push(line);
      canvas.add(lines[lineCounter]);
      lineCounter++;
      canvas.on("mouse:up", onMouseUp);
    }
  };

  const onMouseMove = (o: IEvent) => {
    if (
      lines[0] !== null &&
      lines[0] !== undefined &&
      drawingObject.type == "roof"
    ) {
      setStartingPoint(o);
      lines[lineCounter - 1].set({
        x2: x,
        y2: y,
      });
      canvas.renderAll();
    }
  };

  canvas.on("mouse:dblclick", onMouseDoubleClick);
  canvas.on("mouse:down", onMouseDown);
  canvas.on("mouse:move", onMouseMove);
}
