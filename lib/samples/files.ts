export const files: any = {
  "/": [
    {
      type: "directory",
      path: "/Picture",
    },
  ],
  "/Picture": [
    {
      type: "file",
      path: "/Picture/.DS_Store",
      file: {},
    },
    {
      type: "directory",
      path: "/Picture/Test",
    },
    {
      type: "directory",
      path: "/Picture/Profile",
    },
  ],
  "/Picture/Test": [
    {
      type: "file",
      path: "/Picture/Test/.DS_Store",
      file: {},
    },
    {
      type: "directory",
      path: "/Picture/Test/t2",
    },
    {
      type: "directory",
      path: "/Picture/Test/t1",
    },
  ],
  "/Picture/Test/t2": [],
  "/Picture/Test/t1": [],
  "/Picture/Profile": [
    {
      type: "file",
      path: "/Picture/Profile/IMG_1861.JPG",
      file: {},
    },
    {
      type: "file",
      path: "/Picture/Profile/IMG_9782.JPG",
      file: {},
    },
    {
      type: "file",
      path: "/Picture/Profile/IMG_9783.JPG",
      file: {},
    },
    {
      type: "file",
      path: "/Picture/Profile/IMG_9783.CR2",
      file: {},
    },
    {
      type: "file",
      path: "/Picture/Profile/.DS_Store",
      file: {},
    },
  ],
} as const;
