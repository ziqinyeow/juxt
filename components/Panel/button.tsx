import { cn } from "@/lib/utils";
import { type ButtonProps } from "@/lib/types/html";

export const Button = ({ className, children, ...props }: ButtonProps) => (
  <button
    {...props}
    className={cn([
      "p-1 hover:bg-primary-500 hover:text-opacity-75 rounded",
      className,
    ])}
  >
    {children}
  </button>
);
