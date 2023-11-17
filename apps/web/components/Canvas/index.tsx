import { Canvas as _Canvas, FabricCanvas, Handler } from "@/canvas";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
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
import Tools from "../LegacyCanvas/tools";
import { tools } from "../LegacyCanvas/tools/tools";

const Canvas = () => {
  const [c] = useKeyboardJs("c");
  const [plus] = useKeyboardJs("=");
  const [minus] = useKeyboardJs("-");
  const [canvasZoomRatio, setCanvasZoomRatio] = useState(1);
  const zoomValue = parseInt((canvasZoomRatio * 100).toFixed(2), 10);
  const { test, setTest, canvas, projects, setCanvas, refreshTracks } =
    useStore();
  //   const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [c, plus, minus]);
  //   console.log(projects);

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-0 flex items-center h-full justify-center gap-2 left-1">
        <div className="flex gap-2 flex-col">
          <Tools tools={tools} />
        </div>
      </div>
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
              handler?.zoomHandler.zoomIn();
            }}
          >
            <Plus className="w-4 h-4 text-black dark:text-white" />
          </Button>
        </Tooltip>
      </div>
      <_Canvas
        init={(c) => {
          setCanvas(c.canvas);
          setHandler(c.handler);
          //   refreshTracks();
        }}
        // ref={(c: any) => {
        //   //   setCanvas(c?.canvas);
        // }}
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
  );
};

export default React.memo(Canvas);
