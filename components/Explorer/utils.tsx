import { cn } from "@/lib/utils";
import {
  IconFile,
  IconFileTypeCsv,
  IconFileTypePdf,
  IconPhoto,
} from "@tabler/icons-react";
import { Braces, Clapperboard } from "lucide-react";

export const getFileIcon = (file: string, className: string = "") => {
  const fileSplit = file.split(".");
  const extension = fileSplit[fileSplit.length - 1].toLowerCase();
  const newClassName = cn(["icon-4 w-4 h-4", className]);
  switch (extension) {
    case "jpg":
    case "jpeg":
    case "png":
    case "svg":
      return <IconPhoto className={newClassName} />;
    case "mp4":
    case "avi":
      return <Clapperboard className={newClassName} />;
    case "json":
      return <Braces className={newClassName} />;
    case "pdf":
      return <IconFileTypePdf className={newClassName} />;
    case "csv":
      return <IconFileTypeCsv className={newClassName} />;
    default:
      return <IconFile className={newClassName} />;
  }
};
