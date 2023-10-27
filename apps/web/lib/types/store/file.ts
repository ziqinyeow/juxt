import { BucketType } from "../file";

export interface FileStoreType {
  bucket: BucketType;
  setBucket: (bucket: BucketType) => void;
  mergeBucket: (bucket: BucketType) => void;
  mergeFileListToBucket: (fileList: FileList | null) => void;
}
