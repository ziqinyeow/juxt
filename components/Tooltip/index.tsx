import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  children?: React.ReactNode;
  tooltip?: React.ReactNode;
  side?: "bottom" | "top" | "right" | "left" | undefined;
};

const Tooltip = ({ children, tooltip, side = "bottom" }: Props) => {
  return (
    <UITooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <span tabIndex={0}>{children}</span>
      </TooltipTrigger>
      <TooltipContent
        className="z-[100] whitespace-nowrap text-xs bg-primary-500 border-primary-400 text-primary-100 tracking-widest"
        side={side}
      >
        {tooltip}
      </TooltipContent>
    </UITooltip>
  );
};

export default Tooltip;
