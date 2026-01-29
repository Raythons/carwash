// Enhanced form field component with validation support
import React from 'react';
import { cn } from '../../utils/cn';

export const FormField = ({ 
  label, 
  error, 
  required = false, 
  touched = false,
  children, 
  className,
  ...props 
}) => {
  const hasError = error && touched;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className={cn(
          "block text-sm font-medium text-gray-700 dark:text-white",
          required && "after:content-['*'] after:text-red-500 after:ml-1",
          hasError && "text-red-600"
        )}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {children}
        
        {hasError && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              className="h-5 w-5 text-red-500" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        )}
      </div>
      
      {hasError && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg 
            className="h-4 w-4 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  error,
  touched,
  ...props 
}, ref) => {
  const hasError = error && touched;

  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
        "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        hasError && "border-red-500 focus:ring-red-500",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export const Textarea = React.forwardRef(({ 
  className, 
  error,
  touched,
  ...props 
}, ref) => {
  const hasError = error && touched;

  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
        "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        hasError && "border-red-500 focus:ring-red-500",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export const Select = React.forwardRef(({ 
  className, 
  children,
  error,
  touched,
  ...props 
}, ref) => {
  const hasError = error && touched;

  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        hasError && "border-red-500 focus:ring-red-500",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";
