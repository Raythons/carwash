import React from "react";
import { Skeleton } from "../ui/Skeleton";

const AddEditOwnerSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 space-y-6 border dark:border-zinc-800 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-32" />
        {/* New: Animal section skeleton */}
        <div className="space-y-4 pt-6">
          <Skeleton className="h-6 w-48" /> {/* Section title */}
          <div className="flex justify-start">
            <Skeleton className="h-10 w-48 rounded-md" />{" "}
            {/* Add Animal Button */}
          </div>
          <div className="border border-gray-200 dark:border-zinc-800 rounded-md p-4 space-y-4 bg-gray-50 dark:bg-zinc-900/50 transition-colors">
            {/* Skeleton for the header row */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-2 mb-4">
              <Skeleton className="h-6 w-6 rounded-full" />{" "}
              {/* Delete button skeleton */}
              <Skeleton className="h-5 w-28" /> {/* Animal #1 title skeleton */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
        <Skeleton className="h-12 w-40 ml-auto" /> {/* Submit button */}
      </div>
    </div>
  );
};

export default AddEditOwnerSkeleton;
