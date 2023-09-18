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
 * For example,
 * i == 25, panelScale == 50, show the text as 5 seconds
 * i == 50, panelScale == 50, show the text as 10 seconds
 * i == 75, panelScale == 50, show the text as 15 seconds
 *
 * i == 26, panelScale == 51, 5 seconds
 * i == 51, panelScale == 51, 10 seconds
 * i == 52, panelScale == 51, false
 * i == 77, panelScale == 51, true -> 15 seconds
 *
 * @param i (number) index used to
 * @param panelScale
 * @returns
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

export const getElementColor = (elementType: ElementType): ClassValue => {
  switch (elementType) {
    case "video":
      return "bg-element-1";
    case "image":
      return "bg-element-2";
    case "text":
      return "bg-element-3";
    case "bbox":
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
    case "bbox":
      return <IconBoxMargin />;
    case "pose":
      return <IconYoga />;
    default:
      return null;
  }
};
