"use client";

import { ButtonProps, DivProps } from "@/lib/types/html";
import { cn } from "@/lib/utils";
import { IconFolderFilled } from "@tabler/icons-react";
import React, { useState } from "react";
import Tooltip from "../Tooltip";
import { Database } from "lucide-react";
import { Tab, getTabIcon } from "./utils";

type SidebarButtonProps = {
  tooltip?: string;
} & ButtonProps;

export const SidebarButton = ({
  tooltip,
  className,
  children,
  ...props
}: SidebarButtonProps) => (
  <Tooltip className="text-[11px]" tooltip={tooltip} side="right">
    <button
      className={cn([
        "flex hover:bg-opacity-70 shadow transition-all hover:text-secondary-200/70 items-center justify-center w-full p-[10px] rounded bg-primary-500",
        className,
      ])}
      {...props}
    >
      {children}
    </button>
  </Tooltip>
);

const Sidebar = ({ className, ...props }: DivProps) => {
  const [tab, setTab] = useState<Tab>("bucket");

  return (
    <div
      {...props}
      className={cn([
        "w-full border-r border-primary-400 grid grid-cols-[70px_auto] bg-primary-700",
        className,
      ])}
    >
      <div className="flex flex-col w-full gap-4 p-4 border-r border-primary-400 text-secondary-200">
        <SidebarButton
          onClick={() => {
            setTab("bucket");
          }}
          tooltip="bucket"
          className={cn([
            tab === "bucket" && "ring ring-secondary-200 hover:ring-opacity-60",
          ])}
        >
          {getTabIcon("bucket")}
        </SidebarButton>
        <SidebarButton
          onClick={() => {
            setTab("explorer");
          }}
          tooltip="folder"
          className={cn([
            tab === "explorer" &&
              "ring ring-secondary-200 hover:ring-opacity-60",
          ])}
        >
          {getTabIcon("explorer")}
        </SidebarButton>
      </div>
      <div className="">
        <div className="flex items-center gap-3 p-4">
          <span className="text-secondary-200">{getTabIcon(tab)}</span>
          <span className="text-sm font-bold tracking-widest text-secondary-200">
            {tab.toUpperCase()}
          </span>
        </div>
        <div className="p-4">a</div>
      </div>
    </div>
  );
};

export default Sidebar;
