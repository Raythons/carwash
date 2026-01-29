"use client";

import React, { useEffect } from "react";
import { cn } from "../../utilities/cn";

export function Sheet({ children, open, onOpenChange }) {
  return (
    <div>
      {React.Children.map(children, (child) => {
        if (child.type.displayName === "SheetTrigger") {
          return React.cloneElement(child, { onOpenChange });
        }
        return React.cloneElement(child, { open, onOpenChange });
      })}
    </div>
  );
}
SheetTrigger.displayName = "SheetTrigger";

export function SheetTrigger({ children, onOpenChange }) {
  return React.cloneElement(children, {
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Toggling sidebar");
      onOpenChange((prev) => !prev); // Toggle instead of always setting to true
    },
  });
}

export function SheetContent({
  children,
  side = "right",
  className,
  open,
  onOpenChange,
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  useEffect(() => {
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

  const sideClasses = {
    left: "left-0 animate-in slide-in-from-left-full",
    right: "right-0 animate-in slide-in-from-right-full",
  };

  return (
    <div className="fixed inset-0 z-[9999]" style={{ zIndex: 9999 }}>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity duration-300"
        onClick={() => onOpenChange(false)}
      />

      {/* Sheet */}
      <div
        className={cn(
          "fixed top-0 h-full w-80 bg-white shadow-xl transition-transform duration-300",
          sideClasses[side],
          className
        )}
        style={{ zIndex: 10000 }}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 left-4 p-2 rounded-md hover:bg-gray-100 transition-colors duration-300 z-[10001]"
        >
          <svg
            className="w-4 h-4"
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
        </button>
        {children}
      </div>
    </div>
  );
}
