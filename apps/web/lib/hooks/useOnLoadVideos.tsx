"use client";
import { useState, useEffect, RefObject } from "react";

export const useOnLoadVideos = (ref: RefObject<HTMLElement>) => {
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const updateStatus = (images: HTMLVideoElement[]) => {
      setStatus(
        images
          .map((image) => image.readyState >= 0)
          .every((item) => item === true)
      );
    };

    if (!ref?.current) return;

    const imagesLoaded = Array.from(ref.current.querySelectorAll("video"));

    if (imagesLoaded.length === 0) {
      setStatus(true);
      return;
    }

    imagesLoaded.forEach((image) => {
      // console.log(image.readyState);
      image.addEventListener("load", () => updateStatus(imagesLoaded), {
        once: true,
      });
      image.addEventListener("error", () => updateStatus(imagesLoaded), {
        once: true,
      });
    });

    return;
  }, [ref]);

  return status;
};
