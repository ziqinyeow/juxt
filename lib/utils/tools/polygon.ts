import { fabric } from "fabric";
import { IEvent } from "fabric/fabric-impl";

const STROKE_COLOR = "#2BEBC8";
const STROKE_WIDTH = 3;

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
