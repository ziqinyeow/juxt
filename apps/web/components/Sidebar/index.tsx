"use client";

import { ButtonProps, DivProps } from "@/lib/types/html";
import { cn } from "@/lib/utils";
import { IconFileUpload } from "@tabler/icons-react";
import React, { useMemo, useState } from "react";
import Tooltip from "../Tooltip";
import { Tab, getTabIcon } from "./utils";
import Explorer from "./Explorer";
import Media from "./Media";
import { useStore } from "@/lib/store";
import { BucketType } from "@/lib/types/file";
import Image from "next/image";

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
        "flex hover:bg-opacity-70 shadow transition-all dark:hover:text-secondary-200/70 items-center justify-center w-full p-[10px] rounded bg-light-300 dark:bg-primary-500",
        className,
      ])}
      {...props}
    >
      {children}
    </button>
  </Tooltip>
);

type Props = {
  projectId: string;
} & DivProps;

const Sidebar = ({ projectId, className, ...props }: Props) => {
  const {
    projects,
    fileURLCache,
    refreshTracks,
    canvas,
    mergeFileListToBucket,
  } = useStore();
  const [tab, setTab] = useState<Tab>("explorer");

  const bucket = useMemo(
    () => projects.find((project) => project.id === projectId),
    [projectId, projects]
  )?.bucket as BucketType;

  const medias = useMemo(
    () =>
      Object.values(bucket)
        .map((b) => {
          return b.filter((d) => d.type === "video" || d.type === "image");
        })
        .reduce(function (prev, next) {
          return prev.concat(next);
        })
        .filter((b) => b),
    [bucket]
  );

  return (
    <div
      {...props}
      className={cn([
        "w-full border-r dark:border-primary-400 grid grid-cols-[70px_auto] bg-white dark:bg-primary-700",
        className,
      ])}
    >
      {medias?.map((media, i) => (
        <div key={i} className="hidden">
          {media.type === "image" ? (
            <>
              <Image
                id={media.path}
                // src={media.url ?? ""}
                src={fileURLCache[media.id] ?? ""}
                width={0}
                height={0}
                className="z-0 hidden object-contain text-white rounded"
                alt={media.path}
                onLoad={() => {
                  refreshTracks(canvas);
                }}
              />
            </>
          ) : media.type === "video" ? (
            <>
              <video
                id={media.path}
                onLoad={() => {
                  refreshTracks(canvas);
                }}
                onLoadedData={() => {
                  refreshTracks(canvas);
                }}
                muted
                className="absolute z-[-10] opacity-0"
                // src={media.url ?? ""}
                src={fileURLCache[media.id] ?? ""}
              ></video>
            </>
          ) : (
            <></>
          )}
        </div>
      ))}
      <div className="flex flex-col w-full gap-4 p-4 border-r dark:border-primary-400 text-secondary-100 dark:text-secondary-200">
        <SidebarButton
          onClick={() => {
            setTab("explorer");
          }}
          tooltip="explorer"
          className={cn([
            tab === "explorer" &&
              "ring ring-secondary-100 dark:ring-secondary-200 hover:ring-opacity-60",
          ])}
        >
          {getTabIcon("explorer")}
        </SidebarButton>
        <SidebarButton
          onClick={() => {
            setTab("media");
          }}
          tooltip="media"
          className={cn([
            tab === "media" &&
              "ring ring-secondary-100 dark:ring-secondary-200 hover:ring-opacity-60",
          ])}
        >
          {getTabIcon("media")}
        </SidebarButton>
      </div>
      <div className="">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <span className="text-secondary-100 dark:text-secondary-200">
              {getTabIcon(tab)}
            </span>
            <span className="text-sm font-bold tracking-widest text-secondary-100 dark:text-secondary-200">
              {tab.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <label htmlFor="upload-2">
              <input
                id="upload-2"
                onChange={(e) => {
                  mergeFileListToBucket(projectId, e.target.files);
                }}
                type="file"
                name="upload-2"
                className="hidden"
                multiple
              />
              <Tooltip tooltip={"files"} className="py-1 text-[11px]">
                <div className="p-1 rounded cursor-pointer hover:bg-light-300 dark:hover:bg-primary-500">
                  <IconFileUpload className="w-[17px] h-[17px] text-secondary-100/90 dark:text-secondary-200/90" />
                </div>
              </Tooltip>
            </label>
          </div>
        </div>
        <div>
          {tab === "explorer" && <Explorer projectId={projectId} />}
          {tab === "media" && <Media projectId={projectId} />}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;