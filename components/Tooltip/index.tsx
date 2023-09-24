import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  children?: React.ReactNode;
  tooltip?: React.ReactNode;
  side?: "bottom" | "top" | "right" | "left" | undefined;
};

const Tooltip = ({ className, children, tooltip, side = "bottom" }: Props) => {
  return (
    <UITooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <span tabIndex={0}>{children}</span>
      </TooltipTrigger>
      <TooltipContent
        className={cn([
          "z-[100] whitespace-nowrap text-xs bg-primary-500 border-primary-400 text-primary-100 tracking-widest",
          className,
        ])}
        side={side}
      >
        {tooltip}
      </TooltipContent>
    </UITooltip>
  );
};

export default Tooltip;
