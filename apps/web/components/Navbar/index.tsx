"use client";

import { DivProps } from "@/lib/types/html";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "@/components/Button";
import {
  IconBellRinging2,
  IconMoonStars,
  IconSettings,
  IconSun,
} from "@tabler/icons-react";
import Tooltip from "@/components/Tooltip";
import Logo from "@/components/Logo";
import { usePathname } from "next/navigation";
import ProjectDropdown from "./ProjectDropdown";
import { useTheme } from "next-themes";

const Navbar = ({ className, ...props }: DivProps) => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <div
      {...props}
      className={cn([
        "w-full h-16 border-b px-4 flex items-center gap-4 justify-between bg-white dark:border-primary-400 dark:bg-primary-700",
        className,
      ])}
    >
      <div className="flex items-center gap-8">
        <Logo />

        {pathname !== "/" && pathname !== "/404" && <ProjectDropdown />}
      </div>
      <div className="flex items-center gap-2">
        <Tooltip tooltip={`notification`}>
          <Button>
            <IconBellRinging2 className="w-5 h-5 text-primary-800 dark:text-primary-100" />
          </Button>
        </Tooltip>
        <Tooltip tooltip={`settings`}>
          <Button>
            <IconSettings className="w-5 h-5 text-primary-800 dark:text-primary-100" />
          </Button>
        </Tooltip>
        {theme === "light" ? (
          <Tooltip tooltip={`dark`}>
            <Button
              onClick={() => {
                setTheme("dark");
              }}
            >
              <IconMoonStars className="w-5 h-5 text-primary-800 dark:text-primary-100" />
            </Button>
          </Tooltip>
        ) : (
          <Tooltip tooltip={`light`}>
            <Button
              onClick={() => {
                setTheme("light");
              }}
            >
              <IconSun className="w-5 h-5 text-primary-800 dark:text-primary-100" />
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default Navbar;
