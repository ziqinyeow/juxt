import { ElementType } from "@/lib/types/track";
import {
  IconBoxMargin,
  IconLanguageHiragana,
  IconPhoto,
  IconVideo,
  IconYoga,
} from "@tabler/icons-react";
import { ClassValue } from "clsx";

/**
 * Logic used to check if current index (corresponse to seconds) can be shown or not.
 *
 * For example,\
 * i == 25, panelScale == 50, show the text as 5 seconds \
 * i == 50, panelScale == 50, show the text as 10 seconds \
 * i == 75, panelScale == 50, show the text as 15 seconds
 *
 * @param i index used to in the panel tick
 * @param panelScale current panelScale
 * @returns whether to show the number on top of the ticks
 */
export const showSecondsOnPanelTickLogic = (i: number, panelScale: number) => {
  // i is the scale of panelScale number
  if (i % panelScale == 0) {
    return true;
  } else if (panelScale % 2 == 0 && i % (panelScale / 2) == 0) {
    return true;
  } else {
    return false;
  }
};

/**
 *
 * Get the number of ticks in the top scale
 *
 * maxTime / 10000  -> converts milliseconds to seconds and scale down 10x
 * + 1              -> adds 10 seconds
 * * panelScale     -> scale by panelScale
 * + 1              -> add one more main scale, eg. 10s ... 20s ... (add this, 30s)
 *
 * @param maxTime
 * @param panelScale
 * @returns
 */
export const getNumberOfTicks = (maxTime: number, panelScale: number) => {
  return (maxTime / 10000 + 1) * panelScale + 1;
};

export const getTicksGapWidth = (panelScale: number) => {
  return (120 + panelScale * 10) / panelScale;
};

/**
 *
 * Function used to compute the width of the elements on track
 *
 * panelScale = 50, milliseconds = 5000, return 312.5
 * panelScale = 50, milliseconds = 10000, return 625
 * panelScale = 51, milliseconds = 10000, return 635
 *
 * @param maxTime
 * @param milliSeconds duration of an element in milliseconds
 * @param panelScale
 * @returns
 */
export const convertDurationToPixelWidth = (
  milliSeconds: number,
  maxTime: number,
  panelScale: number
) => {
  const totalNumberOfTicks = getNumberOfTicks(maxTime, panelScale) - 1;
  const gap = getTicksGapWidth(panelScale);
  const numberOfTicks = (milliSeconds * totalNumberOfTicks) / (maxTime + 10000);
  return numberOfTicks * gap;
};

export const convertPixelWidthToDuration = (
  pixels: number,
  maxTime: number,
  panelScale: number
) => {
  const totalNumberOfTicks = getNumberOfTicks(maxTime, panelScale) - 1;
  const gap = getTicksGapWidth(panelScale);
  const numberOfTicks = pixels / gap;
  const duration = (numberOfTicks * (maxTime + 10000)) / totalNumberOfTicks;
  return duration;
};

export const getElementColor = (elementType: ElementType): ClassValue => {
  switch (elementType) {
    case "video":
      return "bg-element-1";
    case "image":
      return "bg-element-2";
    case "text":
      return "bg-element-3";
    case "shape":
      return "bg-element-4";
    case "pose":
      return "bg-element-5";
    default:
      return "bg-element-7";
  }
};

export const getElementIcon = (elementType: ElementType) => {
  switch (elementType) {
    case "video":
      return <IconVideo />;
    case "image":
      return <IconPhoto />;
    case "text":
      return <IconLanguageHiragana />;
    case "shape":
      return <IconBoxMargin />;
    case "pose":
      return <IconYoga />;
    default:
      return null;
  }
};
