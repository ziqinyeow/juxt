import { Tracks } from "./track";

export type Project = {
  id: string;
  name: string;
  description?: string;
  color?: string;
  created: number;
  tracks: Tracks[];
};
