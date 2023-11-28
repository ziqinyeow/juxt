"use client";

import { ButtonProps, DivProps } from "@/lib/types/html";
import { cn } from "@/lib/utils";
import { IconFileUpload } from "@tabler/icons-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Tooltip from "../Tooltip";
import { Tab, getTabIcon } from "./utils";
import Explorer from "./Explorer";
import Media from "./Media";
import { useStore } from "@/lib/store";
import { BucketType } from "@/lib/types/file";
import Image from "next/image";
import ChartModal from "../Modal/ChartModal";
import { useOnLoadImages } from "@/lib/hooks/useOnLoadImages";

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
  const [openChartModal, setOpenChartModal] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imagesLoaded = useOnLoadImages(wrapperRef);

  useEffect(() => {
    if (imagesLoaded) {
      console.log("image loaded, refresh track");
      refreshTracks();
    }
  }, [imagesLoaded, refreshTracks]);

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
      ref={wrapperRef}
      {...props}
      className={cn([
        "w-full border-r dark:border-primary-400 grid grid-cols-[70px_auto] bg-white dark:bg-primary-700",
        className,
      ])}
    >
      <>
        {
          <Image
            src={"/vercel.svg"}
            width={0}
            height={0}
            className="z-0 absolute text-white"
            alt={"loader"}
            onLoad={() => {
              // refreshTracks();
            }}
          />
        }
      </>
      {medias?.map((media, i) => (
        <div key={i} className="absolute z-[-10]">
          {media.type === "image" ? (
            <>
              {fileURLCache[media.id] && (
                <Image
                  id={media.path}
                  // src={media.url ?? ""}
                  src={fileURLCache[media.id]?.url ?? ""}
                  width={0}
                  height={0}
                  className="z-0 hidden object-contain text-white rounded"
                  alt={media.path}
                  onLoad={() => {
                    if (i == medias.length - 1) {
                      // refreshTracks();
                    }
                  }}
                />
              )}
            </>
          ) : media.type === "video" ? (
            <>
              <video
                id={media.path}
                onLoad={() => {
                  // refreshTracks();
                }}
                onLoadedData={() => {
                  // refreshTracks();
                }}
                muted
                className="absolute z-[-10] opacity-0"
                // src={media.url ?? ""}
                src={fileURLCache[media.id]?.url ?? ""}
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
        <SidebarButton
          onClick={() => {
            // setTab("chart");
            setOpenChartModal(true);
          }}
          tooltip="chart"
          className={cn([
            "active:ring ring-secondary-100 dark:ring-secondary-200",
          ])}
        >
          {getTabIcon("chart")}
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
          <ChartModal
            open={openChartModal}
            setOpen={setOpenChartModal}
            onClose={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
