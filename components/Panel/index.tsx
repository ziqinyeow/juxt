"use client";

import React, { useCallback, useState } from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconEye,
  IconGripVertical,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconRewindBackward5,
  IconRewindForward5,
  IconSearch,
  IconTrack,
} from "@tabler/icons-react";
import { ButtonProps, DivProps } from "@/lib/types/html";
import clsx from "clsx";
import "./style.css";
import { useStore } from "@/lib/store";
import { cn, formatTimeToMinSec, formatTimeToMinSecMili } from "@/lib/utils";
import { Button } from "./button";
import Element from "./element";
import { Unlock } from "lucide-react";
import Track from "./track";

const tracks = [
  {
    name: "track 1",
    icon: "",
    type: "text",
    color: "bg-element-1",
  },
  {
    name: "track 2",
    icon: "",
    type: "video",
    color: "bg-element-2",
  },
  {
    name: "track 3",
    icon: "",
    type: "image",
    color: "bg-element-3",
  },
  {
    name: "track 4",
    icon: "",
    type: "bbox",
    color: "bg-element-4",
  },
  {
    name: "track 5",
    icon: "",
    type: "pose",
    color: "bg-element-5",
  },
  {
    name: "track 5",
    icon: "",
    type: "image",
    color: "bg-element-3",
  },
];

const Panel = () => {
  const {
    playing,
    maxTime,
    getCurrentTimeInMs,
    setCurrentTimeInMs,
    rewindCurrentTimeInMs,
  } = useStore();
  const [panelScale, setPanelScale] = useState(5);
  const [hidePanel, setHidePanel] = useState(false);

  const rewindBackward5 = () => rewindCurrentTimeInMs(5000, false);
  const play = () => {};
  const rewindForward5 = () => rewindCurrentTimeInMs(5000, true);
  const toggleHidePanel = () => setHidePanel((p) => !p);

  return (
    <div
      className={clsx([
        "relative h-full w-full min-w-[500px] flex flex-col bg-primary-600 text-primary-100",
      ])}
    >
      <div className="absolute w-full h-1 transition-all -top-1 hover:bg-secondary-200 bg-primary-400 cursor-row-resize"></div>
      <div className="h-[40px] bg-primary-400 px-4 flex items-center justify-between">
        <div className="w-full select-none">
          <span>{formatTimeToMinSecMili(getCurrentTimeInMs())}</span> /{" "}
          <span className="text-white/70">
            {formatTimeToMinSecMili(maxTime)}
          </span>
        </div>
        <div className="flex items-center justify-center w-full gap-4 px-4">
          <Button onClick={rewindBackward5} className="text-white">
            <IconRewindBackward5 className="w-4 h-4" />
          </Button>
          <Button onClick={play} className="text-secondary-200">
            {playing ? (
              <IconPlayerPauseFilled className="w-5 h-5" />
            ) : (
              <IconPlayerPlayFilled className="w-5 h-5" />
            )}
          </Button>
          <Button onClick={rewindForward5} className="text-white">
            <IconRewindForward5 className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center justify-end w-full">
          <Button onClick={toggleHidePanel} className="text-secondary-200">
            {hidePanel ? (
              <IconChevronUp className="w-4 h-4" />
            ) : (
              <IconChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
      {!hidePanel && (
        <>
          <div className="h-[calc(100%_-_50px)] relative min-h-[300px] overflow-y-auto panel_scrollbar max-h-[350px] flex">
            <div className="bg-primary-500 grid grid-rows-[36px_auto] overflow-x-auto panel_scrollbar">
              <div className="sticky top-0 z-50 flex items-end border-b bg-primary-600 border-primary-400">
                <div className="w-[200px] sticky z-50 bg-primary-600 pb-2 border-r border-primary-400 left-0 flex items-end gap-3 px-4 h-full">
                  <IconSearch className="w-4 h-4 stroke-[4px] text-primary-200 " />
                  <input
                    className="w-full tracking-widest bg-primary-600 focus:outline-none"
                    type="text"
                    placeholder="Search"
                  />
                </div>
                <div
                  style={{ gap: `${(120 + panelScale * 10) / panelScale}px` }}
                  className="relative flex items-end w-full h-full px-4 pb-2 select-none"
                >
                  {/* <div className="absolute left-0 w-1 h-full bg-white" /> */}
                  {Array((maxTime / 1000 + 5) * panelScale)
                    .fill(1)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center gap-[0.5px]"
                      >
                        <div
                          className={cn([
                            i % panelScale === 0
                              ? "text-[8px] text-primary-200"
                              : "hidden",
                          ])}
                        >
                          {i / panelScale}
                        </div>
                        <div
                          className={cn([
                            "w-[0.1px] bg-primary-200",
                            i % panelScale == 0 ? "h-2" : "h-1",
                          ])}
                        ></div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex w-full">
                <div className="w-[200px] sticky z-40 left-0 pt-2 border-r bg-primary-500 border-primary-400">
                  {tracks?.map((track, i) => (
                    <div
                      className="relative px-2 py-4 border-b border-primary-400"
                      key={i}
                    >
                      <div className="flex items-center justify-between h-6 gap-2 px-2 text-primary-200">
                        <div className="flex items-center gap-2">
                          <IconGripVertical className="w-4 h-4 text-primary-200/80 cursor-grab" />
                          {/* <IconTrack className="w-5 h-5" /> */}
                          <div>Track {i + 1}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Unlock className="w-4 h-4 cursor-not-allowed text-primary-200/50" />
                          <IconEye className="w-5 h-5 cursor-not-allowed text-primary-200/50" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-full px-4 pt-2">
                  {tracks?.map((track, i) => (
                    <div className="relative py-4" key={i}>
                      <div className="flex h-6 ">
                        <Track element={track} />
                        {/* <Element element={track} /> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Panel;
