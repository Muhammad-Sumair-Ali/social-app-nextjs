import { Bell, Heart, MessageSquare, UserPlus } from "lucide-react";
import { INotification } from "./types";

export const formatDateIntoAgoTimes = (dateString: string) => {
  try {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours   = Math.floor(minutes / 60);
    const days    = Math.floor(hours / 24);
    const weeks   = Math.floor(days / 7);
    const months  = Math.floor(days / 30);
    const years   = Math.floor(days / 365);

    if (years >= 1) return `${years} year${years > 1 ? "s" : ""} ago`;
    if (months >= 1) return `${months} month${months > 1 ? "s" : ""} ago`;
    if (weeks >= 1) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes >= 1) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "just now";
  } catch {
    return "recently";
  }
};



  export function getFirstNameFromEmail(email:string) {
    return email.split('@')[0];
}


  // Get initials for avatar fallback
  export const getInitials = (name?: string | null): string => {
    if (!name) return "U";
    const nameParts = name.trim().split(/\s+/);

    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      const firstInitial = nameParts[0].charAt(0);
      const lastInitial = nameParts[nameParts.length - 1].charAt(0);
      return (firstInitial + lastInitial).toUpperCase();
    }
  };

 // params give medial url of image / videos , he was return this file publicId
  export const extractPublicId = (mediaUrl: string): string => {
  try {
    if (typeof mediaUrl !== "string") {
      throw new Error("Invalid media URL");
    }

    const parts = mediaUrl.split("/upload/");
    if (parts.length < 2) {
      throw new Error("Invalid media URL format");
    }

    const afterVersion = parts[1].split("/");
    
    if (afterVersion.length > 0) {
      const lastSegment = afterVersion[afterVersion.length - 1];

      return lastSegment.split(".")[0];
    }

    throw new Error("Could not extract public ID");
  } catch (error) {
    console.error("Error extracting public_id:", error);
    return "";
  }
};



//  get bg colors for user avatra fallback 
export function getColorFromString(str: string): string {
  const colors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-cyan-500",
    "bg-emerald-500",
    "bg-lime-500",
    "bg-amber-500",
    "bg-fuchsia-500",
    "bg-rose-500",
    "bg-violet-500",
    "bg-sky-500",
    "bg-zinc-500",
    "bg-stone-500",
    "bg-neutral-500"
  ];
  

  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const index = Math.abs(hash % colors.length)
  return colors[index]
}


// for notifications helpers

export const getNotificationIcon = (type: string) => {
  switch (type) {
    case "follow":
      return <UserPlus className="h-4 w-4 text-blue-500" />;
    case "like":
      return <Heart className="h-4 w-4 text-red-500" />;
    case "comment":
      return <MessageSquare className="h-4 w-4 text-green-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

export const getNotificationMessage = (notification: INotification) => {
  const { type, sender } = notification;
  switch (type) {
    case "follow":
      return (
        <>
          <span className="font-semibold">{sender.fullName}</span> started
          following you
        </>
      );
    case "like":
      return (
        <>
          <span className="font-semibold">{sender.fullName}</span> liked your
          post
        </>
      );
    case "comment":
      return (
        <>
          <span className="font-semibold">{sender.fullName}</span> commented
          on your post
        </>
      );
    default:
      return (
        <>
          <span className="font-semibold">{sender.fullName}</span> interacted
          with you
        </>
      );
  }
};