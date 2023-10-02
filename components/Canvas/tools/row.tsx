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
import { DivProps } from "@/lib/types/html";

const Row = ({ tools, className, ...props }: { tools: Tools } & DivProps) => {
  return (
    <>
      <div className="flex items-center gap-1 p-1 bg-primary-800">
        <Button className={cn(["text-secondary-200 p-2 hover:bg-black"])}>
          {tools?.tools[0].icon}
        </Button>
        {tools?.tools?.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="focus:outline-none">
              <span className="data-[state=open]:rotate-180 transition duration-200">
                <Button className="p-2 text-white hover:text-secondary-200">
                  <ChevronLeft className="w-3 h-3" />
                </Button>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              sideOffset={8}
              className="flex items-center gap-1 p-1 tracking-widest text-white border-0 bg-primary-600 hover:bg-primary-600"
            >
              {tools?.tools?.map((tool, i) => (
                <DropdownMenuItem
                  key={i}
                  className={cn([
                    "p-2 focus:bg-black !text-white hover:!text-secondary-200 focus:!text-secondary-200 cursor-pointer",
                  ])}
                >
                  {tool?.icon}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </>
  );
};

export default Row;
