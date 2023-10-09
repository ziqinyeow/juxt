import React, { useCallback, useEffect } from "react";
import { Button } from "../Button";
import { useStore } from "@/lib/store";
import { Slider as UISlider } from "../ui/slider";
import {
  IconChevronDown,
  IconChevronUp,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconRepeat,
  IconRewindBackward5,
  IconRewindForward5,
} from "@tabler/icons-react";
import { formatTimeToMinSecMili } from "@/lib/utils";
import Tooltip from "../Tooltip";
import useKeyboardJs from "react-use/lib/useKeyboardJs";

const Seeker = () => {
  const {
    playing,
    setPlaying,
    maxTime,
    hidePanel,
    setHidePanel,
    handleSeek,
    getCurrentTimeInMs,
    rewindCurrentTimeInMs,
  } = useStore();
  const [space] = useKeyboardJs("space");
  const [left] = useKeyboardJs("left");
  const [right] = useKeyboardJs("right");

  useEffect(() => {
    if (space) {
      play();
    } else if (left) {
      rewindBackward5();
    } else if (right) {
      rewindForward5();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [space, left, right]);

  const rewindBackward5 = useCallback(
    () => rewindCurrentTimeInMs(5000, false),
    [rewindCurrentTimeInMs]
  );
  const play = useCallback(() => {
    setPlaying(!playing);
  }, [playing, setPlaying]);
  const rewindForward5 = useCallback(
    () => rewindCurrentTimeInMs(5000, true),
    [rewindCurrentTimeInMs]
  );
  const toggleHidePanel = () => setHidePanel(!hidePanel);

  return (
    <div className="h-[40px] bg-primary-400 px-4 flex items-center gap-5 justify-between">
      <div className="flex items-end gap-2">
        <Button onClick={rewindBackward5} className="text-white">
          <IconRewindBackward5 className="w-4 h-4" />
        </Button>

        <Tooltip tooltip={playing ? `pause` : `play`}>
          <Button onClick={play} className="text-secondary-200">
            {getCurrentTimeInMs() === maxTime ? (
              <IconRepeat className="w-5 h-5" />
            ) : playing ? (
              <IconPlayerPauseFilled className="w-5 h-5" />
            ) : (
              <IconPlayerPlayFilled className="w-5 h-5" />
            )}
          </Button>
        </Tooltip>
        <Button onClick={rewindForward5} className="text-white">
          <IconRewindForward5 className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex items-center justify-end w-full gap-4">
        <UISlider
          onValueChange={(e) => {
            handleSeek(e[0]);
          }}
          min={0}
          max={maxTime}
          value={[getCurrentTimeInMs()]}
          className="w-full"
        />
      </div>
      <div className="flex items-center justify-end gap-4 whitespace-nowrap">
        <div className="">
          <span>{formatTimeToMinSecMili(getCurrentTimeInMs())}</span> /{" "}
          <span className="text-white/70">
            {formatTimeToMinSecMili(maxTime)}
          </span>
        </div>
        <Tooltip tooltip={hidePanel ? `open panel` : `close panel`}>
          <Button onClick={toggleHidePanel} className="text-secondary-200">
            {hidePanel ? (
              <IconChevronUp className="w-4 h-4" />
            ) : (
              <IconChevronDown className="w-4 h-4" />
            )}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default React.memo(Seeker);
