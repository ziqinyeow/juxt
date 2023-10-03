import { Tools } from "@/lib/types/tools";
import {
  IconBike,
  IconGrid3x3,
  IconGrid4x4,
  IconHandMiddleFinger,
  IconHandStop,
  IconLanguage,
  IconLassoPolygon,
  IconPentagon,
  IconPointer,
  IconPolygon,
  IconRectangle,
  IconRun,
  IconTriangle,
} from "@tabler/icons-react";
import { Square, Type } from "lucide-react";

export const tools: Tools[] = [
  {
    name: "cursor",
    focus: false,
    tools: [
      {
        name: "pointer",
        shortcut: "",
        icon: <IconPointer className="w-4 h-4" />,
      },
      {
        name: "grab",
        shortcut: "",
        icon: <IconHandStop className="w-4 h-4" />,
      },
      {
        name: "destroy this app",
        shortcut: "",
        icon: <IconHandMiddleFinger className="w-4 h-4" />,
      },
    ],
  },
  {
    name: "text",
    focus: true,
    tools: [
      {
        name: "text",
        shortcut: "T",
        icon: <Type className="w-4 h-4" />,
      },
    ],
  },
  {
    name: "roi",
    focus: true,
    tools: [
      {
        name: "square roi",
        shortcut: "A",
        icon: <Square className="w-4 h-4" />,
      },
      {
        name: "tri roi",
        shortcut: "B",
        icon: <IconTriangle className="w-4 h-4" />,
      },
      {
        name: "poly roi",
        shortcut: "C",
        icon: <IconLassoPolygon className="w-4 h-4" />,
      },
    ],
  },
  {
    name: "grid",
    focus: true,
    tools: [
      {
        name: "3x3",
        shortcut: "",
        icon: <IconGrid3x3 className="w-4 h-4" />,
      },
      {
        name: "4x4",
        shortcut: "",
        icon: <IconGrid4x4 className="w-4 h-4" />,
      },
    ],
  },
  {
    name: "pose",
    focus: true,
    tools: [
      {
        name: "pose",
        shortcut: "",
        icon: <IconRun className="w-4 h-4" />,
      },
      {
        name: "bikefit",
        shortcut: "",
        icon: <IconBike className="w-4 h-4" />,
      },
    ],
  },
];
