import { BucketType } from "../file";

export interface FileStoreType {
  bucket: BucketType;
  setBucket: (bucket: BucketType) => void;
}
