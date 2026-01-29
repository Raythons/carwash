import React from "react";
import { cn } from "../../utilities/cn";

export const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-primary-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-zinc-700/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
