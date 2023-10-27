import { cn } from "@/lib/utils";
import { type ButtonProps } from "@/lib/types/html";
import { useStore } from "@/lib/store";

export const Button = ({ className, children, ...props }: ButtonProps) => {
  const { setDisableKeyboardShortcut } = useStore();
  return (
    <button
      {...props}
      onFocus={() => {
        setDisableKeyboardShortcut(true);
      }}
      onBlur={() => {
        setDisableKeyboardShortcut(false);
      }}
      className={cn([
        "p-1 hover:bg-light-400 dark:hover:bg-primary-500 hover:text-opacity-75 rounded",
        "disabled:bg-opacity-0 disabled:text-white/30 disabled:hover:text-white/30",
        "transition-all",
        className,
      ])}
    >
      {children}
    </button>
  );
};

export const ToolbarButton = ({
  className,
  children,
  ...props
}: ButtonProps) => (
  <button
    {...props}
    className={cn([
      "p-1 hover:text-opacity-75 rounded",
      "disabled:bg-opacity-0 disabled:text-black/30 dark:disabled:text-white/30 dark:disabled:hover:text-white/30",
      "transition-all",
      "dark:hover:bg-primary-400/90 hover:bg-light-400 disabled:cursor-not-allowed hover:text-secondary-200",
      className,
    ])}
  >
    {children}
  </button>
);
