import { cn } from "@/lib/utils";
import Droparea from "../droparea";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { IconPhoto, IconPhotoOff, IconVideo } from "@tabler/icons-react";
import { useStore } from "@/lib/store";
import { BucketType, FileWithPath } from "@/lib/types/file";
import { getYoutubeId } from "@/components/Dropzone/utils";

const Media = ({ projectId }: { projectId: string }) => {
  const [focused, setFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const {
    projects,
    fileURLCache,
    canvas,
    addImage,
    addVideo,
    setDisableKeyboardShortcut,
    refreshTracks,
  } = useStore();

  const bucket = useMemo(
    () => projects.find((project) => project.id === projectId),
    [projectId, projects]
  )?.bucket as BucketType;

  const search = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  useEffect(() => {
    if (focused) {
      setDisableKeyboardShortcut(true);
    } else {
      setDisableKeyboardShortcut(false);
    }
  }, [focused, setDisableKeyboardShortcut]);

  const allMedias = useMemo(
    () =>
      Object.values(bucket)
        .map((b) => {
          return b.filter((d) => d.type === "video" || d.type === "image");
        })
        .reduce(function (prev, next) {
          return prev.concat(next);
        })
        .filter((b) => b),
    [bucket]
  );

  const medias = useMemo(
    () =>
      allMedias.filter(
        (b) =>
          b.path.toLowerCase().includes(searchValue.toLowerCase()) ||
          b.type.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [allMedias, searchValue]
  );

  const onClickMedia = (media: FileWithPath) => {
    if (media.type === "video") {
      addVideo(media);
    } else if (media.type === "image") {
      addImage(media);
    }
  };

  return (
    <div className="px-2 h-[calc(100vh_-_64px_-_60px)] max-w-full overflow-auto no_scrollbar">
      {bucket["/"].length === 0 ? (
        <>
          {/* <iframe
            src={
              "https://www.youtube.com/embed/" +
              getYoutubeId(
                "https://www.youtube.com/watch?v=FXcgzUmlD2o&ab_channel=CodieSanchez"
              ) +
              "?controls=0&showinfo=0&modestbranding=1&autohide=1"
            }
            className="w-full rounded"
          ></iframe> */}
          <Droparea projectId={projectId} id="upload-2" />
        </>
      ) : (
        <div className="w-full h-full px-2">
          <div className="flex items-center gap-2 mt-2 mb-4">
            <input
              onFocus={onFocus}
              onBlur={onBlur}
              type="text"
              className="w-full px-3 py-2 overflow-auto tracking-widest text-black rounded dark:text-white ring-offset-2 dark:ring-offset-primary-800 ring-2 ring-secondary-100 dark:ring-secondary-200 bg-light-300 dark:bg-primary-600 focus:outline-none"
              placeholder="search"
              value={searchValue}
              onChange={search}
            />
          </div>
          <div className={cn(["grid grid-cols-1 gap-4 py-2"])}>
            {medias?.map((media, i) => (
              <div
                key={i}
                className="relative flex items-center justify-center w-full h-32 overflow-hidden text-white whitespace-pre-wrap transition-all rounded cursor-pointer group ring-secondary-100 dark:ring-secondary-200 hover:ring-2 ring-offset-4 ring-offset-light-300 dark:ring-offset-primary-800 bg-primary-100"
                onClick={() => {
                  onClickMedia(media);
                }}
              >
                <div className="absolute z-20 p-1 rounded top-2 left-2 bg-light-300 dark:bg-primary-800 group-hover:hidden">
                  {media.type === "image" ? (
                    <>
                      <IconPhoto className="w-4 h-4 text-secondary-100 dark:text-secondary-200" />
                    </>
                  ) : media.type === "video" ? (
                    <>
                      <IconVideo className="w-4 h-4 text-secondary-100 dark:text-secondary-200" />
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="absolute z-10 flex items-center justify-center w-full h-full px-4 tracking-widest text-center group-hover:hidden whitespace-break-spaces bg-primary-800/70">
                  {media.path}
                </div>

                {media.type === "image" ? (
                  <>
                    <Image
                      id={media.path}
                      // src={media.url ?? ""}
                      src={fileURLCache[media.id] ?? ""}
                      fill
                      className="z-0 object-contain w-full h-full text-white rounded"
                      alt={media.path}
                      onLoad={() => {
                        refreshTracks(canvas);
                      }}
                    />
                  </>
                ) : media.type === "video" ? (
                  <>
                    <video
                      id={media.path + "thumbnail"}
                      muted
                      className="rounded"
                      // src={media.url ?? ""}
                      src={fileURLCache[media.id] ?? ""}
                    ></video>
                    <video
                      id={media.path}
                      onLoad={() => {
                        refreshTracks(canvas);
                      }}
                      onLoadedData={() => {
                        refreshTracks(canvas);
                      }}
                      muted
                      className="absolute z-[-10] opacity-0"
                      // src={media.url ?? ""}
                      src={fileURLCache[media.id] ?? ""}
                    ></video>
                  </>
                ) : media?.type === "youtube" ? (
                  <>
                    <iframe
                      src={
                        "https://www.youtube.com/embed/" +
                        getYoutubeId(
                          "https://www.youtube.com/watch?v=FXcgzUmlD2o&ab_channel=CodieSanchez"
                        ) +
                        "?modestbranding=1&rel=0"
                      }
                      className="w-full h-full rounded"
                    ></iframe>
                  </>
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>
          {medias?.length === 0 && (
            <div className="flex items-center w-full gap-2 text-xs tracking-widest text-black line-clamp-2 dark:text-primary-100">
              <IconPhotoOff className="w-4 h-4" />
              <span className="">No media found.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Media;
