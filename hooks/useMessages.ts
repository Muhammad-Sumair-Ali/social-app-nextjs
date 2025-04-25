
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { IMessages, IUser } from "@/lib/types";
import { Types } from "mongoose";
import { 
  useQuery, 
  useMutation, 
  useQueryClient,
} from "@tanstack/react-query";

// Hook for handling message operations with React Query
export const useMessages = (currentUser: IUser | null, receiverId: string) => {
  const queryClient = useQueryClient();
  const [sending, setSending] = useState(false);
  const lastMessageIdRef = useRef<string | null>(null);

  const messagesQueryKey = ['messages', currentUser?._id?.toString(), receiverId];
  
  // Function to fetch messages
  const fetchMessagesFromApi = async () => {
    if (!currentUser?._id || !receiverId) return [];
    
    const res = await axios.get(
      `/api/messages/get?sender=${currentUser._id}&receiver=${receiverId}`
    );
    
    if (res.data && res.data.length > 0) {
      lastMessageIdRef.current = res.data[res.data.length - 1]._id.toString();
    }
    
    return res.data || [];
  };

  const fetchNewMessages = async () => {
    if (!currentUser?._id || !receiverId) return [];
    
    const res = await axios.get(
      `/api/messages/get?sender=${currentUser._id}&receiver=${receiverId}&after=${lastMessageIdRef.current || ''}`
    );
    
    if (res.data && res.data.length > 0) {
      lastMessageIdRef.current = res.data[res.data.length - 1]._id.toString();
      return res.data;
    }
    
    return [];
  };

  const { 
    data: messages = [], 
    isLoading: loading,
    refetch: refetchMessages
  } = useQuery({
    queryKey: messagesQueryKey,
    queryFn: fetchMessagesFromApi,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
  });

  // Mutation for sending messages
  const sendMessageMutation = useMutation({
    mutationFn: async ({ text, receiverUser }: { text: string; receiverUser: IUser }) => {
      return await axios.post("/api/messages", {
        sender: currentUser,
        receiver: receiverUser,
        text: text.trim(),
      });
    },
    onMutate: async ({ text, receiverUser }) => {
      await queryClient.cancelQueries({ queryKey: messagesQueryKey });
      const previousMessages = queryClient.getQueryData(messagesQueryKey);
      
      const tempId = new Types.ObjectId();
      const tempMessage: IMessages = {
        _id: tempId,
        sender: {
          _id: currentUser?._id as Types.ObjectId,
          fullName: currentUser?.fullName || "",
          email: currentUser?.email || "",
          image: currentUser?.image || ""
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
      
      queryClient.setQueryData(messagesQueryKey, (old: IMessages[] = []) => [...old, tempMessage]);
      
      return { previousMessages, tempId };
    },
    onSuccess: (response, _, context) => {
      if (response.data && response.data._id) {
        lastMessageIdRef.current = response.data._id.toString();
        
        queryClient.setQueryData(messagesQueryKey, (old: IMessages[] = []) => {
          return old.map(msg => 
            msg._id === context?.tempId ? response.data : msg
          );
        });
      }
    },
    onError: (_, __, context) => {
      if (context) {
        queryClient.setQueryData(messagesQueryKey, context.previousMessages);
      }
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: messagesQueryKey });
    }
  });

  // Function to send a message
  const sendMessage = async (text: string, receiverUser: IUser) => {
    if (!currentUser || !receiverUser || !text.trim() || sending) return null;
    
    try {
      setSending(true);
      const result = await sendMessageMutation.mutateAsync({ text, receiverUser });
      return result.data?._id || null;
    } catch (err) {
      console.error("Error sending message:", err);
      return null;
    } finally {
      setSending(false);
    }
  };

  // Set up polling for new messages
  useEffect(() => {
    const pollingInterval = setInterval(async () => {
      try {
        const newMessages = await fetchNewMessages();
        
        if (newMessages.length > 0) {
          queryClient.setQueryData(messagesQueryKey, (oldMessages: IMessages[] = []) => {
            const existingIds = new Set(oldMessages.map(msg => msg._id ? msg._id.toString() : ""));
            const filteredNewMessages = newMessages.filter(
              (msg: IMessages) => msg._id && !existingIds.has(msg._id.toString())
            );
            
            return [...oldMessages, ...filteredNewMessages];
          });
        }
      } catch (err) {
        console.error("Error polling messages:", err);
      }
    }, 5000); 
    
    return () => clearInterval(pollingInterval);
  }, [currentUser?._id, receiverId, queryClient]);

  const setupPolling = () => {
    console.log("Polling is now handled automatically by React Query");
  };

  return {
    messages,
    loading,
    sending,
    fetchMessages: refetchMessages,
    sendMessage,
    setupPolling
  };
};
