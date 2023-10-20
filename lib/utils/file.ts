import { FileWithPath } from "../types/file";

export const merge = (
  a: FileWithPath[],
  b: FileWithPath[],
  predicate: Function
) => {
  const c = [...a]; // copy to avoid side effects
  // add all items from B to copy C if they're not already present
  b.forEach((bItem) =>
    c.some((cItem) => predicate(bItem, cItem)) ? null : c.push(bItem)
  );
  return c;
};
