"use client";

import { useAuth } from "@/app/context/useAuth";
import { INotification } from "@/lib/types";
import axios from "axios";
import { useCallback, useState } from "react";

export const useNotificationsActions = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/notifications");
      setNotifications(response.data.notifications);
      setError(null);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await axios.put("/api/notifications");
      await fetchData();

      if (typeof window !== "undefined") {
        localStorage.removeItem("unreadNotificationsCount");
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      setError("Failed to mark notifications as read");
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await axios.put(`/api/notifications/${notificationId}`, {
        isRead: true,
      });
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id?.toString() === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
      setError("Failed to mark notification as read");
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await axios.delete(`/api/notifications`, {
        params: {
          id: notificationId,
        },
      });
      await fetchData();
    } catch (err) {
      console.error("Error deleting notification:", err);
      setError("Failed to delete notification");
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (unreadCount) {
    localStorage.setItem(
      "unreadNotificationsCount",
      JSON.stringify({
        userId: user?._id,
        counts: unreadCount,
      })
    );
  }
  return {
    unreadCount,
    notifications,
    loading,
    error,
    fetchData,
    markAllAsRead,
    markAsRead,
    deleteNotification,
  };
};
