import { Skeleton } from "@/components/ui/Skeleton";

function AnimalsMobileCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-primary-200 p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="w-9 h-9 rounded-lg" />
      </div>

      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28 ml-2" />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  );
}

export default function AnimalsMobileListSkeleton() {
  return (
    <div className="md:hidden">
      {[...Array(4)].map((_, i) => (
        <AnimalsMobileCardSkeleton key={i} />
      ))}
    </div>
  );
}
