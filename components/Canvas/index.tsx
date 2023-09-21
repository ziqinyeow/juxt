"use client";

import { useStore } from "@/lib/store";
import { fabric } from "fabric";
import React, { useEffect, useState } from "react";
import { useMedia } from "react-use";

const Canvas = () => {
  const { canvas, setCanvas, setSelectedElement } = useStore();

  useEffect(() => {
    const canvas = new fabric.Canvas("canvas", {
      width: 700,
      height: 400,
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
    <div className="flex items-center justify-center w-full h-full overflow-hidden">
      <canvas
        id="canvas"
        width={0}
        height={0}
        className="border rounded-md border-primary-400"
      />
    </div>
  );
};

export default Canvas;
