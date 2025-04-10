"use client"

import type { INotification } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, Heart, MessageSquare, UserPlus } from "lucide-react"
import axios from "axios"
import { formatDistanceToNow } from "date-fns"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const Notifications = () => {
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await axios.get("/api/notifications")
      setNotifications(res.data.notifications)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "follow":
        return <UserPlus className="h-4 w-4 text-blue-500" />
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-green-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getNotificationMessage = (notification: INotification) => {
    const { type, sender } = notification
    switch (type) {
      case "follow":
        return (
          <>
            <span className="font-semibold">{sender.fullName}</span> started following you
          </>
        )
      case "like":
        return (
          <>
            <span className="font-semibold">{sender.fullName}</span> liked your post
          </>
        )
      case "comment":
        return (
          <>
            <span className="font-semibold">{sender.fullName}</span> commented on your post
          </>
        )
      default:
        return (
          <>
            <span className="font-semibold">{sender.fullName}</span> interacted with you
          </>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Notifications</h2>
        {notifications.length > 0 && (
          <Badge variant="outline" className="bg-primary/10 text-primary border-0">
            {notifications.filter((n) => !n.isRead).length} new
          </Badge>
        )}
      </div>

      <div className="divide-y space-y-3 max-h-[500px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Bell className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification: INotification) => (
            <div
              key={notification._id?.toString()}
              className={cn(
                "p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors",
                !notification.isRead && "bg-blue-50/50",
              )}
            >
              <div className="flex-shrink-0 mt-1">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={notification.sender.image || undefined} alt={notification.sender.fullName} />
                  <AvatarFallback>{getInitials(notification.sender.fullName || "")}</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[16px] text-gray-800">{getNotificationMessage(notification)}</p>
                  {!notification.isRead && <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></span>}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    {getNotificationIcon(notification.type)}
                    <span className="capitalize">{notification.type}</span>
                  </span>
                  <span>•</span>
                  <time dateTime={new Date(notification.createdAt).toISOString()}>
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </time>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Notifications
