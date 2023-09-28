import {
  BucketType,
  FileSystemHandlePromises,
  FileWithPath,
} from "@/lib/types/file";

// export const supportsFileSystemAccessAPI =
//   "getAsFileSystemHandle" in DataTransferItem.prototype;
// export const supportsWebkitGetAsEntry =
//   "webkitGetAsEntry" in DataTransferItem.prototype;

export const getYoutubeId = (url: string) => {
  url = url.replace("https://www.youtube.com/", "");
  if (url.startsWith("watch?v=")) {
    return url.replace("watch?v=", "").split("&")[0];
  }
  return url;
};

export const getFileSystemHandle = (
  items: DataTransferItemList
): FileSystemHandlePromises => {
  const supportsFileSystemAccessAPI =
    "getAsFileSystemHandle" in DataTransferItem.prototype;
  const supportsWebkitGetAsEntry =
    "webkitGetAsEntry" in DataTransferItem.prototype;
  return Array.from(items)
    .filter((item) => item.kind === "file")
    .map((item) =>
      supportsFileSystemAccessAPI
        ? // @ts-ignore -> https://github.com/microsoft/TypeScript/issues/48002
          item.getAsFileSystemHandle()
        : supportsWebkitGetAsEntry
        ? item.webkitGetAsEntry()
        : item.getAsFile()
    );
};

// https://rinkesh-patel.medium.com/recursive-javascript-method-to-process-multiple-directories-drops-in-a-drag-n-drop-upload-operation-de503bf43336
export const traverseDir = async (
  entry: any,
  files: FileWithPath[],
  paths: string[],
  bucket: any
) => {
  if (entry.kind === "file") {
    const file: File = await entry.getFile();
    const path = paths.join("/");
    const root = paths.slice(0, -1).join("/");
    const data: FileWithPath = {
      dir: false,
      type: checkFileType(file),
      path,
      file,
    };
    if (root in bucket) {
      bucket[root].push(data);
    } else {
      bucket[root] = [data];
    }
    files.push(data);
  } else if (entry.kind === "directory") {
    for await (const handle of entry.values()) {
      paths.push(handle.name);
      let newPath = paths.map((p) => p);
      const file = paths[paths.length - 1];
      if (
        handle.kind === "directory" &&
        (!file.includes(".") || file.startsWith("."))
      ) {
        const path = paths.join("/");
        const root = paths.slice(0, -1).join("/");
        bucket[path] = [];
        const data = {
          dir: true,
          type: "others",
          path,
        };
        if (root in bucket) {
          bucket[root].push(data);
        } else {
          bucket[root] = [data];
        }
      }
      await traverseDir(handle, files, newPath, bucket);
      paths.pop();
    }
  }
};

export const traverse = async (items: DataTransferItemList) => {
  const fileSystemHandles = getFileSystemHandle(items);
  if (!fileSystemHandles.length) {
    return { bucket: null, files: null };
  }
  const bucket: BucketType | null = {
    "/": [],
  };
  const files: FileWithPath[] = [];
  for await (const handle of fileSystemHandles) {
    // @ts-ignore
    const { kind, name } = handle;
    const pathname = `/` + name;
    if (kind === "directory") {
      bucket["/"].push({
        dir: true,
        type: "others",
        path: pathname,
      });
      bucket[pathname] = [];
      let path = [pathname];
      let contents: FileWithPath[] = [];
      await traverseDir(handle, contents, path, bucket);
      files.push(...contents);
    } else {
      // @ts-ignore
      const file: File = await handle.getFile();
      const data: FileWithPath = {
        dir: false,
        type: checkFileType(file),
        path: pathname,
        file,
      };
      bucket["/"].push(data);
      files.push(data);
    }
  }
  return { bucket, files };
};

export const checkFileType = (file: File): "image" | "video" | "others" => {
  if (file.type.includes("video")) {
    return "video";
  } else if (file.type.includes("image")) {
    return "image";
  }
  return "others";
};
