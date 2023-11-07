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
        element.fabricObject &&
        selectedElement.includes(element.fabricObject as any)
          ? "ring-primary-400 dark:ring-primary-100 ring-4"
          : "ring-primary-200 ring-2",
        getElementColor(
          element.type === "shape" ? element.properties.type : element.type
        ),
      ])}
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
        onClick={() => {
          if (element.fabricObject) {
            setSelectedElement([element.fabricObject] as fabric.Object[]);
            canvas?.setActiveObject(element.fabricObject);
          }
        }}
        className="absolute top-0 left-0 z-10 w-full h-full bg-repeat-space bg-contain bg-voice"
      />
      <div className="flex items-center w-full h-full gap-2 px-2 font-bold text-white dark:text-black">
        <div className="z-20 select-none line-clamp-1 [&>*]:w-4 [&>*]:h-4">
          {getElementIcon(
            element.type === "shape" ? element.properties.type : element.type
          )}
        </div>
        <div className="z-20 select-none line-clamp-1">
          {element.type === "shape" ? element.properties.type : element.type}
        </div>
      </div>
    </Rnd>
  );
};

type TrackProps = DivProps & {
  track: any;
};

export const Track = ({ track, ...props }: TrackProps) => {
  return (
    <div {...props}>
      {track.elements.map((element: ElementType, i: number) => (
        <Element key={i} element={element} />
      ))}
    </div>
  );
};

export default Track;
