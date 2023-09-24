import { IconFolderFilled } from "@tabler/icons-react";
import { Database } from "lucide-react";

export type Tab = "bucket" | "explorer";

export const getTabIcon = (tab: Tab) => {
  switch (tab) {
    case "bucket":
      return <Database className="w-4 h-4" />;
    case "explorer":
      return <IconFolderFilled className="w-4 h-4" />;
  }
};
