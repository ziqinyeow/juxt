"use client";

import { DivProps } from "@/lib/types/html";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { Button } from "@/components/Button";
import {
  IconBellRinging2,
  IconBoxAlignBottomLeft,
  IconMoonStars,
  IconRobot,
  IconSettings,
  IconSun,
  IconTrack,
  IconYoga,
} from "@tabler/icons-react";
import Tooltip from "@/components/Tooltip";
import Logo from "@/components/Logo";
import { usePathname } from "next/navigation";
import ProjectDropdown from "./ProjectDropdown";
import { useTheme } from "next-themes";
import useSWR from "swr";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { WEBSOCKET_URL } from "@/lib/constants";
import { useStore } from "@/lib/store";

// @ts-ignore
const fetcher = (...args: any) => fetch(...args).then((res) => res.json());

const Navbar = ({ className, ...props }: DivProps) => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { setSendWebsocketMessage, setLastWebsocketMessage, addPose } =
    useStore();
  const { data, error, isLoading } = useSWR("/api/healthchecker", fetcher);
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `${WEBSOCKET_URL}/ws`
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "connecting",
    [ReadyState.OPEN]: "connected",
    [ReadyState.CLOSING]: "closing",
    [ReadyState.CLOSED]: "closed",
    [ReadyState.UNINSTANTIATED]: "uninstantiated",
  }[readyState];

  useEffect(() => {
    if (readyState === 1) {
      setSendWebsocketMessage(sendMessage);
    }
  }, [readyState, sendMessage, setSendWebsocketMessage]);

  useEffect(() => {
    if (readyState === 1) {
      setLastWebsocketMessage(lastMessage);
    }
  }, [readyState, lastMessage, setLastWebsocketMessage]);

  useEffect(() => {
    try {
      if (lastMessage) {
        const data = JSON.parse(lastMessage?.data ?? "{}");
        console.log(
          "added pose to video id -> ",
          data.id,
          "pose estimation result -> ",
          data
        );
        addPose(data.id, {
          bboxes: data.bboxes,
          kpts: data.kpts,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [lastMessage]);

  // console.log("navbar refresh", connectionStatus);

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
        <Tooltip
          tooltip={
            <div className="flex items-center flex-col">
              <div className="w-full grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  {/* <IconBoxAlignBottomLeft className="w-3 h-3" /> */}
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  <div>detector:</div>
                </div>
                <div>{data?.config?.det}</div>
              </div>
              <div className="w-full grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  {/* <IconTrack className="w-3 h-3" /> */}
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  <div>tracker:</div>
                </div>
                <div>{data?.config?.tracker}</div>
              </div>
              <div className="w-full grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  {/* <IconYoga className="w-3 h-3" /> */}
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  <div>pose:</div>
                </div>
                <div>{data?.config?.pose}</div>
              </div>
            </div>
          }
        >
          <Button className="flex items-center gap-2 px-4">
            <div
              className={cn([
                "w-2 h-2 rounded-full",
                readyState === 1 ? "bg-green-400" : "bg-red-400",
              ])}
            ></div>
            <div className="font-mono">inference {connectionStatus}</div>
            {/* <IconRobot className="w-5 h-5 text-primary-800 dark:text-primary-100" /> */}
          </Button>
        </Tooltip>
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
