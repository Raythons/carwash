import { Skeleton } from "./../ui/Skeleton";

export default function OwnersTableSkeleton() {
  return (
    <div className="w-full max-w-full" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-12 w-36" />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-primary-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Skeleton className="h-12 w-full sm:w-96" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-primary-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-primary-200">
            <thead className="bg-primary-50">
              <tr>
                <th scope="col" className="px-4 sm:px-6 py-4 text-right">
                  <Skeleton className="h-4 w-20" />
                </th>
                <th scope="col" className="px-4 sm:px-6 py-4 text-right">
                  <Skeleton className="h-4 w-24" />
                </th>
                <th
                  scope="col"
                  className="px-4 sm:px-6 py-4 text-right hidden sm:table-cell"
                >
                  <Skeleton className="h-4 w-32" />
                </th>
                <th scope="col" className="px-4 sm:px-6 py-4 text-center">
                  <Skeleton className="h-4 w-20 mx-auto" />
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-primary-200">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24 sm:hidden" />
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <Skeleton className="h-5 w-24" />
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <Skeleton className="h-5 w-32" />
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
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
