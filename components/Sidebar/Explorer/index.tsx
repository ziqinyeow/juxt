import "./style.css";
import {
  Node,
  createFileTree,
  isDir,
  isFile,
  useDnd,
  useHotkeys,
  useObserver,
  useRovingFocus,
  useSelections,
  useTraits,
  useVirtualize,
} from "exploration";
import { useFile } from "@/lib/store/file";
import { FileWithPath } from "@/lib/types/file";
import React, { useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { IconFolderFilled } from "@tabler/icons-react";
import { getFileIcon } from "./utils";
import Droparea from "../droparea";
import { useStore } from "@/lib/store";
import Image from "next/image";

const Explorer = () => {
  const windowRef = useRef<HTMLDivElement | null>(null);
  const { canvas, addImage, addVideo, refreshTracks } = useStore();
  const { bucket } = useFile();

  const tree = useMemo(
    () =>
      createFileTree((parent, { createFile, createDir }) =>
        Promise.resolve(
          bucket[parent.data.name].map((file: FileWithPath) => {
            if (file.dir) {
              return createDir({ name: file?.path });
            }
            return createFile({
              name: file?.path,
            });
          })
        )
      ),
    [bucket]
  );

  const rovingFocus = useRovingFocus(tree);
  const selections = useSelections(tree);
  const traits = useTraits(tree, ["selected", "focused", "drop-target"]);
  const dnd = useDnd(tree, { windowRef });
  const virtualize = useVirtualize(tree, { windowRef, nodeHeight: 24 });
  const plugins = [traits, rovingFocus, selections, dnd];
  // useHotkeys(tree, { windowRef, rovingFocus, selections });

  useObserver(selections.didChange, (value) => {
    const selected = Array.from(value);
    traits.set("selected", selected);

    if (selected.length === 1) {
      const node = tree.getById(selected[0]);

      if (node && isFile(node)) {
        const parent = node.parent?.data.name ?? "";
        const file = bucket?.[parent]?.find((b) => b.path === node.data.name);

        if (file?.type === "image") {
          addImage(file);
        } else if (file?.type === "video") {
          addVideo(file);
        }
      }
    }
  });

  useObserver(rovingFocus.didChange, (value) => {
    traits.set("focused", [value]);
  });

  useObserver(dnd.didChange, (event) => {
    if (!event) return;

    if (event.type === "enter" || event.type === "expanded") {
      if (event.node.parentId === event.dir.id) {
        return traits.clear("drop-target");
      }

      const nodes = event.dir.nodes ? [...event.dir.nodes] : [];
      const nodeIds: number[] = [event.dir.id, ...nodes];
      let nodeId: number | undefined;

      while ((nodeId = nodes.pop())) {
        const node = tree.getById(nodeId);

        if (node) {
          if (isDir(node) && node.nodes) {
            nodeIds.push(...node.nodes);
            nodes.push(...node.nodes);
          }
        }
      }

      traits.set("drop-target", nodeIds);
    } else if (event.type === "drop") {
      traits.clear("drop-target");
      const selected = new Set(selections.narrow());

      if (
        event.node === event.dir ||
        (selected.has(event.node.id) && selected.has(event.dir.id))
      ) {
        return;
      }

      if (selected.has(event.node.id)) {
        const moveSelections = async () => {
          if (!tree.isVisible(event.dir)) {
            await tree.expand(event.dir);
          }

          const promises: Promise<void>[] = [];

          for (const id of Array.from(selected)) {
            const node = tree.getById(id);

            if (node) {
              // @ts-ignore
              promises.push(tree.move(node, event.dir));
            }
          }

          await Promise.all(promises);
        };

        moveSelections();
        selections.clear();
      } else {
        // @ts-ignore
        tree.move(event.node, event.dir);
      }
    } else if (event.type === "end") {
      traits.clear("drop-target");
    }
  });

  return (
    <div className="px-2 h-[calc(100vh_-_64px_-_60px)] overflow-auto no_scrollbar">
      <div ref={windowRef} className={cn(["text-white"])}>
        <div {...virtualize.props}>
          {virtualize?.map((props) => {
            const parent = props.node.parent?.data.name ?? "";
            const file = bucket?.[parent]?.find(
              (b) => b.path === props.node.data.name
            );
            return (
              <React.Fragment key={props.index}>
                {/* To add to the track panel (for retrieving duration purposes) */}
                {file?.type === "video" ? (
                  <div className="absolute z-[-10] opacity-0">
                    <video
                      id={file?.path}
                      onLoad={() => {
                        refreshTracks(canvas);
                      }}
                      onLoadedData={() => {
                        refreshTracks(canvas);
                      }}
                      muted
                      className=""
                      src={file?.url ?? ""}
                    ></video>
                  </div>
                ) : file?.type === "image" ? (
                  <>
                    <Image
                      id={file.path}
                      src={file.url ?? ""}
                      fill
                      className="z-0 hidden object-contain text-white rounded"
                      alt={file.path}
                    />
                  </>
                ) : (
                  <></>
                )}
                <Node
                  plugins={plugins}
                  tree={props.tree}
                  node={props.node}
                  index={props.index}
                  style={props.style}
                >
                  <div className="flex items-center w-full h-full gap-2 px-2 rounded hover:bg-primary-500">
                    {isDir(props.node) ? (
                      props.node.expanded ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            className="w-4 h-4 text-secondary-200"
                          >
                            <path
                              fill="currentColor"
                              d="M2.165 19.551c.186.28.499.449.835.449h15c.4 0 .762-.238.919-.606l3-7A.998.998 0 0 0 21 11h-1V8c0-1.103-.897-2-2-2h-6.655L8.789 4H4c-1.103 0-2 .897-2 2v13h.007a1 1 0 0 0 .158.551zM18 8v3H6c-.4 0-.762.238-.919.606L4 14.129V8h14z"
                            ></path>
                          </svg>
                        </>
                      ) : (
                        <>
                          <IconFolderFilled className="w-4 h-4 text-secondary-200" />
                        </>
                      )
                    ) : (
                      <>
                        {getFileIcon(
                          props.node.basename,
                          "text-secondary-200/30"
                        )}
                      </>
                    )}
                    <span
                      title={props.node.basename}
                      className="overflow-hidden tracking-widest whitespace-nowrap text-primary-200"
                    >
                      {props.node.basename}
                    </span>
                  </div>
                </Node>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      {bucket["/"].length === 0 && <Droparea id="upload-1" />}
    </div>
  );
};

export default Explorer;
