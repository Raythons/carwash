import { Skeleton } from "@/components/ui/Skeleton";
export default function AddEditExaminationSkeleton() {
  return (
    <div className="p-6 space-y-6 dark:bg-zinc-900">
      {/* Breadcrumb skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Navigation circles skeleton */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md dark:shadow-zinc-950/50 p-4 sm:p-2 dark:border dark:border-zinc-800">
        <div className="flex flex-wrap justify-start gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="w-[70px] h-[70px] sm:w-[85px] sm:h-[85px] md:w-[100px] md:h-[100px] rounded-lg" />
          ))}
        </div>
      </div>

      {/* Main Form content skeleton */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md dark:shadow-zinc-950/50 p-6 min-h-[400px] dark:border dark:border-zinc-800">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
