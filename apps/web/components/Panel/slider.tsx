import { cn } from "@/lib/utils";
import { Slider as UISlider } from "shadcn/ui/slider";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/Button";
import { useStore } from "@/lib/store";
import {
  PANEL_SLIDER_MAX_VALUE,
  PANEL_SLIDER_MIN_VALUE,
  PANEL_SLIDER_STEP_SIZE,
} from "@/lib/constants/panel";
import useKeyboardJs from "react-use/lib/useKeyboardJs";
import { useEffect } from "react";

type SliderProps = React.ComponentProps<typeof UISlider>;

export default function Slider({ className, ...props }: SliderProps) {
  const { disableKeyboardShortcut, panelScale, addPanelScale, setPanelScale } =
    useStore();
  const [zoomIn] = useKeyboardJs(",");
  const [zoomOut] = useKeyboardJs(".");

  useEffect(() => {
    if (!disableKeyboardShortcut) {
      if (zoomIn) {
        addPanelScale(-PANEL_SLIDER_STEP_SIZE);
      } else if (zoomOut) {
        addPanelScale(PANEL_SLIDER_STEP_SIZE);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableKeyboardShortcut, zoomIn, zoomOut]);

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => {
          addPanelScale(-PANEL_SLIDER_STEP_SIZE);
        }}
      >
        <IconMinus className="w-4 h-4 text-secondary-100 dark:text-secondary-200" />
      </Button>
      <UISlider
        min={PANEL_SLIDER_MIN_VALUE}
        max={PANEL_SLIDER_MAX_VALUE}
        step={PANEL_SLIDER_STEP_SIZE}
        value={[panelScale]}
        className={cn("", className)}
        onValueChange={(e) => {
          setPanelScale(e[0]);
        }}
        {...props}
      />
      <Button
        onClick={() => {
          addPanelScale(PANEL_SLIDER_STEP_SIZE);
        }}
      >
        <IconPlus className="w-4 h-4 text-secondary-100 dark:text-secondary-200" />
      </Button>
    </div>
  );
}
