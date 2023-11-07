"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  IconBackspace,
  IconEye,
  IconGripVertical,
  IconSearch,
} from "@tabler/icons-react";
import clsx from "clsx";
import "./style.css";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button, ToolbarButton } from "@/components/Button";
import { Redo2, ScissorsLineDashed, Trash, Undo2, Unlock } from "lucide-react";
import Track from "./track";
import Slider from "./slider";
import {
  getNumberOfTicks,
  getTicksGapWidth,
  showSecondsOnPanelTickLogic,
} from "./utils";
import type { Cursor } from "@/lib/types/cursor";
import CursorDropdown from "./cursor-dropdown";
import Tooltip from "../Tooltip";
import { useOperatingSystem } from "@/lib/hooks/useOperatingSystem";
import Seeker from "./seeker";
import useKeyboardJs from "react-use/lib/useKeyboardJs";

const Panel = ({ projectId }: { projectId: string }) => {
  const os = useOperatingSystem();
  const [backspace] = useKeyboardJs("backspace");
  // const { bucket } = useFile();

  const {
    projects,
    canvas,
    panelScale,
    hidePanel,
    // setHidePanel,
    selectedElement,
    removeTrackAndElement,
    setSelectedElement,
    addPanelScale,
    maxTime,
  } = useStore();

  const tracks = useMemo(
    () => projects.find((project) => project.id === projectId)?.tracks,
    [projects, projectId]
  );

  // const [hidePanel, setHidePanel] = useState(false);
  const [cursor, setCursor] = useState<Cursor>("pointer");
  // console.log(Number(getNumberOfTicks(maxTime, panelScale).toFixed(0)));
  useEffect(() => {
    if (backspace && selectedElement.length !== 0) {
      removeTrackAndElement(selectedElement.map((s) => s.id));
      canvas?.discardActiveObject();
      setSelectedElement([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backspace]);

  return (
    <div
      className={clsx([
        "relative h-full w-full min-w-[300px] flex flex-col bg-light-100 dark:bg-primary-600 text-black dark:text-primary-100",
      ])}
    >
      <div className="absolute w-full h-1 transition-all -top-1 hover:bg-secondary-100 dark:hover:bg-secondary-200 bg-light-100 dark:bg-primary-400 cursor-row-resize"></div>
      <Seeker />

      <div className="h-[50px] bg-light-300 dark:bg-primary-400 border-b border-light-400 dark:border-primary-400 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center w-full gap-4">
          <CursorDropdown cursor={cursor} setCursor={setCursor} />
          <div className="flex gap-1 p-1 bg-white rounded dark:bg-primary-500">
            <Tooltip tooltip={`undo (${os === "mac" ? "cmd" : "ctrl"} + z)`}>
              <ToolbarButton disabled>
                <Undo2 className="w-4 h-4" />
              </ToolbarButton>
            </Tooltip>
            <Tooltip tooltip={`redo (${os === "mac" ? "cmd" : "ctrl"} + y)`}>
              <ToolbarButton disabled={true}>
                <Redo2 className="w-4 h-4" />
              </ToolbarButton>
            </Tooltip>
          </div>
          <div className="flex gap-1 p-1 bg-white rounded dark:bg-primary-500">
            <Tooltip tooltip={`trim (T)`}>
              <ToolbarButton disabled>
                <ScissorsLineDashed className="w-4 h-4 rotate-[270deg]" />
              </ToolbarButton>
            </Tooltip>
            <Tooltip
              tooltip={
                <span className="flex">
                  delete <IconBackspace className="w-4 h-4" />
                </span>
              }
            >
              <ToolbarButton disabled>
                <Trash className="w-4 h-4" />
              </ToolbarButton>
            </Tooltip>
          </div>
        </div>
        <div className="flex items-center justify-center w-full gap-4 px-4"></div>
        <div className="flex items-center justify-end w-full gap-4">
          {!hidePanel && <Slider className="w-8 md:w-24" />}
        </div>
      </div>

      {!hidePanel && (
        <>
          <div
            onWheel={(e) => {
              if (e.metaKey) {
                const val = Number((e.deltaY * 0.1).toFixed(0));
                addPanelScale(val + (val % 2));
              }
            }}
            className="relative h-[220px] w-[calc(100vw_-_300px)] overflow-y-auto panel_scrollbar flex"
          >
            <div className="bg-light-100 dark:bg-primary-500 grid grid-rows-[36px_auto] panel_scrollbar">
              <div className="sticky top-0 z-50 grid grid-cols-[200px_auto] border-b bg-light-200 dark:bg-primary-600 border-light-400 dark:border-primary-400">
                <div className="sticky left-0 z-50 flex items-end h-full gap-3 px-4 pb-2 border-r bg-light-200 dark:bg-primary-600 border-light-400 dark:border-primary-400">
                  <IconSearch className="w-4 h-4 stroke-[4px] text-primary-200" />
                  <input
                    className="w-full tracking-widest bg-light-200 dark:bg-primary-600 focus:outline-none"
                    type="text"
                    placeholder="Search"
                  />
                </div>
                <div
                  style={{ gap: `${getTicksGapWidth(panelScale)}px` }}
                  className="relative flex items-end h-full px-4 pb-2 select-none"
                >
                  {Array(
                    Number(getNumberOfTicks(maxTime, panelScale).toFixed(0))
                  )
                    .fill(1)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="flex flex-col relative items-center gap-[0.5px]"
                      >
                        <div
                          className={cn([
                            showSecondsOnPanelTickLogic(i, panelScale)
                              ? "text-[8px] whitespace-nowrap absolute -top-4 text-primary-300 dark:text-primary-200"
                              : "hidden",
                          ])}
                        >
                          {((i * 10) / panelScale).toFixed(0)} s
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
              <div className="w-full grid grid-cols-[200px_auto]">
                <div className="sticky left-0 z-40 pt-2 border-r dark:bg-primary-500 border-light-400 bg-light-200 dark:border-primary-400">
                  {tracks?.map((track, i) => (
                    <div
                      className="relative px-2 py-4 border-b border-light-400 dark:border-primary-400"
                      key={i}
                    >
                      <div className="flex items-center justify-between h-[23px] gap-2 px-2 text-primary-400 dark:text-primary-200">
                        <div className="flex items-center gap-2">
                          <IconGripVertical className="w-4 h-4 text-primary-400 dark:text-primary-200/80 cursor-grab" />
                          <div className="w-24 line-clamp-1">{track.name}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Unlock className="w-4 h-4 cursor-not-allowed text-primary-400 dark:text-primary-200/50" />
                          <IconEye className="w-5 h-5 cursor-not-allowed text-primary-400 dark:text-primary-200/50" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-full px-4 pt-2">
                  {tracks?.map((track, i) => (
                    <div key={i} className="py-4">
                      <Track className="relative h-6" track={track} />
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
