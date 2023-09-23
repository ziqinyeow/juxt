export const checkFileType = (file: File): "image" | "video" | null => {
  if (file.type.includes("video")) {
    return "video";
  } else if (file.type.includes("image")) {
    return "image";
  }
  return null;
};
