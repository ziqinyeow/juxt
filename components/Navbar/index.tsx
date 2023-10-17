"use client";

import { DivProps } from "@/lib/types/html";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "@/components/Button";
import { IconBellRinging2, IconSettings } from "@tabler/icons-react";
import Tooltip from "@/components/Tooltip";
import Logo from "@/components/Logo";
import { usePathname } from "next/navigation";
import ProjectDropdown from "./ProjectDropdown";

const Navbar = ({ className, ...props }: DivProps) => {
  const pathname = usePathname();
  return (
    <div
      {...props}
      className={cn([
        "w-full h-16 border-b px-4 flex items-center gap-4 justify-between border-primary-400 bg-primary-700",
        className,
      ])}
    >
      <div className="flex items-center gap-8">
        <Logo />
        {pathname !== "/" && <ProjectDropdown />}
      </div>
      <div className="flex items-center gap-2">
        <Tooltip tooltip={`notification`}>
          <Button>
            <IconBellRinging2 className="w-5 h-5 text-primary-100" />
          </Button>
        </Tooltip>
        <Tooltip tooltip={`settings`}>
          <Button>
            <IconSettings className="w-5 h-5 text-primary-100" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Navbar;
