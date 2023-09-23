"use client";

import { DivProps } from "@/lib/types/html";
import { useEffect, useState } from "react";

const Dropzone = ({ children, ...props }: DivProps) => {
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const handlePasteAnywhere = (e: ClipboardEvent) => {
      //   console.log(e.clipboardData?.getData("Text"));
      if (!e.clipboardData) return;
      const files = e.clipboardData.files;
      if (files && files.length) {
        Array.from(files).forEach((file, i) => {
          const blob = URL.createObjectURL(file);
          console.log(blob);
        });
      } else if (e.clipboardData.getData("Text")) {
        const text = e.clipboardData.getData("Text");
        if (text.startsWith("https://www.youtube.com/")) {
          // handle youtube video
          console.log("youtube");
        }
      }
    };

    window.addEventListener("paste", handlePasteAnywhere);
    return () => {
      window.removeEventListener("paste", handlePasteAnywhere);
    };
  }, []);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!e.dataTransfer) return;
        const files = e.dataTransfer.files;
        if (files && files.length) {
          Array.from(files).forEach((file, i) => {
            const blob = URL.createObjectURL(file);
            console.log(blob);
          });
        } else if (e.dataTransfer.getData("Text")) {
          const text = e.dataTransfer.getData("Text");
          if (text.startsWith("https://www.youtube.com/")) {
            // handle youtube video
            console.log("youtube");
          }
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Dropzone;
