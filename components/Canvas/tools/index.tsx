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
import { Tool, Tools } from "@/lib/types/tools";
import { useEffect, useState } from "react";
import Tooltip from "@/components/Tooltip";
import { useStore } from "@/lib/store";
import { IEvent } from "fabric/fabric-impl";
import { drawRect } from "@/lib/utils/tools";
// import { tools } from "./tools";

const Row = ({
  index,
  currentToolIndex,
  setCurrentToolIndex,
  currentTools,
  children,
}: any) => {
  return (
    <div className="flex items-center h-full gap-1 p-1 bg-primary-800">
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

const Menu = ({ children }: { children?: React.ReactNode }) => {
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

const Item = ({ tool, onClick }: { tool: Tool } & DivProps) => {
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

const Tools = ({ tools, ...props }: { tools: Tools[] } & DivProps) => {
  const { canvas } = useStore();
  const [currentToolIndex, setCurrentToolIndex] = useState<number | null>(null);
  const [currentTools, setCurrentTools] = useState(
    tools?.map((t) => t.tools[0])
  );

  useEffect(() => {
    if (!canvas) return;
    if (currentToolIndex !== null) {
      switch (currentTools[currentToolIndex].name) {
        case "pointer":
          canvas!.selection = true;
          canvas!.defaultCursor = "default";
          canvas!.hoverCursor = "all-scroll";
          canvas?.forEachObject(function (obj) {
            obj.selectable = true;
          });
          canvas.off("mouse:down");
          canvas.off("mouse:move");
          canvas.off("mouse:up");
          canvas?.requestRenderAll();
          break;
        case "square roi":
          canvas!.selection = false;
          canvas!.defaultCursor = "crosshair";
          canvas!.hoverCursor = "crosshair";
          canvas?.discardActiveObject();
          canvas?.forEachObject(function (obj) {
            obj.selectable = false;
          });

          drawRect(canvas);

          canvas?.requestRenderAll();
          break;

        default:
          break;
      }
    } else {
      canvas!.selection = true;
      canvas!.defaultCursor = "default";
      canvas!.hoverCursor = "all-scroll";
      canvas?.forEachObject(function (obj) {
        obj.selectable = true;
      });
      canvas.off("mouse:down");
      canvas.off("mouse:move");
      canvas.off("mouse:up");
      canvas?.requestRenderAll();
    }
  }, [canvas, currentTools, currentToolIndex]);

  return (
    <div
      {...props}
      className="overflow-hidden border-2 rounded-md z-[200] shadow border-primary-500"
    >
      {tools?.map((tool, i) => (
        <Row
          key={i}
          {...{
            index: i,
            currentToolIndex,
            setCurrentToolIndex,
            currentTools,
          }}
        >
          {tool?.tools?.length > 1 && (
            <Menu>
              {tool?.tools?.map((_tool, _i) => (
                <Item
                  key={_i}
                  tool={_tool}
                  onClick={() => {
                    const temp = [...currentTools];
                    temp[i] = _tool;
                    setCurrentTools(temp);
                    setCurrentToolIndex(i);
                  }}
                />
              ))}
            </Menu>
          )}
        </Row>
      ))}
    </div>
  );
};

export default Tools;
