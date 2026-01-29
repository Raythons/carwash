import React from "react";
import { cn } from "../../utilities/cn";

export const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      lang="en"
      className={cn(
        "flex h-10 w-full rounded-md border border-primary-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-zinc-700/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";
