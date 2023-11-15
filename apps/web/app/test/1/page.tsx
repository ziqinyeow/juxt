"use client";

import { Canvas as _Canvas, FabricCanvas, Handler } from "@/canvas";
import { useTheme } from "next-themes";
import { fabric } from "fabric";
import React, { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/Button";
import { IconFocusCentered } from "@tabler/icons-react";
import { Minus, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import useKeyboardJs from "react-use/lib/useKeyboardJs";
import Canvas from "@/components/Canvas";

const One = () => {
  const [c] = useKeyboardJs("c");
  const [plus] = useKeyboardJs("=");
  const [minus] = useKeyboardJs("-");
  const [canvasZoomRatio, setCanvasZoomRatio] = useState(1);
  const zoomValue = parseInt((canvasZoomRatio * 100).toFixed(2), 10);
  // console.log(zoomValue);
  const { test, setTest } = useStore();
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [handler, setHandler] = useState<Handler | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (canvas) {
      if (c) {
        handler?.zoomHandler.zoomToFitPad();
      } else if (plus) {
        handler?.zoomHandler.zoomIn();
      } else if (minus) {
        handler?.zoomHandler.zoomOut();
      }
    }
  }, [c, plus, minus, canvas, handler?.zoomHandler]);
  console.log(canvas?.getCenter());

  useEffect(() => {
    if (canvas) {
      canvas.add(
        // new fabric.Rect({
        //   // @ts-ignore
        //   id: "test",
        //   width: 100,
        //   height: 100,
        //   left: 0,
        //   top: 0,
        // })
        new fabric.Rect({
          width: test?.width ?? 100,
          height: test.height ?? 100,
          left: test.left ?? 0,
          top: test.top ?? 0,
        })
      );
      canvas.on("object:modified", (e) => {
        const { target } = e;
        const center = canvas.getCenter();
        // console.log(center);
        console.log(center, e.target?.left, e.target?.top);
        setTest({
          left: e.target?.left! - center.left,
          top: e.target?.top! - center.top,
          width: target?.width! * target?.scaleX!,
          height: target?.height! * target?.scaleY!,
        });
      });
    }
  }, [canvas]);

  return (
    <>
      <div className="w-screen h-screen bg-primary-800">
        <Navbar />
        <div className="grid grid-cols-[300px_auto] w-full h-[calc(100vh_-_64px)]">
          {/* <Sidebar projectId={projectId} /> */}
          <div></div>
          <Canvas />

          <div className="w-full h-full relative">
            <div className="absolute z-20 flex items-center gap-1 p-1 text-white border rounded bg-light-200 dark:bg-primary-400 dark:border-primary-400 right-5 bottom-8">
              <Tooltip tooltip={`center (c)`}>
                <Button
                  className="p-2 bg-light-300 dark:bg-primary-400"
                  onClick={() => {
                    handler?.zoomHandler.zoomToFitPad();
                  }}
                >
                  <IconFocusCentered className="w-4 h-4 text-black dark:text-white" />
                </Button>
              </Tooltip>
              <Tooltip tooltip={`zoom out (-)`}>
                <Button
                  className="p-2 bg-light-300 dark:bg-primary-400"
                  onClick={() => {
                    handler?.zoomHandler.zoomOut();
                  }}
                >
                  <Minus className="w-4 h-4 text-black dark:text-white" />
                </Button>
              </Tooltip>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="outline-none">
                  <span tabIndex={0}>
                    <Tooltip tooltip={`scale`}>
                      <div className="flex items-center gap-2 p-2 rounded cursor-pointer select-none bg-light-300 dark:bg-primary-500">
                        <button
                          className={cn([
                            "hover:text-opacity-75",
                            "transition-all",
                            "text-secondary-100 dark:text-secondary-200",
                          ])}
                        >
                          {zoomValue} %
                        </button>
                      </div>
                    </Tooltip>
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align={"center"}
                  className="shadow-lg text-black dark:text-primary-100 bg-light-200 dark:bg-primary-500 dark:border-primary-400"
                >
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <DropdownMenuItem
                        key={i}
                        onClick={() => {
                          const delta = zoomValue - (i + 1) * 100;
                          const step = Math.abs(
                            delta / ((handler?.zoomStep ?? 1) * 100)
                          );
                          if (delta > 0) {
                            for (let i = 0; i < step; i++) {
                              handler?.zoomHandler.zoomOut();
                            }
                          } else {
                            for (let i = 0; i < step; i++) {
                              handler?.zoomHandler.zoomIn();
                            }
                          }
                        }}
                        className={cn([
                          zoomValue === (i + 1) / 1 && "text-secondary-200",
                          "flex items-center justify-center gap-2 focus:bg-light-300 focus:text-secondary-100 dark:focus:bg-primary-400 dark:focus:text-secondary-200",
                        ])}
                      >
                        <div className="flex items-center gap-2 text-xs">
                          {(i + 1) * 100} %
                        </div>
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Tooltip tooltip={`zoom in (+)`}>
                <Button
                  className="p-2 bg-light-300 dark:bg-primary-400"
                  onClick={() => {
                    // updateScale(false);
                    handler?.zoomHandler.zoomIn();
                  }}
                >
                  <Plus className="w-4 h-4 text-black dark:text-white" />
                </Button>
              </Tooltip>
            </div>
            <_Canvas
              init={(c) => {
                // setHandler(c.handler);
                // setCanvas(c.canvas);
              }}
              ref={(c: any) => {
                setHandler(c?.handler);
                setCanvas(c?.canvas);
              }}
              minZoom={20}
              maxZoom={500}
              objectOption={{
                stroke: "rgba(255, 255, 255, 0)",
                strokeUniform: true,
                resource: {},
                link: {
                  enabled: false,
                  type: "resource",
                  state: "new",
                  dashboard: {},
                },
                tooltip: {
                  enabled: true,
                  type: "resource",
                  template: "<div>{{message.name}}</div>",
                },
                animation: {
                  type: "none",
                  loop: true,
                  autoplay: true,
                  duration: 1000,
                },
                userProperty: {},
                trigger: {
                  enabled: false,
                  type: "alarm",
                  script: "return message.value > 0;",
                  effect: "style",
                },
              }}
              propertiesToInclude={[
                "id",
                "name",
                "locked",
                "file",
                "src",
                "link",
                "tooltip",
                "animation",
                "layout",
                "workareaWidth",
                "workareaHeight",
                "videoLoadType",
                "autoplay",
                "shadow",
                "muted",
                "loop",
                "code",
                "icon",
                "userProperty",
                "trigger",
                "configuration",
                "superType",
                "points",
                "svg",
                "loadType",
              ]}
              className="w-full h-full top-0 left-0"
              canvasOption={{
                backgroundColor: theme === "dark" ? "#000" : "#F1F0F0",
                selectionColor:
                  theme === "dark"
                    ? "rgb(43, 235, 200, 0.15)"
                    : "rgb(93, 70, 243, 0.15)",
                selectionBorderColor:
                  theme === "dark" ? "rgb(43, 235, 200)" : "rgb(93, 70, 243)",
                selectionLineWidth: 2,
              }}
              onZoom={(zoomRatio) => {
                setCanvasZoomRatio(zoomRatio);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default One;
