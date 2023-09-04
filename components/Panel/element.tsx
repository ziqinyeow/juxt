"use client";

import { DivProps } from "@/lib/types/html";
import { cn } from "@/lib/utils";
import {
  IconBoxMargin,
  IconLanguageHiragana,
  IconPhoto,
  IconVideo,
} from "@tabler/icons-react";
import { useEffect, useRef } from "react";

interface ElementProps extends DivProps {
  element: any;
}

export const Element = ({
  element,
  className,
  children,
  ...props
}: ElementProps) => {
  const resizeableBox = useRef<HTMLDivElement | null>(null);
  const resizeableLeftHandler = useRef<HTMLDivElement | null>(null);
  const resizeableRightHandler = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const resizeableElement = resizeableBox.current as HTMLDivElement;
    const resizerRight = resizeableRightHandler.current as HTMLDivElement;
    const resizerLeft = resizeableLeftHandler.current as HTMLDivElement;

    const clientRect = resizeableElement.getBoundingClientRect();
    const startingPoint = clientRect.left;

    const styles = window.getComputedStyle(resizeableElement);
    let oriWidth = parseInt(styles.width);
    let width = parseInt(styles.width);
    let height = parseInt(styles.height);

    let xCord = 0;

    const onMouseMoveRightResize = (event: MouseEvent) => {
      const dx = event.clientX - xCord;
      xCord = event.clientX;
      width += dx;
      resizeableElement.style.width = `${width}px`;
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
      width -= dx;
      resizeableElement.style.width = `${width}px`;

      const left = Math.max(0, xCord - startingPoint);
      resizeableElement.style.left = `${left}px`;
    };

    const onMouseUpLeftResize = (event: MouseEvent) => {
      document.removeEventListener("mousemove", onMouseMoveLeftResize);
    };

    const onMouseDownLeftResize = (event: MouseEvent) => {
      xCord = event.clientX;
      document.addEventListener("mousemove", onMouseMoveLeftResize);
      document.addEventListener("mouseup", onMouseUpLeftResize);
    };

    resizerRight.addEventListener("mousedown", onMouseDownRightResize);
    resizerLeft.addEventListener("mousedown", onMouseDownLeftResize);

    return () => {
      resizerRight.removeEventListener("mousedown", onMouseDownRightResize);
      resizerLeft.removeEventListener("mousedown", onMouseDownLeftResize);
    };
  }, []);

  return (
    <div className="relative h-6 my-8" {...props}>
      <div
        ref={resizeableBox}
        className={cn([
          "rounded w-[200px] absolute top-0 h-full gap-2 py-2 px-4 flex items-center ring-2 ring-primary-200 ring-offset-primary-500 ring-offset-[3px]",
          element.color,
        ])}
      >
        <div
          ref={resizeableLeftHandler}
          className="absolute top-0 z-10 w-1 h-full transition-all border rounded hover:w-2 cursor-left-bracket -left-0 bg-secondary-200"
        />
        <div
          ref={resizeableRightHandler}
          className="absolute top-0 z-10 w-1 h-full transition-all border rounded hover:w-2 cursor-right-bracket -right-0 bg-secondary-200"
        />
        <div className="select-none [&>*]:w-4 [&>*]:h-4">
          {element.type === "video" ? (
            <IconVideo />
          ) : element.type === "image" ? (
            <IconPhoto />
          ) : element.type === "text" ? (
            <IconLanguageHiragana />
          ) : element.type === "bbox" ? (
            <IconBoxMargin />
          ) : null}
        </div>
        <div className="select-none line-clamp-1">{element.type}</div>
      </div>
    </div>
  );
};
