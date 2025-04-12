"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Bell, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const NotificationsLoadingSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Notifications</h2>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        <Button variant="outline" size="sm" className="text-sm" disabled>
          <Check className="h-4 w-4 mr-1" /> Mark All Read
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="px-4 pt-2">
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="all" className="text-sm">
              All
              <Skeleton className="ml-2 h-5 w-6 rounded-full" />
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-sm">
              Unread
              <Skeleton className="ml-2 h-5 w-6 rounded-full" />
            </TabsTrigger>
            <TabsTrigger value="follow" className="text-sm">
              Follows
            </TabsTrigger>
            <TabsTrigger value="like" className="text-sm">
              Likes
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors relative group">
                <div className="flex-shrink-0 mt-1 relative">
                  <Skeleton className="h-12 w-12 lg:w-14 lg:h-14 rounded-full" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="w-full">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <div className="flex items-center gap-2 mt-1">
                        <Skeleton className="h-4 w-16" />
                        <span>•</span>
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>

                    <div className="ml-2 flex-shrink-0">
                      <Skeleton className="h-14 w-14 rounded-md" />
                    </div>
                  </div>
                </div>

                <div>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default NotificationsLoadingSkeleton
