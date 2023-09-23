"use client";

import { useStore } from "@/lib/store";
import { fabric } from "fabric";
import React, { useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Button } from "@/components/Button";
import { Minus, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Tooltip from "../Tooltip";

type Props = {
  children: React.ReactNode;
};

const Zoomable = ({ children }: Props) => {
  const transformWrapper = useRef();
  const [canvasScale, setCanvasScale] = useState(0.3);
  const { canvas, setCanvas, setSelectedElement } = useStore();

  const updateScale = (out: boolean, factor: number = 0.1) => {
    const { zoomIn, zoomOut } = transformWrapper.current as any;
    if (out) {
      zoomOut(factor);
    } else if (canvasScale < 1.0) {
      zoomIn(factor);
    }
    setCanvasScale((prev) =>
      out ? Math.max(0.1, prev - factor) : Math.min(1, prev + factor)
    );
  };

  return (
    <TransformWrapper
      // @ts-ignore
      ref={transformWrapper}
      initialScale={1.2}
      minScale={1}
      maxScale={10}
      limitToBounds={true}
      centerOnInit={true}
      centerZoomedOut={true}
      panning={{ disabled: true }}
      wheel={{
        disabled: true,
        step: 1,
      }}
      doubleClick={{
        disabled: true,
      }}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <React.Fragment>
          <div className="absolute z-20 flex items-center gap-1 p-1 text-white border rounded bg-primary-400 border-primary-400 right-5 bottom-8">
            <Tooltip tooltip={`zoom out`}>
              <Button
                className="p-2"
                onClick={() => {
                  updateScale(true);
                }}
              >
                <Minus className="w-4 h-4" />
              </Button>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="outline-none">
                <span tabIndex={0}>
                  <Tooltip tooltip={`scale`}>
                    <div className="flex items-center gap-2 p-2 rounded cursor-pointer bg-primary-500">
                      <button
                        className={cn([
                          "hover:text-opacity-75",
                          "transition-all",
                          "text-secondary-200",
                        ])}
                      >
                        {(canvasScale * 100).toFixed(0)} %
                      </button>
                    </div>
                  </Tooltip>
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={"center"}
                className="shadow-lg text-primary-100 bg-primary-500 border-primary-400"
              >
                {Array(10)
                  .fill(0)
                  .map((_, i) => (
                    <DropdownMenuItem
                      key={i}
                      onClick={() => {
                        const offset = canvasScale - (i + 1) / 10;
                        const out = offset > 0;
                        if (out) {
                          zoomOut(offset);
                        } else {
                          zoomIn(Math.abs(offset));
                        }
                        setCanvasScale((i + 1) / 10);
                      }}
                      className={cn([
                        canvasScale === (i + 1) / 10 && "text-secondary-200",
                        "flex items-center justify-center gap-2 focus:bg-primary-400 focus:text-secondary-200",
                      ])}
                    >
                      <div className="flex items-center gap-2 text-xs">
                        {(i + 1) * 10} %
                      </div>
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip tooltip={`zoom in`}>
              <Button
                className="p-2"
                onClick={() => {
                  updateScale(false);
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
          <TransformComponent>{children}</TransformComponent>
        </React.Fragment>
      )}
    </TransformWrapper>
  );
};

export default Zoomable;
