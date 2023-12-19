import {
  Canvas as _Canvas,
  FabricCanvas,
  FabricObject,
  Handler,
} from "@/canvas";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/Button";
import {
  IconFocusCentered,
  IconLayoutGridAdd,
  IconYoga,
} from "@tabler/icons-react";
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
import { fabric } from "fabric";

const Canvas = () => {
  const [c] = useKeyboardJs("c");
  const [plus] = useKeyboardJs("=");
  const [minus] = useKeyboardJs("-");
  const [canvasZoomRatio, setCanvasZoomRatio] = useState(1);
  const zoomValue = parseInt((canvasZoomRatio * 100).toFixed(2), 10);
  const {
    canvas,
    setCanvas,
    websocketConnected,
    getElement,
    fileURLCache,
    sendWebsocketMessage,
    refreshTracks,
  } = useStore();
  //   const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [handler, setHandler] = useState<Handler | null>(null);
  const { theme } = useTheme();
  // console.log(websocketConnected);

  // useEffect(() => {
  //   if (websocketConnected) {
  //     refreshTracks();
  //   }
  // }, [websocketConnected]);

  useEffect(() => {
    if (canvas) {
      if (c) {
        const workarea = canvas
          .getObjects()
          // @ts-ignore
          .find((obj) => obj.id === "workarea") as FabricObject;
        handler?.zoomHandler.zoomToCenterWithObject(workarea, true);
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
    <div className="w-full h-full">
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
              // handler?.zoomHandler.zoomToFitPad();
              const workarea = canvas
                ?.getObjects()
                // @ts-ignore
                .find((obj) => obj.id === "workarea") as FabricObject;
              handler?.zoomHandler.zoomToCenterWithObject(workarea, true);
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
      {websocketConnected ? (
        <div className="w-full h-full relative">
          <_Canvas
            className="w-full h-full absolute top-0 left-0"
            init={(c) => {
              setCanvas(c.canvas);
              setHandler(c.handler);
              refreshTracks();
            }}
            // ref={(c: any) => {
            //   //   setCanvas(c?.canvas);
            // }}
            onContext={async (ref, event, target) => {
              const element = getElement(target?.name ?? "");
              if (element?.type === "image" || element?.type === "video") {
                return (
                  <div>
                    <div
                      onClick={() => {
                        if (element?.properties?.pose?.length > 0) {
                          return;
                        }

                        // @ts-ignore
                        const cache = fileURLCache[element.properties.mediaId];
                        // @ts-ignore
                        const file = cache?.file as File;
                        const url = cache?.url;
                        if (!file) return;

                        if (element.type === "image") {
                          const reader = new FileReader();
                          reader.readAsArrayBuffer(file);

                          reader.onload = () => {
                            const imageData = reader.result as ArrayBufferLike;
                            const uint8Array = new Uint8Array(imageData);
                            sendWebsocketMessage(element.id);
                            sendWebsocketMessage(uint8Array.buffer);
                          };
                        } else if (element.type === "video") {
                          const video = document.createElement("video");
                          video.src = url;
                          video.muted = true;

                          const canvas = document.createElement("canvas");
                          const context = canvas.getContext("2d");
                          const reader = new FileReader();

                          function extractFrame() {
                            if (video.paused || video.ended) {
                              console.log("ended");
                              return;
                            }
                            context?.drawImage(
                              video,
                              0,
                              0,
                              canvas.width,
                              canvas.height
                            );

                            // Convert the canvas data to a buffer
                            canvas.toBlob(function (blob: any) {
                              reader.onload = function () {
                                const buffer = reader.result as ArrayBuffer;
                                sendWebsocketMessage(element?.id!);
                                sendWebsocketMessage(buffer);

                                requestAnimationFrame(extractFrame);
                              };

                              reader.readAsArrayBuffer(blob);
                            }, "image/jpeg");
                          }
                          video.onloadeddata = function () {
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                          };
                          video.oncanplay = () => {
                            video.play();
                            extractFrame();
                          };
                        }
                      }}
                      className={cn(
                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                        "flex items-center gap-2 cursor-pointer hover:bg-secondary-200 focus:text-black"
                      )}
                    >
                      <div className="">
                        <IconYoga className="w-4 h-4" />
                      </div>
                      <div className="text-[12px] font-bold tracking-widest">
                        {/* @ts-ignore */}
                        {element?.properties?.pose?.length > 0
                          ? "Rerun pose estimation"
                          : "Run pose estimation"}
                      </div>
                    </div>
                    <div
                      className={cn(
                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                        "flex items-center gap-2 cursor-pointer hover:bg-secondary-200 focus:text-black"
                      )}
                    >
                      <div className="">
                        <IconLayoutGridAdd className="w-4 h-4" />
                      </div>
                      <div className="text-[12px] font-bold tracking-widest">
                        View Chart
                      </div>
                    </div>
                  </div>
                );
              }
              // return <div></div>;
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
            canvasOption={{
              // uniformScaling: false,
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
      ) : (
        <></>
      )}
    </div>
  );
};

export default React.memo(Canvas);
