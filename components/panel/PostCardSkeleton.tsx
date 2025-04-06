import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export default function PostCardSkeleton() {
  return (
    <Card className="mx-auto overflow-hidden shadow-md rounded-lg bg-white dark:bg-zinc-900">
      <CardHeader className="px-4 py-3 -mt-4 space-y-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-12 w-12 lg:w-14 lg:h-14 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 pt-0 pb-2 -mt-6">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-3" />
        <Skeleton className="w-full aspect-square rounded-md" />
      </CardContent>

      <CardFooter className="px-4 py-3 flex justify-between border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-6 -mt-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-5 w-8" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-5 w-8" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </CardFooter>

      <Separator className="w-full opacity-50" />
      <div className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50">
        <div className="max-h-60 space-y-3 pr-1">
          {/* Comment skeletons */}
          {[1].map((_, index) => (
            <div key={index} className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <div className="bg-white dark:bg-zinc-800 rounded-lg px-3 py-2">
                  <Skeleton className="h-3 w-20 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-2 w-12 mt-1 ml-1" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <Skeleton className="flex-1 h-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </Card>
  )
}

