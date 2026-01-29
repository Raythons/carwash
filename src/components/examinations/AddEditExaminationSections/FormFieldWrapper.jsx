"use client"

import { cn } from "@/lib/utils"

export function FormFieldWrapper({ children, className = "" }) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-zinc-900 dark:border-zinc-700 dark:shadow-zinc-700/20 rounded-lg p-4 border border-gray-200 transition-shadow hover:shadow-sm dark:hover:shadow-purple-500/10",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function FormFieldHeader({ icon: Icon, label, labelFor, className = "" }) {
  return (
    <div className={cn("flex items-center gap-2 mb-2", className)}>
      {Icon && <Icon className="w-4 h-4 text-gray-500 dark:text-zinc-400 flex-shrink-0" />}
      <label htmlFor={labelFor} className="text-sm font-medium text-gray-700 dark:text-white break-words">
        {label}
      </label>
    </div>
  )
}
