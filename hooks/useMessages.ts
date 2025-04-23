import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { IMessages, IUser } from "@/lib/types";
import { Types } from "mongoose";

// Hook for handling message operations
export const useMessages = (currentUser: IUser | null, receiverId: string) => {
  const [messages, setMessages] = useState<IMessages[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  // Poll for new messages
  const setupPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(async () => {
      if (!currentUser?._id || !receiverId) return;
      
      try {
        const res = await axios.get(
          `/api/messages/get?sender=${currentUser._id}&receiver=${receiverId}&after=${lastMessageIdRef.current || ''}`
        );
        
        if (res.data && res.data.length > 0) {
          setMessages(prev => [...prev, ...res.data]);
          lastMessageIdRef.current = res.data[res.data.length - 1]._id.toString();
        }
      } catch (err) {
        console.error("Error polling messages:", err);
      }
    }, 8000);
  };

  // Fetch all messages
  const fetchMessages = async () => {
    if (!currentUser?._id || !receiverId) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/messages/get?sender=${currentUser._id}&receiver=${receiverId}`
      );
      setMessages(res.data);
      
      if (res.data.length > 0) {
        lastMessageIdRef.current = res.data[res.data.length - 1]._id.toString();
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  // Send a new message
  const sendMessage = async (text: string, receiverUser: IUser) => {
    if (!currentUser || !receiverUser || !text.trim() || sending) return null;
    
    const tempId = new Types.ObjectId();

    try {
      setSending(true);
      
      // Create temporary message 
      const tempMessage: IMessages = {
        _id: tempId,
        sender: {
          _id: currentUser._id as Types.ObjectId,
          fullName: currentUser.fullName,
          email: currentUser.email,
          image: currentUser.image
        },
        receiver: {
          _id: receiverUser._id as Types.ObjectId,
          fullName: receiverUser.fullName,
          email: receiverUser.email,
          image: receiverUser.image
        },
        text: text.trim(),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, tempMessage]);
      
      const response = await axios.post("/api/messages", {
        sender: currentUser,
        receiver: receiverUser,
        text: text.trim(),
      });
      
      if (response.data && response.data._id) {
        lastMessageIdRef.current = response.data._id.toString();
      }
      
      return tempId;
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
      return null;
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  return {
    messages,
    loading,
    sending,
    fetchMessages,
    sendMessage,
    setupPolling
  };
};