/* eslint-disable react/display-name */
import { DivProps } from "@/lib/types/html";
import { cn } from "@/lib/utils";
import React from "react";

/**
 * Component used to resize horizontally.
 */
export const Handler = React.forwardRef(
  ({ className, ...props }: DivProps, ref: React.Ref<HTMLDivElement>) => (
    <div
      ref={ref}
      className={cn([
        // height = 130%, top = 15% (top = (130 - 100) / 2 = 15)
        "absolute -top-[15%] z-40 w-2 h-[130%] transition-all rounded cursor-ew-resize",
        className,
      ])}
      {...props}
    />
  )
);
