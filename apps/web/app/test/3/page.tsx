"use client";
import React, { useRef, useEffect, useState } from "react";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([]); // Array of points for each frame
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const drawPoints = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      const currentPoints = points[currentFrame] || [];

      currentPoints.forEach((point) => {
        context.beginPath();
        context.arc(point.x, point.y, 5, 0, Math.PI * 2);
        context.fillStyle = "#FF0000"; // Red color for points
        context.fill();
        context.closePath();
      });
    };

    const handleFrameChange = () => {
      setCurrentFrame(Math.floor(video.currentTime * 30)); // Assuming 30 frames per second
    };

    video.addEventListener("timeupdate", handleFrameChange);

    return () => {
      video.removeEventListener("timeupdate", handleFrameChange);
    };
  }, [currentFrame, points]);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const updatedPoints = [...(points[currentFrame] || []), { x, y }];
    const updatedFrames = [...points];
    updatedFrames[currentFrame] = updatedPoints;

    setPoints(updatedFrames);
  };

  return (
    <div>
      <video
        ref={videoRef}
        controls
        width={400}
        src="/track.mp4"
        onLoadedMetadata={() => {
          setPoints(
            new Array(Math.floor(videoRef.current.duration * 30)).fill([])
          );
        }}
      />
      <canvas
        ref={canvasRef}
        width={400} // Set canvas width as video width
        height={300} // Set canvas height as video height
        onClick={handleCanvasClick}
      />
      <input
        type="range"
        min={0}
        max={Math.floor(videoRef.current?.duration * 30) || 0}
        value={currentFrame}
        onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
      />
    </div>
  );
};

export default VideoPlayer;
