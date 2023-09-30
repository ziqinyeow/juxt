"use client";

import { useStore } from "@/lib/store";
import { fabric } from "fabric";
import React, { useCallback, useEffect } from "react";
import Zoomable from "./zoomable";

const Canvas = () => {
  const { canvas, setCanvas, setSelectedElement } = useStore();

  const initCanvas = () => {
    const canvas = new fabric.Canvas("canvas", {
      width: 550,
      height: 300,
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

  return (
    <>
      <Zoomable>
        <div className="h-[calc(100vh_-_64px_-_310px)] w-[calc(100vw_-_300px)] flex items-center justify-center bg-primary-800">
          <canvas
            id="canvas"
            width={0}
            height={0}
            className="border rounded-md border-primary-400"
          />
        </div>
      </Zoomable>
    </>
  );
};

export default Canvas;
