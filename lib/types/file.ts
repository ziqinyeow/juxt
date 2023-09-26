export type FileSystemHandlePromises = Promise<
  FileSystemFileHandle[] | FileSystemDirectoryHandle[]
>[];

export type FileWithPath = {
  type: "file" | "directory" | "youtube";
  path: string;
  file?: File;
  url?: string;
};

export type BucketType = Record<string, FileWithPath[]>;
