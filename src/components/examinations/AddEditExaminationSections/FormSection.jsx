"use client"

import { cn } from "@/lib/utils"

export function FormSection({ title, icon: Icon, children, className = "" }) {
  return (
    <div
      className={cn(
        "bg-gradient-to-br from-gray-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-4 shadow-sm hover:shadow-md dark:shadow-zinc-950/50 transition-shadow duration-200 space-y-4",
        className,
      )}
    >
      {/* Section Header */}
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl border dark:border-zinc-700">
            <Icon className="w-5 h-5 text-gray-600 dark:text-zinc-300" />
          </div>
        )}
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
      </div>

      {/* Section Content */}
      <div className="pt-4">{children}</div>
    </div>
  )
}

export function FormGrid({ children, cols = 2, className = "" }) {
  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-4",
  }[cols]

  return <div className={cn("grid gap-5", gridClass, className)}>{children}</div>
}
