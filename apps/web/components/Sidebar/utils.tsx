import { IconFolderFilled } from "@tabler/icons-react";
import { Database, Film, Search } from "lucide-react";

export type Tab = "media" | "explorer" | "search";

export const getTabIcon = (tab: Tab) => {
  switch (tab) {
    case "explorer":
      return <IconFolderFilled className="w-4 h-4" />;
    case "media":
      return <Film className="w-4 h-4" />;
    // case "bucket":
    //   return <Database className="w-4 h-4" />;
    case "search":
      return <Search className="w-4 h-4" />;
  }
};
