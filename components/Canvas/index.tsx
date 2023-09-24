"use client";

import { useStore } from "@/lib/store";
import { fabric } from "fabric";
import React, { useEffect } from "react";
import Zoomable from "./zoomable";

const Canvas = () => {
  const { canvas, setCanvas, setSelectedElement } = useStore();

  useEffect(() => {
    const canvas = new fabric.Canvas("canvas", {
      width: 550,
      height: 300,
      backgroundColor: "#000",
    });
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = "#00a0f5";
    fabric.Object.prototype.cornerStyle = "rect";
    fabric.Object.prototype.cornerStrokeColor = "#0063d8";
    fabric.Object.prototype.cornerSize = 10;
    // canvas mouse down without target should deselect active object
    canvas.on("mouse:down", function (e) {
      if (!e.target) {
        setSelectedElement(null);
      }
    });
    setCanvas(canvas);
    fabric.util.requestAnimFrame(function render() {
      canvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });
  }, [setCanvas, setSelectedElement]);

  return (
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
  );
};

export default Canvas;
