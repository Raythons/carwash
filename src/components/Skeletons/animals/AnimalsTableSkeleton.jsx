import { Skeleton } from "@/components/ui/Skeleton";

export default function AnimalsTableSkeleton() {
  return (
    <div className="w-full max-w-full" dir="rtl">
      {/* Search Component Skeleton */}

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm overflow-hidden border border-primary-200 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-primary-200 dark:divide-zinc-800">
            <thead className="bg-primary-50 dark:bg-zinc-800/50">
              <tr>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <th
                    key={i}
                    scope="col"
                    className="px-4 sm:px-6 py-4 text-right"
                  >
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-primary-200 dark:divide-zinc-800">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                    <td key={j} className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-24" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Skeleton */}
        <div className="bg-primary-50 dark:bg-zinc-800/30 px-4 sm:px-6 py-4 border-t border-primary-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Skeleton className="h-5 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-16" />
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8 w-10" />
                ))}
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
