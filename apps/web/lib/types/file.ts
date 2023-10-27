export type FileSystemHandlePromises = Promise<
  FileSystemFileHandle[] | FileSystemDirectoryHandle[]
>[];

export type FileWithPath = {
  id: string;
  dir: boolean;
  type: "image" | "video" | "youtube" | "others";
  path: string;
  url?: string;
  duration?: number;
  file?: File;
};

export type BucketType = Record<string, FileWithPath[]>;
