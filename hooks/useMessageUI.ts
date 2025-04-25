import { useRef, useEffect } from "react";
import { format } from "date-fns";
import { IMessages } from "@/lib/types";
import { Types } from "mongoose";

// Hook for handling message UI interactions
export const useMessageUI = (messages: IMessages[], currentUserId?: Types.ObjectId) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  // Check if sender is current user
  const isCurrentUser = (senderId: Types.ObjectId) => {
    return senderId.toString() === currentUserId?.toString();
  };

  // Group messages by date
  const groupedMessages = messages.reduce<{
    [date: string]: IMessages[];
  }>((groups, message) => {
    const date = format(new Date(message.timestamp), "MMMM d, yyyy");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  const focusInput = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [messages.length]);

  return {
    messagesEndRef,
    inputRef,
    scrollToBottom,
    isCurrentUser,
    groupedMessages,
    focusInput
  };
};