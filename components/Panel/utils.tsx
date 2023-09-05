import { ElementType } from "@/lib/types/track";
import {
  IconBoxMargin,
  IconLanguageHiragana,
  IconPhoto,
  IconVideo,
  IconYoga,
} from "@tabler/icons-react";
import { ClassValue } from "clsx";

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
