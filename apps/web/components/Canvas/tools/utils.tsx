import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "shadcn/ui/dropdown-menu";

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
    <div className="flex items-center h-full gap-1 p-1 bg-white dark:bg-primary-400">
      <Button
        onClick={() => {
          if (currentToolIndex === index) {
            setCurrentToolIndex(null);
          } else {
            setCurrentToolIndex(index);
          }
        }}
        className={cn([
          "text-secondary-100 dark:text-secondary-200 p-2",
          currentToolIndex === index
            ? "bg-light-300 dark:bg-black hover:bg-light-400 dark:hover:bg-black"
            : "hover:bg-light-300 dark:hover:bg-primary-600",
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
          <Button className="px-2 py-[9px] dark:text-white text-black hover:text-secondary-100 dark:hover:text-secondary-200">
            <ChevronLeft className="w-3 h-3" />
          </Button>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        sideOffset={8}
        className="flex items-center z-[200] gap-1 p-1 tracking-widest text-black dark:text-white border-0 bg-white dark:bg-primary-600 dark:hover:bg-primary-600"
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
          "p-2 dark:focus:bg-black text-black dark:!text-white hover:!text-secondary-100 dark:hover:!text-secondary-200 focus:!text-secondary-100 dark:focus:!text-secondary-200 cursor-pointer",
        ])}
        onClick={onClick}
      >
        {tool?.icon}
      </DropdownMenuItem>
    </Tooltip>
  );
};
