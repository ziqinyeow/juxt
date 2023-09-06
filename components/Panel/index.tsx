"use client";

import React, { useState } from "react";
import {
  IconChevronDown,
  IconChevronUp,
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
import { Element } from "./element";

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
  // const [playing, setPlaying] = useState(false);
  // const [currentMs, setCurrentMs] = useState("00:00:00");
  const [panelScale, setPanelScale] = useState(5);
  const [hidePanel, setHidePanel] = useState(false);

  const rewindBackward5 = () => {
    rewindCurrentTimeInMs(5000, false);
  };
  const play = () => {};
  const rewindForward5 = () => {
    rewindCurrentTimeInMs(5000, true);
  };
  const toggleHidePanel = () => {
    setHidePanel((p) => !p);
  };

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
            <div className="min-w-[200px] bg-primary-500 grid grid-rows-[36px_auto]">
              <div className="sticky top-0 z-50 flex items-end gap-3 px-4 pb-2 border-b border-r bg-primary-600 border-primary-400 h-9">
                <IconSearch className="w-4 h-4 stroke-[4px] text-primary-200 " />
                <input
                  className="w-full tracking-widest bg-primary-600 focus:outline-none"
                  type="text"
                  placeholder="Search"
                />
              </div>
              <div className="pt-2 border-r border-primary-400">
                {tracks?.map((track, i) => (
                  <div
                    className="relative px-2 py-4 border-b border-primary-400"
                    key={i}
                  >
                    <div className="flex items-center h-6 gap-2 px-2 text-primary-200">
                      <IconTrack className="w-5 h-5" />
                      <div>Track {i + 1}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid relative grid-rows-[36px_auto] w-full overflow-x-auto panel_scrollbar">
              {/* tick */}
              <div
                className="sticky top-0 z-50 flex items-end px-4 pb-2 border-b select-none border-primary-400 h-9 bg-primary-500"
                style={{ gap: `${(120 + panelScale * 10) / panelScale}px` }}
              >
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
              <div className="px-4 pt-2">
                {tracks?.map((track, i) => (
                  <div className="relative py-4" key={i}>
                    <div className="h-6">
                      <Element element={track} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Panel;
