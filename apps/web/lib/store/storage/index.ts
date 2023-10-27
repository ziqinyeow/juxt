import { StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import { getFileStorage } from "./idb-file-storage";
import { nanoid } from "nanoid";

// IDB storage object
export const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export const storeFile = async (file?: File) => {
  if (!(file instanceof File)) {
    throw new TypeError("File missing or invalid");
  }

  const name = file.name + "-" + nanoid();

  try {
    const fs = await getFileStorage();
    await fs.put(name, file);
    return name;
  } catch (err) {
    console.error("File storing error", err);
  }
};

export const getFile = async (name?: string): Promise<File | null> => {
  if (!name) {
    return null;
  }

  try {
    const fs = await getFileStorage();
    const file = (await fs.get(name)) as File;
    return file;
  } catch (err) {
    console.error("File storing error", err);
    // throw err;
    return null;
  }
};
