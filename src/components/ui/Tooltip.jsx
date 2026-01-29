"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utilities/cn";

export function TooltipProvider({ children, delayDuration = 100 }) {
  return (
    <div
      data-tooltip-provider=""
      style={{ "--tooltip-delay": `${delayDuration}ms` }}
    >
      {children}
    </div>
  );
}

export function Tooltip({ children, delayDuration = 300 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState(null);
  const timeoutRef = useRef(null);
  const triggerRef = useRef(null);

  const showTooltip = (e) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
          right: rect.right,
        });
      }
      setIsVisible(true);
    }, delayDuration);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        if (child.type?.displayName === "TooltipTrigger") {
          return React.cloneElement(child, {
            isVisible,
            setIsVisible,
            showTooltip,
            hideTooltip,
            triggerRef,
            position,
          });
        }
        return React.cloneElement(child, { isVisible, position });
      })}
    </div>
  );
}

export function TooltipTrigger({
  children,
  isVisible,
  showTooltip,
  hideTooltip,
  triggerRef,
  asChild = false,
}) {
  const Comp = asChild ? React.Fragment : "div";

  const props = {
    ref: triggerRef,
    onMouseEnter: showTooltip,
    onMouseLeave: hideTooltip,
    onFocus: showTooltip,
    onBlur: hideTooltip,
  };

  if (asChild) {
    return React.cloneElement(children, {
      ...props,
      ref: (node) => {
        triggerRef.current = node;
        if (children.ref) {
          if (typeof children.ref === "function") {
            children.ref(node);
          } else {
            children.ref.current = node;
          }
        }
      },
    });
  }

  return <Comp {...props}>{children}</Comp>;
}

TooltipTrigger.displayName = "TooltipTrigger";

export function TooltipContent({
  children,
  side = "left",
  className,
  isVisible,
  position,
}) {
  if (!isVisible || !position) return null;

  const getTooltipStyle = () => {
    const offset = 8; // Initial offset from trigger
    
    switch (side) {
      case "top":
        return {
          position: "fixed",
          left: position.left + position.width / 2,
          top: position.top - offset,
          transform: "translate(-50%, -100%)",
          zIndex: 9999,
        };
      case "bottom":
        return {
          position: "fixed",
          left: position.left + position.width / 2,
          top: position.bottom + offset,
          transform: "translate(-50%, 0)",
          zIndex: 9999,
        };
      case "right":
        return {
          position: "fixed",
          left: position.right + offset,
          top: position.top + position.height / 2,
          transform: "translate(0, -50%)",
          zIndex: 9999,
        };
      case "left":
      default:
        return {
          position: "fixed",
          left: position.left - offset,
          top: position.top + position.height / 2,
          transform: "translate(-100%, -50%)",
          zIndex: 9999,
        };
    }
  };

  const arrowClasses = {
    top: "bottom-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-t-4 border-t-gray-900 border-l-4 border-l-transparent border-r-4 border-r-transparent",
    bottom: "top-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-b-4 border-b-gray-900 border-l-4 border-l-transparent border-r-4 border-r-transparent",
    left: "right-[-4px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent",
    right: "left-[-4px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-r-4 border-r-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent",
  };

  return createPortal(
    <div
      className={cn(
        "fixed z-[9999] px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg transition-all duration-200 whitespace-nowrap pointer-events-none",
        "animate-in fade-in-0 zoom-in-95",
        className
      )}
      style={getTooltipStyle()}
    >
      {children}
      {/* Arrow */}
      <div className={cn("absolute", arrowClasses[side])}></div>
    </div>,
    document.body
  );
}
