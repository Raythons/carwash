"use client";

import { cn } from "../../utilities/cn";

export function Checkbox({
  className,
  checked,
  onCheckedChange,
  children,
  ...props
}) {
  return (
    <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className={cn(
          "h-4 w-4 rounded border border-primary-300 text-primary-600 focus:ring-2 focus:ring-primary-500 transition-all duration-300",
          className
        )}
        {...props}
      />
      <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {children}
      </span>
    </label>
  );
}
