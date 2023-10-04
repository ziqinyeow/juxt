import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/Button";
import { ChevronLeft } from "lucide-react";
import { Tool, Tools } from "@/lib/types/tools";
import { useEffect, useState } from "react";
import Tooltip from "@/components/Tooltip";
import { useStore } from "@/lib/store";
import { IEvent } from "fabric/fabric-impl";
import { DivProps } from "@/lib/types/html";

export const Row = ({
  index,
  currentToolIndex,
  setCurrentToolIndex,
  currentTools,
  children,
}: any) => {
  return (
    <div className="flex items-center h-full gap-1 p-1 bg-primary-400">
      <Button
        onClick={() => {
          if (currentToolIndex === index) {
            setCurrentToolIndex(null);
          } else {
            setCurrentToolIndex(index);
          }
        }}
        className={cn([
          "text-secondary-200 p-2",
          currentToolIndex === index
            ? "bg-black hover:bg-black"
            : "hover:bg-primary-600",
        ])}
      >
        {currentTools?.[index].icon}
      </Button>
      {children}
    </div>
  );
};

export const Menu = ({ children }: { children?: React.ReactNode }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className={cn(["rounded focus:outline-none"])}
      >
        <span className="data-[state=open]:rotate-180 duration-200 transition">
          <Button className="px-2 py-[9px] text-white hover:text-secondary-200">
            <ChevronLeft className="w-3 h-3" />
          </Button>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        sideOffset={8}
        className="flex items-center z-[200] gap-1 p-1 tracking-widest text-white border-0 bg-primary-600 hover:bg-primary-600"
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Item = ({ tool, onClick }: { tool: Tool } & DivProps) => {
  return (
    <Tooltip className="text-[10px]" tooltip={tool.name}>
      <DropdownMenuItem
        className={cn([
          "p-2 focus:bg-black !text-white hover:!text-secondary-200 focus:!text-secondary-200 cursor-pointer",
        ])}
        onClick={onClick}
      >
        {tool?.icon}
      </DropdownMenuItem>
    </Tooltip>
  );
};
