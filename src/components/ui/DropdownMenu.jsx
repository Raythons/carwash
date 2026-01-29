"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../utilities/cn";

export function DropdownMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </div>
  );
}

export function DropdownMenuTrigger({ children, isOpen, setIsOpen }) {
  return React.cloneElement(children, {
    onClick: () => setIsOpen(!isOpen),
  });
}

export function DropdownMenuContent({
  children,
  align = "start",
  side = "bottom",
  className,
  isOpen,
  setIsOpen,
}) {
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const alignClasses = {
    start: "left-0",
    end: "right-0",
    center: "left-1/2 transform -translate-x-1/2",
  };

  const sideClasses = {
    bottom: "top-full mt-1",
    top: "bottom-full mb-1",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] bg-white rounded-md border border-gray-200 shadow-lg transition-all duration-300",
        alignClasses[align],
        sideClasses[side],
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children, className, onClick }) {
  return (
    <div
      className={cn(
        "px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors duration-300",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({ children, className }) {
  return (
    <div
      className={cn("px-3 py-2 text-sm font-semibold text-gray-700", className)}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({ className }) {
  return <div className={cn("h-px bg-gray-200 my-1", className)} />;
}
