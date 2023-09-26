"use client";

import { ButtonProps, DivProps } from "@/lib/types/html";
import { cn } from "@/lib/utils";
import {
  IconFile,
  IconFileImport,
  IconFileUpload,
  IconFolderFilled,
  IconFolderUp,
  IconPlus,
} from "@tabler/icons-react";
import React, { useState } from "react";
import Tooltip from "../Tooltip";
import { Database, FolderUp } from "lucide-react";
import { Tab, getTabIcon } from "./utils";
import Explorer from "../Explorer";
import { Button } from "../Button";
import { useFile } from "@/lib/store/file";

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
  const { mergeFileListToBucket } = useFile();
  const [tab, setTab] = useState<Tab>("explorer");

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
        <SidebarButton
          onClick={() => {
            setTab("search");
          }}
          tooltip="search"
          className={cn([
            tab === "search" && "ring ring-secondary-200 hover:ring-opacity-60",
          ])}
        >
          {getTabIcon("search")}
        </SidebarButton>
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
      </div>
      <div className="">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <span className="text-secondary-200">{getTabIcon(tab)}</span>
            <span className="text-sm font-bold tracking-widest text-secondary-200">
              {tab.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <label htmlFor="upload-2">
              <input
                id="upload-2"
                onChange={(e) => {
                  mergeFileListToBucket(e.target.files);
                }}
                type="file"
                name="upload-2"
                className="hidden"
                multiple
              />
              <Tooltip tooltip={"files"} className="py-1 text-[11px]">
                <div className="p-1 rounded cursor-pointer hover:bg-primary-500">
                  <IconFileUpload className="w-[17px] h-[17px] text-secondary-200/90" />
                </div>
              </Tooltip>
            </label>
            {/* <Tooltip tooltip={"folder"} className="py-1 text-[11px]">
              <Button>
                <FolderUp className="w-[17px] h-[17px] text-secondary-200/90" />
              </Button>
            </Tooltip> */}
          </div>
        </div>
        {tab === "explorer" && <Explorer />}
      </div>
    </div>
  );
};

export default Sidebar;
