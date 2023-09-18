import { cn } from "@/lib/utils";
import { Slider as UISlider } from "@/components/ui/slider";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { Button } from "./button";
import { useStore } from "@/lib/store";

type SliderProps = React.ComponentProps<typeof UISlider>;

export default function Slider({ className, ...props }: SliderProps) {
  const { panelScale, addPanelScale, setPanelScale } = useStore();

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => {
          addPanelScale(-1);
        }}
      >
        <IconMinus className="w-4 h-4 text-secondary-200" />
      </Button>
      <UISlider
        min={2}
        max={100}
        step={1}
        value={[panelScale]}
        className={cn("", className)}
        onValueChange={(e) => {
          setPanelScale(e[0]);
        }}
        {...props}
      />
      <Button
        onClick={() => {
          addPanelScale(1);
        }}
      >
        <IconPlus className="w-4 h-4 text-secondary-200" />
      </Button>
    </div>
  );
}
