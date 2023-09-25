export type FileSystemHandlePromises = Promise<
  FileSystemFileHandle[] | FileSystemDirectoryHandle[]
>[];

export type FileWithPath = {
  type: "file" | "directory";
  path: string;
  file?: File;
};

export type BucketType = Record<string, FileWithPath[]>;
