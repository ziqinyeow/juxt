import { BucketType } from "./file";
import { Tracks } from "./track";

export type Tag = {
  id: string;
  name: string;
  color: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  color?: string;
  created: number;
  tracks: Tracks[];
  bucket: BucketType;
  tags: Tag[];
};
