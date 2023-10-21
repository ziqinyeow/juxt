import { cn } from "@/lib/utils";
import { type ButtonProps } from "@/lib/types/html";

export const Button = ({ className, children, ...props }: ButtonProps) => (
  <button
    {...props}
    className={cn([
      "p-1 hover:bg-light-300 dark:hover:bg-primary-500 hover:text-opacity-75 rounded",
      "disabled:bg-opacity-0 disabled:text-white/30 disabled:hover:text-white/30",
      "transition-all",
      className,
    ])}
  >
    {children}
  </button>
);

export const ToolbarButton = ({
  className,
  children,
  ...props
}: ButtonProps) => (
  <button
    {...props}
    className={cn([
      "p-1 hover:text-opacity-75 rounded",
      "disabled:bg-opacity-0 disabled:text-white/30 disabled:hover:text-white/30",
      "transition-all",
      "hover:bg-primary-400/90 disabled:cursor-not-allowed hover:text-secondary-200",
      className,
    ])}
  >
    {children}
  </button>
);
