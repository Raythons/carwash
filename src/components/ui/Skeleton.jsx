import { cn } from "../../utilities/cn";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-zinc-800", className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md border border-primary-200 dark:border-zinc-800">
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-6" dir="rtl">
      <Skeleton className="h-8 w-64 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

export function OwnersTableSkeleton() {
  return (
    <div className="p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md overflow-hidden border border-primary-200 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-primary-200 dark:divide-zinc-800">
            <thead className="bg-primary-50 dark:bg-zinc-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-right">
                  <Skeleton className="h-4 w-20" />
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  <Skeleton className="h-4 w-24" />
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  <Skeleton className="h-4 w-32" />
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  <Skeleton className="h-4 w-20 mx-auto" />
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-primary-200 dark:divide-zinc-800">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-28" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-24" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-32" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex justify-center gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
