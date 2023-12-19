import { fabric } from "fabric";
import { FabricCanvas } from "@/canvas";

export const addPoints = ({
  x,
  y,
  canvas,
}: {
  x: number;
  y: number;
  canvas: FabricCanvas;
}) => {
  var point = new fabric.Circle({
    radius: 5,
    fill: "#2BEBC8",
    originX: "center",
    originY: "center",
    hasControls: false,
    left: x,
    top: y,
    // @ts-ignore
    position: {
      left: x,
      top: y,
    },
  });
  // const point = new fabric.Rect({
  //   left: x,
  //   top: y,
  //   width: 5,
  //   height: 5,
  //   rx: 16,
  //   ry: 16,
  //   fill: "#2BEBC8",
  //   hasControls: false,
  // });
  return point;
  // canvas.add(point);
};

export const getPoints = ({
  x,
  y,
  original_image_width,
  original_image_height,
  scaled_image_width,
  scaled_image_height,
}: {
  x: number;
  y: number;
  original_image_width?: number;
  original_image_height?: number;
  scaled_image_width?: number;
  scaled_image_height?: number;
}) => {
  // console.log({
  //   x,
  //   y,
  //   original_image_width,
  //   original_image_height,
  //   scaled_image_width,
  //   scaled_image_height,
  // });
  const sw = scaled_image_width ?? 1;
  const sh = scaled_image_height ?? 1;
  const ow = original_image_width ?? 1;
  const oh = original_image_height ?? 1;

  return {
    x: (sw * x) / ow,
    y: (sh * y) / oh,
  };
};

export const getHeightAndWidthFromDataUrl = (
  dataURL?: string | null
): Promise<{
  height: number | null;
  width: number | null;
}> =>
  new Promise((resolve) => {
    if (dataURL) {
      const img = new Image();
      img.onload = () => {
        resolve({
          height: img.height,
          width: img.width,
        });
      };
      img.src = dataURL;
    } else {
      resolve({
        height: null,
        width: null,
      });
    }
  });
