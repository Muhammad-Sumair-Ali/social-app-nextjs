import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen pb-20">
      <div className="bg-white shadow-sm rounded-t-2xl">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Profile Header Skeleton */}
          <div className="flex flex-col md:flex-row pl-5 rounded-xl items-center md:items-start gap-6">
            {/* Avatar Skeleton */}
            <Skeleton className="w-24 h-24 md:w-28 md:h-28 rounded-full" />

            {/* Profile Info Skeleton */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                <Skeleton className="h-7 w-40 mx-auto md:mx-0" />
                <Skeleton className="h-5 w-24 mx-auto md:mx-0" />
              </div>

              {/* Stats Skeleton */}
              <div className="flex justify-center md:justify-start gap-6 mb-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="text-center">
                      <Skeleton className="h-6 w-8 mx-auto mb-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
              </div>

              {/* Bio Skeleton */}
              <Skeleton className="h-5 w-64 mb-4 mx-auto md:mx-0" />

              {/* Website Skeleton */}
              <Skeleton className="h-5 w-32 mb-4 mx-auto md:mx-0" />
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex gap-2 mt-2 md:mt-0">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs Skeleton */}
      <div className="border-b bg-white px-3 pb-2 rounded-b-2xl">
        <div className="max-w-4xl mx-auto h-12 bg-transparent">
          <div className="flex">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="flex-1 h-12 mx-1" />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfilePostsSkeleton() {
  return (
    <div>
      {/* Posts Grid Skeleton */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-md" />
            ))}
        </div>
      </div>
    </div>
  );
}
