"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { getElementColor, getElementIcon } from "./utils";

const Track = ({ track }: any) => {
  const [state, setState] = useState({
    width: 200,
    height: 24,
    x: 100,
    y: 0,
  });

  return (
    <div className="relative w-full h-6">
      <Rnd
        className={cn([
          "rounded select-none ring-2 ring-primary-200 ring-offset-primary-500 ring-offset-[3px]",
          getElementColor(track.type),
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
        size={{ width: state.width, height: state.height }}
        position={{ x: state.x, y: state.y }}
        onDragStop={(e, d) => {
          setState((p) => {
            return { ...p, x: d.x, y: d.y };
          });
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          setState({
            width: Number(ref.style.width.replace("px", "")),
            height: Number(ref.style.height.replace("px", "")),
            ...position,
          });
        }}
      >
        <div className="absolute top-0 left-0 z-10 w-full h-full bg-repeat-space bg-contain bg-voice" />
        <div className="flex items-center w-full h-full gap-2 px-2 font-bold text-black">
          <div className="z-20 select-none line-clamp-1 [&>*]:w-4 [&>*]:h-4">
            {getElementIcon(track.type)}
          </div>
          <div className="z-20 select-none line-clamp-1">{track.type}</div>
        </div>
      </Rnd>
    </div>
  );
};

export default Track;
