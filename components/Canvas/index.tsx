"use client";

import "./style.css";
import { useStore } from "@/lib/store";
import { fabric } from "fabric";
import React, { useEffect, useLayoutEffect } from "react";
import Zoomable from "./zoomable";
import { RESOLUTION } from "@/lib/constants/canvas";
import {
  movingRotatingWithinCanvasBound,
  scaleWithinCanvasBound,
} from "@/lib/utils/canvas";

const Canvas = () => {
  const { canvas, setCanvas, setSelectedElement } = useStore();

  const initCanvas = () => {
    const canvas = new fabric.Canvas("canvas", {
      // width: 550,
      // height: 300,
      backgroundColor: "#000",
      renderOnAddRemove: false,
      // imageSmoothingEnabled: false,
      // enableRetinaScaling: false,
      // fireRightClick: true,
      // stopContextMenu: true,
    });

    fabric.Object.prototype.hasRotatingPoint = false;
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = "#2BEBC8";
    fabric.Object.prototype.cornerStyle = "rect";
    fabric.Object.prototype.cornerStrokeColor = "#2BEBC8";
    fabric.Object.prototype.cornerSize = 6;
    // canvas mouse down without target should deselect active object
    canvas.on("mouse:down", function (e) {
      if (!e.target) {
        setSelectedElement(null);
      }
    });

    canvas.on("object:moving", function (e) {
      movingRotatingWithinCanvasBound(e);
    });

    canvas.on("object:scaling", function (e) {
      scaleWithinCanvasBound(e);
    });

    return canvas;
  };

  useEffect(() => {
    const _canvas = initCanvas();
    setCanvas(_canvas);
    return () => {
      _canvas.dispose(); // without this: will need to disable reactStrictMode
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const parent = document.getElementById("canvas")?.parentElement;

    if (!parent) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const fabricWidth = canvas?.getWidth() ?? 1920;
      const fabricHeight = canvas?.getHeight() ?? 1080;
      // const cssWidth = Math.min(parent.clientWidth, fabricWidth);
      const cssWidth = parent.clientWidth;
      // const cssHeight = parent.clientHeight
      const ratio = fabricWidth / parent.clientWidth;
      fabric.Object.prototype.set({
        cornerSize: ratio * 10,
        borderScaleFactor: ratio,
      });
      fabric.Object.prototype.controls.mtr.offsetY = -25 * ratio;
      const dimension = {
        width: cssWidth + "px",
        height: cssWidth / (fabricWidth / fabricHeight) + "px",
      };
      canvas?.setDimensions(dimension, { cssOnly: true }).requestRenderAll();
    });

    observer.observe(parent);
    return () => {
      observer.disconnect();
    };
  }, [canvas]);

  return (
    <>
      {/* <Zoomable>
      </Zoomable> */}
      <div className="h-[calc(100vh_-_64px_-_310px)] w-[calc(100vw_-_300px)] bg-primary-800 flex items-center justify-center">
        <div className="flex items-center justify-center w-[95%] h-[95%] border rounded-md border-primary-400 overflow-hidden">
          <canvas
            id="canvas"
            width={RESOLUTION.width}
            height={RESOLUTION.height}
          />
        </div>
      </div>
    </>
  );
};

export default Canvas;
