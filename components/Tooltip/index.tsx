import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  children?: React.ReactNode;
  tooltip?: React.ReactNode;
  side?: "bottom" | "top" | "right" | "left" | undefined;
  sideOffset?: number;
};

const Tooltip = ({
  className,
  children,
  tooltip,
  side = "bottom",
  sideOffset = 4,
}: Props) => {
  return (
    <UITooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <span tabIndex={0}>{children}</span>
      </TooltipTrigger>
      <TooltipContent
        className={cn([
          "z-[100] whitespace-nowrap text-xs bg-light-300 dark:bg-primary-500 border-light-200 dark:border-primary-400 text-primary-500 dark:text-primary-100 tracking-widest",
          className,
        ])}
        side={side}
        sideOffset={sideOffset}
      >
        {tooltip}
      </TooltipContent>
    </UITooltip>
  );
};

export default Tooltip;
