"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../utilities/cn";

export function Dialog({ children, open, onOpenChange }) {
  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, { open, onOpenChange });
      })}
    </div>
  );
}

export function DialogTrigger({ children, onOpenChange }) {
  return React.cloneElement(children, {
    onClick: () => onOpenChange(true),
  });
}

export function DialogPortal({ children }) {
  if (typeof document === "undefined") return null;
  return ReactDOM.createPortal(children, document.body);
}

export function DialogClose({ children, onOpenChange }) {
  return React.cloneElement(children, {
    onClick: () => onOpenChange(false),
  });
}

export function DialogOverlay({ className, onOpenChange, ...props }) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[1000] bg-black/60 transition-opacity duration-300",
        className
      )}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  );
}

export function DialogContent({
  className,
  children,
  open,
  onOpenChange,
  ...props
}) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <DialogPortal>
      <DialogOverlay onOpenChange={onOpenChange} />
      <div
        className={cn(
          "fixed left-[50%] top-[50%] z-[1001] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white dark:bg-zinc-900 dark:border-zinc-800 p-6 shadow-lg duration-200 rounded-lg",
          className
        )}
        {...props}
      >
        {children}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-2 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span className="sr-only">Close</span>
        </button>
      </div>
    </DialogPortal>
  );
}

export const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);

export const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);

export const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

export const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

// Mobile Sheet Component using Dialog
export function MobileSheet({
  className,
  side = "right",
  children,
  open,
  onOpenChange,
  ...props
}) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <DialogPortal>
      <DialogOverlay
        className="fixed inset-0 z-[100] bg-black/50"
        onOpenChange={onOpenChange}
      />
      <div
        className={cn(
          "fixed z-[101] gap-4 bg-white dark:bg-zinc-950 p-0 shadow-xl transition ease-in-out duration-300",
          side === "right" &&
            "inset-y-0 right-0 h-full w-full sm:w-80 border-l animate-in slide-in-from-right",
          side === "left" &&
            "inset-y-0 left-0 h-full w-full sm:w-80 border-r animate-in slide-in-from-left",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </DialogPortal>
  );
}
