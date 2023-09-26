import { IconFolderFilled } from "@tabler/icons-react";
import { Database, Search } from "lucide-react";

export type Tab = "bucket" | "explorer" | "search";

export const getTabIcon = (tab: Tab) => {
  switch (tab) {
    case "explorer":
      return <IconFolderFilled className="w-4 h-4" />;
    case "bucket":
      return <Database className="w-4 h-4" />;
    case "search":
      return <Search className="w-4 h-4" />;
  }
};
