"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative w-full h-1 overflow-hidden bg-white rounded-full cursor-pointer ring-light-500 dark:ring-primary-500 ring-offset-light-400 dark:ring-offset-primary-500 ring-offset-2 ring-2 grow dark:bg-primary-300">
      <SliderPrimitive.Range className="absolute h-full bg-secondary-100 dark:bg-secondary-200" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block w-4 h-4 transition-colors rounded-t-full rounded-b-full cursor-pointer bg-secondary-100 dark:bg-secondary-200 dark:border-primary-500 dark:ring-offset-primary-400 focus-visible:outline-none ring-2 ring-ring ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
