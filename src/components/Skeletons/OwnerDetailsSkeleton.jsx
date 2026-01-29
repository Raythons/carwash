import { Skeleton } from "../ui/Skeleton";
export function OwnerDetailsSkeleton() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-9 w-56" />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-4 sm:p-6 border border-primary-200 dark:border-zinc-800 mb-6">
        <div className="w-full">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4 min-w-0">
              <div className="bg-primary-50 dark:bg-zinc-800/50 p-4 rounded-lg">
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="bg-primary-50 dark:bg-zinc-800/50 p-4 rounded-lg">
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-6 w-28" />
              </div>
            </div>
            <div className="space-y-4 min-w-0">
              <div className="bg-primary-50 dark:bg-zinc-800/50 p-4 rounded-lg">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="bg-primary-50 dark:bg-zinc-800/50 p-4 rounded-lg">
                <Skeleton className="h-5 w-28 mb-2" />
                <Skeleton className="h-6 w-36" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-primary-200 dark:border-zinc-800">
        <div className="p-4 sm:p-6 flex justify-between items-center border-b border-primary-200 dark:border-zinc-800">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>

        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-zinc-800/50 dark:to-zinc-800/30 p-4 sm:p-6 rounded-xl border border-primary-200 dark:border-zinc-700/50"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        <Skeleton className="h-16 w-full rounded-lg" />
                        <Skeleton className="h-16 w-full rounded-lg" />
                        <Skeleton className="h-16 w-full rounded-lg sm:col-span-2 xl:col-span-1" />
                      </div>
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full sm:w-28 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
