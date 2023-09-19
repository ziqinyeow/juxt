import { nanoid } from "nanoid";
import { type Tracks } from "@/lib/types/track";

const aspectRatio = 1.25;

export const tracks: Tracks[] = [
  {
    id: "track_1",
    name: "track 1",
    elements: [
      {
        id: nanoid(),
        name: `video_1`,
        type: "video",
        placement: {
          x: 0,
          y: 0,
          width: 100 * aspectRatio,
          height: 100,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        },
        timeframe: {
          start: 1000,
          duration: 5000,
        },
        properties: {
          elementId: `video_1`,
          src: "",
        },
      },
    ],
  },
  {
    id: "track_2",
    name: "track 2",
    elements: [
      {
        id: nanoid(),
        name: `image_1`,
        type: "image",
        placement: {
          x: 0,
          y: 0,
          width: 100 * aspectRatio,
          height: 100,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        },
        timeframe: {
          start: 0,
          duration: 10000,
        },
        properties: {
          elementId: `image_1`,
          src: "",
        },
      },
    ],
  },
];
