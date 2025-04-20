"use client";

import type { INotification } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNotificationsActions } from "@/hooks/useNotifications";
import { getNotificationIcon, getNotificationMessage } from "@/lib/helpers";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import NotificationsLoadingSkeleton from "@/components/panel/NotificationsSkeleton";

const Notifications = () => {

  const {
    notifications,
    loading,
    fetchData,
    markAllAsRead,
    unreadCount,
    deleteNotification,
  } = useNotificationsActions();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.isRead;
    return notification.type === activeTab;
  });

  if (loading) {
    return <NotificationsLoadingSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <Badge className="bg-primary text-white ml-2">
              {unreadCount} new
            </Badge>
          )}
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={markAllAsRead}
                variant="outline"
                size="sm"
                className="text-sm"
                disabled={unreadCount === 0}
              >
                <Check className="h-4 w-4 mr-1" /> Mark All Read
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mark all notifications as read</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="px-4 pt-2">
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="all" className="text-sm">
              All
              {notifications.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {notifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-sm">
              Unread
              {unreadCount > 0 && (
                <Badge variant="outline" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="follow" className="text-sm">
              Follows
            </TabsTrigger>
            <TabsTrigger value="like" className="text-sm">
              Likes
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-lg font-medium">No notifications</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeTab === "all"
                    ? "You don't have any notifications yet"
                    : activeTab === "unread"
                    ? "You've read all your notifications"
                    : `You don't have any ${activeTab} notifications`}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification: INotification) => (
                <div
                  key={notification._id?.toString()}
                  className={cn(
                    "p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors relative group",
                    !notification.isRead &&
                      "bg-blue-50/60 border-l-4 border-blue-500"
                  )}
                >
                  <div className="flex-shrink-0 mt-1 relative">
                    {!notification.isRead && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 border-2 border-white z-10"></span>
                    )}
                    <Avatar className="h-12 w-12 lg:w-14 shadow-sm lg:h-14 border border-gray-200 dark:border-gray-700">
                      <AvatarImage
                        src={notification.sender.image || undefined}
                        alt={notification.sender.fullName}
                      />
                      <AvatarFallback fallbackKey={notification.sender.email}>
                        {notification.sender.email
                          .substring(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[16px] text-gray-800 font-medium">
                          {getNotificationMessage(notification)}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            {getNotificationIcon(notification.type)}
                            <span className="capitalize">
                              {notification.type}
                            </span>
                          </span>
                          <span>•</span>
                          <time
                            dateTime={new Date(
                              notification.createdAt
                            ).toISOString()}
                            className="text-gray-500"
                          >
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              {
                                addSuffix: true,
                              }
                            )}
                          </time>
                        </div>
                      </div>

                      {/* Preview for post-related notifications */}
                      {notification.post && (
                        <div className="ml-2 flex-shrink-0">
                          <div className="h-14 w-14 rounded-md overflow-hidden border border-gray-200">
                            {notification.post.mediaType === "image" ? (
                              <Image
                                src={notification.post.mediaUrl}
                                height={100}
                                width={100}
                                alt="Post preview"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                                <Bell className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() =>
                        deleteNotification(notification._id?.toString() || "")
                      }
                      className="text-red-600 hover:scale-125 hover:text-red-800"
                    >
                      <Trash2 className="h-8 w-6 mt-3 mx-2" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
