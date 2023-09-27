"use client";

import { DivProps } from "@/lib/types/html";
import { useEffect, useState } from "react";
import { getYoutubeId, traverse } from "./utils";
import { useFile } from "@/lib/store/file";

const Dropzone = ({ children, ...props }: DivProps) => {
  const [dragging, setDragging] = useState(false);
  const { bucket, mergeBucket } = useFile();

  useEffect(() => {
    const handlePasteAnywhere = async (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const text = e.clipboardData.getData("Text");
      if (text.startsWith("https://www.youtube.com/")) {
        const id = getYoutubeId(text);
        if (id) {
          mergeBucket({
            "/": [
              {
                dir: false,
                path: id + ".youtube",
                type: "youtube",
                url: text,
              },
            ],
          });
        }
        return;
      }

      const { bucket, files } = await traverse(e.clipboardData.items);
      if (bucket) {
        mergeBucket(bucket);
      }
    };

    window.addEventListener("paste", handlePasteAnywhere);
    return () => {
      window.removeEventListener("paste", handlePasteAnywhere);
    };
  }, [mergeBucket]);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
      }}
      onDrop={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        if (!e.dataTransfer) return;
        const text = e.dataTransfer.getData("Text");
        if (text.startsWith("https://www.youtube.com/")) {
          const id = getYoutubeId(text);
          if (id) {
            mergeBucket({
              "/": [
                {
                  dir: false,
                  type: "youtube",
                  path: id + ".youtube",
                  url: text,
                },
              ],
            });
          }
          return;
        }

        const { bucket, files } = await traverse(e.dataTransfer.items);
        if (bucket) {
          mergeBucket(bucket);
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Dropzone;
