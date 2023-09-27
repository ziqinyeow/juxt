import { create } from "zustand";
import { FileStoreType } from "../types/store/file";
import { BucketType, FileWithPath } from "../types/file";

const merge = (a: FileWithPath[], b: FileWithPath[], predicate: Function) => {
  const c = [...a]; // copy to avoid side effects
  // add all items from B to copy C if they're not already present
  b.forEach((bItem) =>
    c.some((cItem) => predicate(bItem, cItem)) ? null : c.push(bItem)
  );
  return c;
};

export const useFile = create<FileStoreType>()((set, get) => ({
  bucket: { "/": [] },
  setBucket: (bucket: BucketType) => set((state) => ({ ...state, bucket })),
  // showFilePicker
  mergeFileListToBucket: (fileList: FileList | null) => {
    if (!fileList) {
      return;
    }
    const curr = { ...get().bucket };
    set((state) => ({
      ...state,
      bucket: {
        ...curr,
        "/": merge(
          [...curr["/"]],
          Array.from(fileList).map((file) => {
            // if (file.type.startsWith("video")) {
            //   const video = document.createElement("video");
            //   video.onloadedmetadata = () => {
            //     // return {
            //     //   type: "file",
            //     //   path: `/` + file.name,
            //     //   file,
            //     //   duration: video.duration,
            //     // };
            //   };
            //   video.src = URL.createObjectURL(file);
            //   video.remove();
            // }
            return {
              dir: false,
              type: "others",
              path: `/` + file.name,
              file,
            };
          }),
          (a: FileWithPath, b: FileWithPath) => a.path === b.path
        ),
      },
    }));
  },
  mergeBucket: (bucket: BucketType) => {
    let curr = { ...get().bucket }; // copy to avoid side effects
    Object.keys(bucket).forEach((k) => {
      if (k in curr) {
        curr[k] = merge(
          curr[k],
          bucket[k],
          (a: FileWithPath, b: FileWithPath) => a.path === b.path
        );
      } else {
        curr[k] = bucket[k];
      }
    });
    set((state) => ({ ...state, bucket: curr }));
  },
}));
