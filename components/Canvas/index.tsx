"use client";

import "./style.css";
import { useStore } from "@/lib/store";
import { fabric } from "fabric";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Zoomable from "./zoomable";
import { RESOLUTION } from "@/lib/constants/canvas";
import {
  movingRotatingWithinCanvasBound,
  scaleWithinCanvasBound,
} from "@/lib/utils/canvas";
import Tools from "./tools";
import { tools } from "./tools/tools";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const Canvas = ({ projectId }: { projectId: string }) => {
  const { theme } = useTheme();
  const { canvas, setCanvas, setSelectedElement, refreshTracks, hidePanel } =
    useStore();
  // const { bucket } = useFile();

  const initCanvas = () => {
    const canvas = new fabric.Canvas(`canvas-${projectId}`, {
      // width: 550,
      // height: 300,
      backgroundColor: theme === "dark" ? "#000" : "#fff",
      // renderOnAddRemove: false,
      // imageSmoothingEnabled: false,
      // enableRetinaScaling: false,
      // fireRightClick: true,
      stopContextMenu: true,
    });

    fabric.Object.prototype.hasRotatingPoint = false;
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor =
      theme === "dark" ? "#2BEBC8" : "#5D46F3";
    fabric.Object.prototype.cornerStyle = "rect";
    fabric.Object.prototype.cornerStrokeColor =
      theme === "dark" ? "#2BEBC8" : "#5D46F3";
    fabric.Object.prototype.cornerSize = 6;
    // canvas mouse down without target should deselect active object
    canvas?.on("mouse:down", function (e) {
      if (!e.target) {
        setSelectedElement(null);
      }
    });

    canvas?.on("object:moving", function (e) {
      movingRotatingWithinCanvasBound(e);
    });

    canvas?.on("object:scaling", function (e) {
      scaleWithinCanvasBound(e);
    });

    return canvas;
  };

  useEffect(() => {
    const _canvas = initCanvas();
    setCanvas(_canvas);
    refreshTracks(_canvas);
    return () => {
      _canvas?.dispose(); // without this: will need to disable reactStrictMode
      setCanvas(null);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  useLayoutEffect(() => {
    const parent = document.getElementById(
      `canvas-${projectId}`
    )?.parentElement;

    if (!parent) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const fabricWidth = canvas?.getWidth() ?? RESOLUTION.width;
      const fabricHeight = canvas?.getHeight() ?? RESOLUTION.height;
      // const cssWidth = Math.min(parent.clientWidth, fabricWidth);
      const cssWidth = parent.clientWidth;
      // const cssHeight = parent.clientHeight;
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
  }, [canvas, projectId]);

  return (
    <>
      <div
        className={cn([
          "w-[calc(100vw_-_300px)] bg-light-200 dark:bg-primary-600 flex items-center justify-center",
          hidePanel
            ? "h-[calc(100vh_-_64px_-_90px)]"
            : "h-[calc(100vh_-_64px_-_310px)]",
        ])}
      >
        <div className="absolute flex items-center justify-center h-full gap-2 left-1">
          <div className="z-[200] flex gap-2 flex-col">
            <Tools tools={tools} />
          </div>
        </div>
        <div className="flex items-center z-[100] justify-center w-[98%] h-[95%] border rounded-md border-light-400 dark:border-primary-400 overflow-hidden">
          <canvas
            id={`canvas-${projectId}`}
            width={RESOLUTION.width}
            height={RESOLUTION.height}
          />
        </div>
      </div>
      {/* <Zoomable></Zoomable> */}
    </>
  );
};

export default Canvas;
