// @ts-nocheck
// https://jsfiddle.net/ChrisWong/39ntoe0b/5/
import { fabric } from "fabric";

let scalingProperties = {
  left: 0,
  top: 0,
  scaleX: 0,
  scaleY: 0,
};

export function scaleWithinCanvasBound(e: fabric.IEvent<MouseEvent>) {
  let shape = e.target;
  let maxWidth = shape.canvas.width;
  let maxHeight = shape.canvas.height;

  //left border
  if (shape.left < 0) {
    shape.left = scalingProperties.left;
    shape.scaleX = scalingProperties.scaleX;
  } else {
    scalingProperties.left = shape.left;
    scalingProperties.scaleX = shape.scaleX;
  }

  //right border
  if (scalingProperties.scaleX * shape.width + shape.left >= maxWidth) {
    shape.scaleX = (maxWidth - scalingProperties.left) / shape.width;
  } else {
    scalingProperties.scaleX = shape.scaleX;
  }

  //top border
  if (shape.top < 0) {
    shape.top = scalingProperties.top;
    shape.scaleY = scalingProperties.scaleY;
  } else {
    scalingProperties.top = shape.top;
    scalingProperties.scaleY = shape.scaleY;
  }

  //bottom border
  if (scalingProperties.scaleY * shape.height + shape.top >= maxHeight) {
    shape.scaleY = (maxHeight - scalingProperties.top) / shape.height;
  } else {
    scalingProperties.scaleY = shape.scaleY;
  }
}

export function movingRotatingWithinCanvasBound(e: fabric.IEvent<MouseEvent>) {
  const obj = e.target;
  // if object is too big ignore
  if (obj.height > obj.canvas.height || obj.width > obj.canvas.width) {
    return;
  }
  obj.setCoords();
  // top-left  corner
  if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
    obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
    obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
  }
  // bot-right corner
  if (
    obj.getBoundingRect().top + obj.getBoundingRect().height >
      obj.canvas.height ||
    obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width
  ) {
    obj.top = Math.min(
      obj.top,
      obj.canvas.height -
        obj.getBoundingRect().height +
        obj.top -
        obj.getBoundingRect().top
    );
    obj.left = Math.min(
      obj.left,
      obj.canvas.width -
        obj.getBoundingRect().width +
        obj.left -
        obj.getBoundingRect().left
    );
  }
}
