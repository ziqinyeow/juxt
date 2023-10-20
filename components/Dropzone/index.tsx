"use client";

import { DivProps } from "@/lib/types/html";
import { useEffect, useState } from "react";
import { getYoutubeId, traverse } from "./utils";
import { useFile } from "@/lib/store/file";
import { useStore } from "@/lib/store";
import { nanoid } from "nanoid";

type Props = { projectId: string } & DivProps;

const Dropzone = ({ projectId, children, ...props }: Props) => {
  const [dragging, setDragging] = useState(false);
  const { projects, mergeBucket } = useStore();

  useEffect(() => {
    const handlePasteAnywhere = async (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const text = e.clipboardData.getData("Text");
      if (text.startsWith("https://www.youtube.com/")) {
        const id = getYoutubeId(text);
        if (id) {
          mergeBucket(projectId, {
            "/": [
              {
                id: nanoid(),
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
        mergeBucket(projectId, bucket);
      }
    };

    window.addEventListener("paste", handlePasteAnywhere);
    return () => {
      window.removeEventListener("paste", handlePasteAnywhere);
    };
  }, [projectId, mergeBucket]);
  // console.log(projects);

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
            mergeBucket(projectId, {
              "/": [
                {
                  id: nanoid(),
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
          mergeBucket(projectId, bucket);
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Dropzone;
