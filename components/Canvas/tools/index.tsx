"use client";
import { DivProps } from "@/lib/types/html";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/Button";
import { ChevronLeft } from "lucide-react";
import { Tools } from "@/lib/types/tools";
import { useState } from "react";
import Tooltip from "@/components/Tooltip";

const Tools = ({ tools, ...props }: { tools: Tools[] } & DivProps) => {
  const [currentToolIndex, setCurrentToolIndex] = useState<number | null>(null);
  const [currentTools, setCurrentTools] = useState(
    tools?.map((t) => t.tools[0])
  );

  return (
    <div
      {...props}
      className="overflow-hidden border-2 rounded-md z-[200] shadow border-primary-500"
    >
      {tools?.map((tool, i) => (
        <div
          key={i}
          className="flex items-center h-full gap-1 p-1 bg-primary-800"
        >
          <Button
            onClick={() => {
              setCurrentToolIndex(i);
            }}
            className={cn([
              "text-secondary-200 p-2 hover:bg-black",
              currentToolIndex === i && tool.focus && "bg-black",
            ])}
          >
            {currentTools?.[i].icon}
          </Button>
          {tool?.tools?.length > 1 && (
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
                {tool?.tools?.map((_tool, _i) => (
                  <Tooltip
                    className="text-[10px]"
                    key={_i}
                    tooltip={_tool.name}
                  >
                    <DropdownMenuItem
                      key={_i}
                      onClick={() => {
                        const temp = [...currentTools];
                        temp[i] = _tool;
                        setCurrentTools(temp);
                        setCurrentToolIndex(i);
                      }}
                      className={cn([
                        "p-2 focus:bg-black !text-white hover:!text-secondary-200 focus:!text-secondary-200 cursor-pointer",
                      ])}
                    >
                      {_tool?.icon}
                    </DropdownMenuItem>
                  </Tooltip>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      ))}
    </div>
  );
};

export default Tools;
