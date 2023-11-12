"use client";
import React, { useRef, useState } from "react";
// import "./VideoPlayer.css";

const playframes = () => {};

const VideoPlayer = () => {
  const [currentKeyframe, setCurrentKeyframe] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // console.log(currentTime, videoRef.current?.playbackRate);
  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef.current?.play();
      setIsPlaying(true);
    }
  };
  const handleTimeUpdate = () => {
    setCurrentTime((videoRef.current?.currentTime ?? 1) * 1000);
  };
  const handleDurationChange = () => {
    setDuration(videoRef.current?.duration ?? 1);
  };
  const handleVolumeChange = (event: any) => {
    setVolume(event.target.value);
    // @ts-ignore
    videoRef.current.volume = event.target.value;
  };
  const handleSeek = (event: any) => {
    // @ts-ignore
    videoRef.current.currentTime = event.target.value / 1000;
  };
  return (
    <div className="video-player">
      <>{currentTime}</>
      <video
        ref={videoRef}
        src="/track.mp4"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleDurationChange}
      />
      <div className="controls">
        <button onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <input
          className="w-[800px]"
          type="range"
          min="0"
          max={duration * 1000}
          value={currentTime}
          onChange={handleSeek}
        />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};
export default VideoPlayer;
