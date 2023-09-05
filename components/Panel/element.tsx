"use client";

import { type DivProps } from "@/lib/types/html";
import { cn } from "@/lib/utils";
import React from "react";
import { useEffect, useRef } from "react";
import { Handler } from "./handler";
import { getElementColor, getElementIcon } from "./utils";

interface ElementProps extends DivProps {
  element: any;
}

export const Element = ({
  element,
  className,
  children,
  ...props
}: ElementProps) => {
  const parentBox = useRef<HTMLDivElement | null>(null);
  const dragBox = useRef<HTMLDivElement | null>(null);
  const resizeableLeftHandler = useRef<HTMLDivElement | null>(null);
  const resizeableRightHandler = useRef<HTMLDivElement | null>(null);

  /**
   * Use Effect Hook used to define event listeners for
   * track element (move, resize from left, resize from right)
   */
  useEffect(() => {
    const type = element.type;
    // prevent video from scaling more than original width
    const maximumBoundary = type === "video";
    const minWidth = 15;
    const parentBoxElement = parentBox.current as HTMLDivElement;
    const dragBoxElement = dragBox.current as HTMLDivElement;
    const resizerRight = resizeableRightHandler.current as HTMLDivElement;
    const resizerLeft = resizeableLeftHandler.current as HTMLDivElement;

    const styles = window.getComputedStyle(parentBoxElement);
    let oriWidth = parseInt(styles.width);
    let width = parseInt(styles.width);

    let xCord = 0;
    let left = 0;

    // const onDragBox = (event: DragEvent) => {
    const onDragBox = (event: MouseEvent) => {
      const dx = event.clientX - xCord;
      xCord = event.clientX;
      left += dx;
      // prevent movement exceeding left: -px
      left = Math.max(0, left);

      parentBoxElement.style.left = `${left}px`;
      //   dragBoxElement.style.left = `${left}px`;
    };

    // const onDragEndBox = (event: DragEvent) => {
    const onDragEndBox = (event: MouseEvent) => {
      //   document.removeEventListener("drag", onDragBox);
      document.removeEventListener("mousemove", onDragBox);
    };

    // const onDragStartBox = (event: DragEvent) => {
    const onDragStartBox = (event: MouseEvent) => {
      xCord = event.clientX;
      //   document.addEventListener("drag", onDragBox);
      //   document.addEventListener("dragend", onDragEndBox);
      document.addEventListener("mousemove", onDragBox);
      document.addEventListener("mouseup", onDragEndBox);
    };

    const onMouseMoveRightResize = (event: MouseEvent) => {
      const dx = event.clientX - xCord;
      xCord = event.clientX;
      width += dx;
      width = Math.max(width, minWidth);

      if (maximumBoundary) {
        width = Math.min(width, oriWidth);
      }
      parentBoxElement.style.width = `${width}px`;
    };

    const onMouseUpRightResize = (event: MouseEvent) => {
      document.removeEventListener("mousemove", onMouseMoveRightResize);
    };

    const onMouseDownRightResize = (event: MouseEvent) => {
      xCord = event.clientX;
      document.addEventListener("mousemove", onMouseMoveRightResize);
      document.addEventListener("mouseup", onMouseUpRightResize);
    };

    const onMouseMoveLeftResize = (event: MouseEvent) => {
      const dx = event.clientX - xCord;
      xCord = event.clientX;
      // prevent width from increasing if box reached 0 and user still drag to the left
      if (maximumBoundary || left !== 0) {
        width -= dx;
      }
      // prevent width from decreasing below min width
      width = Math.max(width, minWidth);

      // prevent width from increasing beyond original width if maximum boundary is set to true
      if (maximumBoundary) {
        width = Math.min(width, oriWidth);
      }

      parentBoxElement.style.width = `${width}px`;

      // only allow box the move left if width is within min width and ori width
      if (maximumBoundary && width > minWidth && width < oriWidth) {
        left += dx;
      }
      // only allow box the move left if width greater than min width (prevent box from moving the right if reached the right limit)
      else if (!maximumBoundary && width > minWidth) {
        left += dx;
      }

      parentBoxElement.style.left = `${left}px`;
    };

    const onMouseUpLeftResize = (event: MouseEvent) => {
      document.removeEventListener("mousemove", onMouseMoveLeftResize);
    };

    const onMouseDownLeftResize = (event: MouseEvent) => {
      xCord = event.clientX;
      document.addEventListener("mousemove", onMouseMoveLeftResize);
      document.addEventListener("mouseup", onMouseUpLeftResize);
    };

    // dragBoxElement.addEventListener("dragstart", onDragStartBox); // move box
    dragBoxElement.addEventListener("mousedown", onDragStartBox); // move box
    resizerRight.addEventListener("mousedown", onMouseDownRightResize); // resize from right
    resizerLeft.addEventListener("mousedown", onMouseDownLeftResize); // resize from left

    return () => {
      //   dragBoxElement.removeEventListener("dragstart", onDragStartBox);
      dragBoxElement.removeEventListener("mousedown", onDragStartBox);
      resizerRight.removeEventListener("mousedown", onMouseDownRightResize);
      resizerLeft.removeEventListener("mousedown", onMouseDownLeftResize);
    };
  }, [element.type]);

  return (
    <div className="relative h-6 my-8" {...props}>
      <div ref={parentBox} className="relative w-[200px] h-full">
        <Handler className="-left-2" ref={resizeableLeftHandler} />
        <Handler className="-right-2" ref={resizeableRightHandler} />
        <div
          ref={dragBox}
          //   draggable
          className={cn([
            "rounded w-full select-none absolute top-0 h-full gap-2 py-2 px-2 text-black font-bold flex items-center ring-2 ring-primary-200 ring-offset-primary-500 ring-offset-[3px]",
            getElementColor(element.type),
          ])}
        >
          <div className="absolute top-0 left-0 z-10 w-full h-full bg-repeat-space bg-contain bg-voice" />
          <div className="z-20 select-none line-clamp-1 [&>*]:w-4 [&>*]:h-4">
            {getElementIcon(element.type)}
          </div>
          <div className="z-20 select-none line-clamp-1">{element.type}</div>
        </div>
      </div>
    </div>
  );
};
