import { cn } from "@/lib/utils";
import Droparea from "../droparea";
import { useFile } from "@/lib/store/file";
import { ChangeEvent, useMemo, useState } from "react";
import Image from "next/image";
import { IconPhoto, IconPhotoOff, IconVideo } from "@tabler/icons-react";
import { useStore } from "@/lib/store";
import { FileWithPath } from "@/lib/types/file";

const Media = () => {
  const [searchValue, setSearchValue] = useState("");
  const { addImage, addVideo } = useStore();
  const { bucket } = useFile();

  const search = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

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
        <Droparea id="upload-2" />
      ) : (
        <div className="w-full h-full px-2">
          <div className="flex items-center gap-2 mt-2 mb-4">
            <input
              type="text"
              className="w-full px-3 py-2 overflow-auto tracking-widest text-white rounded ring-offset-2 ring-offset-primary-800 ring-2 ring-secondary-200 bg-primary-600 focus:outline-none"
              placeholder="search"
              value={searchValue}
              onChange={search}
            />
          </div>
          <div className={cn(["grid grid-cols-1 gap-4 py-2"])}>
            {medias?.map((media, i) => (
              <div
                key={i}
                className="relative flex items-center justify-center w-full h-32 overflow-hidden text-white whitespace-pre-wrap transition-all rounded cursor-pointer group ring-secondary-200 hover:ring-2 ring-offset-4 ring-offset-primary-800 bg-primary-100"
                onClick={() => {
                  onClickMedia(media);
                }}
              >
                <div className="absolute z-20 p-1 rounded top-2 left-2 bg-primary-800 group-hover:hidden">
                  {media.type === "image" ? (
                    <>
                      <IconPhoto className="w-4 h-4 text-secondary-200" />
                    </>
                  ) : media.type === "video" ? (
                    <>
                      <IconVideo className="w-4 h-4 text-secondary-200" />
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
                      src={media.url ?? ""}
                      fill
                      className="z-0 object-contain w-full h-full text-white rounded"
                      alt={media.path}
                    />
                  </>
                ) : media.type === "video" ? (
                  <>
                    <video
                      id={media.path}
                      className="rounded"
                      src={media.url ?? ""}
                    ></video>
                  </>
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>
          {medias?.length === 0 && (
            <div className="flex items-center w-full gap-2 text-xs tracking-widest line-clamp-2 text-primary-100">
              <IconPhotoOff className="w-4 h-4" />
              <span>No media found</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Media;
