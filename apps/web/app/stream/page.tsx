"use client";

import { useEffect, useState } from "react";

const WebSocketComponent = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [keypoints, setKeypoints] = useState<any[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8000/ws");

    newSocket.onmessage = (event) => {
      // console.log(event.data);
      const json = JSON.parse(event.data);
      setKeypoints((p) => [...p, json.kpts]);
      // setMessages((p) => [...p, `${json.kpts}`]);
    };

    newSocket.onerror = (event) => {
      // console.log("error", event);
    };

    newSocket.onclose = () => {
      console.log("socket closed");
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  function processVideo() {
    if (!file) return;
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.muted = true;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const reader = new FileReader();

    function extractFrame() {
      if (video.paused || video.ended) {
        console.log("ended");
        return;
      }
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert the canvas data to a buffer
      canvas.toBlob(function (blob: any) {
        reader.onload = function () {
          const buffer = reader.result as ArrayBuffer;
          console.log("buffer:", buffer);
          socket?.send(buffer);

          requestAnimationFrame(extractFrame);
        };

        reader.readAsArrayBuffer(blob);
      }, "image/jpeg");
    }
    video.onloadeddata = function () {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };
    video.oncanplay = () => {
      video.play();
      extractFrame();
    };
  }

  const handleSendSocket = async () => {
    processVideo();
    // if (file) {
    //   socket?.send(file);
    // }
  };

  // const handleSendMessage = async () => {
  //   if (file) {
  //     const formData = new FormData();
  //     formData.append("file", file, file.name);
  //     const fetcher = await fetch(`http://127.0.0.1:8000/upload`, {
  //       method: "POST",
  //       body: formData,
  //     });
  //     const data = await fetcher.json();
  //     console.log(data);
  //   }
  // };

  return (
    <div className="flex flex-col items-center gap-5 justify-center w-full h-[100vh]">
      <h1 className="text-2xl font bold">
        web socket frame stream + coordinates
      </h1>
      <div>
        <div className="flex flex-col gap-2">
          {keypoints.map((keypoint, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="">Frame {index + 1}</div>
              <div className="overflow-x-auto font-mono break-all line-clamp-6 w-80 bg-light-300">
                {keypoint ?? "---"}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="file"
          onChange={(e) => {
            if (e.target?.files) {
              setFile(e.target.files[0]);
            }
          }}
        />
        <button
          onClick={handleSendSocket}
          className="px-3 py-1 rounded bg-light-300 hover:bg-light-400"
        >
          Stream
        </button>
        {/* <button onClick={handleSendMessage}>Send POST</button> */}
      </div>
    </div>
  );
};

export default WebSocketComponent;
