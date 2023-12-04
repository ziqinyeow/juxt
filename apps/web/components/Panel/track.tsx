"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import {
  convertDurationToPixelWidth,
  convertPixelWidthToDuration,
  getElementColor,
  getElementIcon,
  getTicksGapWidth,
} from "./utils";
import { DivProps } from "@/lib/types/html";
import { Element as ElementType } from "@/lib/types/track";
import { useStore } from "@/lib/store";
import useKeyboardJs from "react-use/lib/useKeyboardJs";
import { fabric } from "fabric";
import {
  IconClick,
  IconEdit,
  IconLayoutGridAdd,
  IconScriptPlus,
  IconStack2,
  IconStack3,
  IconTrash,
  IconYoga,
} from "@tabler/icons-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/ui/context-menu";
import { getFile } from "@/lib/store/storage";

type Props = {
  element: ElementType;
};

export const Element = ({ element }: Props) => {
  const {
    canvas,
    panelScale,
    maxTime,
    updateElement,
    selectedElement,
    setSelectedElement,
    updateMaxTime,
    getCurrentTimeInMs,
    updateTime,
  } = useStore();
  const [state, setState] = useState({
    width: convertDurationToPixelWidth(
      element.timeframe.duration,
      maxTime,
      panelScale
    ),
    x: convertDurationToPixelWidth(
      element.timeframe.start,
      maxTime,
      panelScale
    ),
    y: 0,
  });
  const [shift] = useKeyboardJs("shift");
  // console.log(element);

  // track elements' width if panelScale changed
  useEffect(() => {
    setState((p) => ({
      ...p,
      width: convertDurationToPixelWidth(
        element.timeframe.duration,
        maxTime,
        panelScale
      ),
      x: convertDurationToPixelWidth(
        element.timeframe.start,
        maxTime,
        panelScale
      ),
    }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelScale]);

  return (
    <Rnd
      className={cn([
        "rounded select-none ring-offset-[3px] ring-offset-light-300 dark:ring-offset-primary-500",
        selectedElement.findIndex((s) => s.id === element.id) != -1
          ? "ring-primary-400 dark:ring-primary-100 ring-4"
          : "ring-primary-200 ring-2",
        getElementColor(
          element.type === "shape" ? element.properties.type : element.type
        ),
      ])}
      onMouseDown={() => {
        if (shift) {
          // const selected = [...selectedElement, element];
          // setSelectedElement(selected);
          // const group = new fabric.Group();
          // selected.map((el) => {
          //   if (el.fabricObject) {
          //     // el.fabricObject.onDeselect = () => false;
          //     group.add(el.fabricObject);
          //     // canvas?.remove(el.fabricObject);
          //   }
          // });
          // canvas?.setActiveObject(group);
        } else if (element.fabricObject) {
          setSelectedElement([element]);
          canvas?.setActiveObject(element.fabricObject);
        }
      }}
      bounds="parent"
      enableResizing={{
        top: false,
        right: true,
        bottom: false,
        left: true,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      size={{ width: state.width, height: 24 }}
      position={{ x: state.x, y: 0 }}
      onDragStop={(e, d) => {
        const start = convertPixelWidthToDuration(d.x, maxTime, panelScale);
        updateElement(element.id, {
          timeframe: {
            ...element.timeframe,
            start,
          },
        });
        updateMaxTime();
        updateTime(getCurrentTimeInMs());
        setState((p) => {
          return { ...p, x: d.x };
        });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        const width = Number(ref.style.width.replace("px", ""));
        const start = convertPixelWidthToDuration(
          position.x,
          maxTime,
          panelScale
        );
        const duration = convertPixelWidthToDuration(
          width,
          maxTime,
          panelScale
        );
        updateElement(element.id, {
          timeframe: {
            start,
            duration,
          },
        });
        updateMaxTime();
        updateTime(getCurrentTimeInMs());
        setState({
          width,
          ...position,
        });
      }}
    >
      <div
        // onClick={() => {}}
        className="absolute top-0 left-0 z-10 w-full h-full bg-repeat-space bg-contain bg-voice"
      />
      <div className="flex items-center w-full h-full gap-2 px-2 font-bold text-white dark:text-black">
        <div className="z-20 select-none flex items-center gap-2 line-clamp-1 [&>*]:w-4 [&>*]:h-4">
          {getElementIcon(
            element.type === "shape" ? element.properties.type : element.type
          )}
          {/* @ts-ignore */}
          {/* {element.properties.pose.length > 0 ? <IconYoga /> : ""} */}
        </div>
        <div className="z-20 select-none line-clamp-1">
          {element.type === "shape" ? element.properties.type : element.type}{" "}
          {/* @ts-ignore */}
          {element?.properties?.pose?.length > 0 ? "+ pose" : ""}
        </div>
      </div>
    </Rnd>
  );
};

type TrackProps = DivProps & {
  track: any;
};

export const Track = ({ track, ...props }: TrackProps) => {
  const { lastWebsocketMessage, sendWebsocketMessage, fileURLCache } =
    useStore();
  const [contextMenu, setContextMenu] = useState({
    id: "",
    menu: "",
  });
  // console.log(lastWebsocketMessage);

  // useEffect(() => {
  //   if (!contextMenu.id) return;
  //   switch (contextMenu.menu) {
  //     case "process": {
  //       break;
  //     }
  //   }
  // }, [contextMenu]);
  // console.log(track);

  return (
    <div {...props}>
      {track.elements.map((element: ElementType, i: number) => (
        <ContextMenu
          key={i}
          onOpenChange={() => {
            // setContextMenuOpen(project.id);
          }}
        >
          <ContextMenuTrigger asChild>
            <div className="">
              <Element key={i} element={element} />
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="font-mono text-black border-2 dark:text-white bg-light-200 dark:bg-primary-600 border-light-400 dark:border-primary-400">
            <ContextMenuItem
              onClick={async () => {
                setContextMenu({
                  id: element.id,
                  menu: "process",
                });

                // @ts-ignore
                const cache = fileURLCache[element.properties.mediaId];
                // @ts-ignore
                const file = cache.file as File;
                const url = cache.url;
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
                        sendWebsocketMessage(element.id);
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
              className="flex items-center gap-2 cursor-pointer focus:bg-secondary-200 focus:text-black"
            >
              <div className="">
                <IconYoga className="w-4 h-4" />
              </div>
              <div className="text-[12px] font-bold tracking-widest">
                {/* @ts-ignore */}
                {element.properties?.pose?.length > 0
                  ? "Rerun pose estimation"
                  : "Run pose estimation"}
              </div>
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                setContextMenu({
                  id: element.id,
                  menu: "new tab",
                });
              }}
              className="flex items-center gap-2 cursor-pointer focus:bg-secondary-200 focus:text-black"
            >
              <div className="">
                <IconLayoutGridAdd className="w-4 h-4" />
              </div>
              <div className="text-[12px] font-bold tracking-widest">
                View Chart
              </div>
            </ContextMenuItem>
            {/* <ContextMenuSeparator className="h-1 bg-light-300 dark:bg-primary-400" />
            <ContextMenuItem
              onClick={() => {
                setContextMenu({
                  id: element.id,
                  menu: "edit",
                });
              }}
              className="flex items-center gap-2 cursor-pointer focus:bg-secondary-200 focus:text-black"
            >
              <div className="">
                <IconEdit className="w-4 h-4" />
              </div>
              <div className="text-[12px] font-bold tracking-widest">Edit</div>
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                setContextMenu({
                  id: element.id,
                  menu: "delete",
                });
              }}
              className="flex items-center gap-2 cursor-pointer focus:bg-secondary-200 focus:text-black"
            >
              <div className="">
                <IconTrash className="w-4 h-4" />
              </div>
              <div className="text-[12px] font-bold tracking-widest">
                Delete
              </div>
              <ContextMenuShortcut></ContextMenuShortcut>
            </ContextMenuItem> */}
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </div>
  );
};

export default Track;
