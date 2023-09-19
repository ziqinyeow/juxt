import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Cursor } from "@/lib/types/cursor";
import { cn } from "@/lib/utils";
import { ChevronDown, MousePointer, Slice } from "lucide-react";
import Tooltip from "../Tooltip";

type Props = {
  cursor: Cursor;
  setCursor: React.Dispatch<React.SetStateAction<Cursor>>;
};

const cursors = [
  {
    cursor: "pointer",
    shortcut: "A",
    icon: <MousePointer className="w-4 h-4" />,
    disabled: false,
  },
  {
    cursor: "slice",
    shortcut: "B",
    icon: <Slice className="w-4 h-4" />,
    disabled: true,
  },
];

const CursorDropdown = ({ cursor, setCursor }: Props) => {
  return (
    <div className="flex gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="outline-none">
          <span tabIndex={0}>
            <Tooltip tooltip={`cursor`}>
              <div className="flex items-center gap-2 p-2 rounded cursor-pointer bg-primary-500">
                <button
                  className={cn([
                    "hover:text-opacity-75",
                    "transition-all",
                    "text-secondary-200",
                  ])}
                >
                  {cursor === "pointer" ? (
                    <MousePointer className="w-4 h-4" />
                  ) : (
                    <Slice className="w-4 h-4" />
                  )}
                </button>
                <ChevronDown className="w-4 h-4" />
              </div>
            </Tooltip>
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={"start"}
          className="shadow-lg text-primary-100 bg-primary-500 border-primary-400"
        >
          {cursors.map((_cursor, i) => (
            <DropdownMenuItem
              key={i}
              disabled={_cursor.disabled}
              onClick={() => {
                setCursor(_cursor.cursor as Cursor);
              }}
              className={cn([
                cursor === _cursor.cursor && "text-secondary-200",
                "flex items-center justify-between gap-2 focus:bg-primary-400 focus:text-secondary-200",
              ])}
            >
              <div className="flex items-center gap-2 text-sm">
                {_cursor.icon} {_cursor.cursor}
              </div>
              <div className="text-[10px]">{_cursor.shortcut}</div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CursorDropdown;
