import { create } from "zustand";
import { FileStoreType } from "../types/store/file";
import { BucketType } from "../types/file";

export const useFile = create<FileStoreType>()((set, get) => ({
  bucket: { "/": [] },
  setBucket: (bucket: BucketType) => set((state) => ({ ...state, bucket })),
}));
