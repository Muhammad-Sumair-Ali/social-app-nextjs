"use client";
import { INotification } from "@/lib/types";
import axios from "axios";
import { formatDate } from "date-fns";
import React, { useEffect, useState } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/notifications");
      setNotifications(res.data.notifications);
      console.log("RESPONSE DATA NOTIFICATIONS", res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {JSON.stringify(notifications)}
      {notifications?.map((item:INotification,idx:number) => (
        <div key={item._id?.toString() || idx} className="p-3 border-b">
          <p className="text-sm">
            <b>{item.sender.fullName}</b> {item.type === "follow" && "followed you"}
            {item.type === "like" && "liked your post"}
            {item.type === "comment" && "commented on your post"}
          </p>
          <p className="text-xs text-gray-500">{formatDate(new Date(item.createdAt), "PPpp")}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
