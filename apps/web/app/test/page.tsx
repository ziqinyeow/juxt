"use client";

import Canvas from "@/components/Canvas";
import Tools from "@/components/Canvas/tools";
import Panel from "@/components/Panel";
import { Slider } from "@/ui/slider";
import Layout from "@/layout/layout";
import { isHtmlVideoElement } from "@/lib/utils/html";
import { useCallback, useEffect, useState } from "react";
import useKeyboardJs from "react-use/lib/useKeyboardJs";

const fps = 30;

export default function Home() {
  const [space] = useKeyboardJs("space");
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(false);
  const [currentTimeInMs, setCurrentTimeInMs] = useState(0);

  const playframes = useCallback(() => {
    const start = performance.now();
    requestAnimationFrame(() => {
      playframes();
    });
  }, []);

  useEffect(() => {
    if (space) {
      setPlaying(!playing);
    }
  }, [space]);

  useEffect(() => {
    if (playing) {
    }
  }, [playing]);

  useEffect(() => {
    const video = document.getElementById("track");
    if (isHtmlVideoElement(video)) {
      video.currentTime = currentTimeInMs / 1000;
    }
  }, [currentTimeInMs]);

  return (
    <div className="relative flex flex-col items-center justify-center w-screen h-screen bg-black">
      <video id="track" src="/track.mp4"></video>
      <Slider
        onValueChange={(e) => {
          setCurrentTimeInMs(e[0]);
        }}
        min={0}
        max={30000}
        value={[currentTimeInMs]}
        className="w-[90%] h-32"
      />
    </div>
  );
}
