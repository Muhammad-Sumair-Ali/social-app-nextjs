import { useState, useEffect } from "react";
import axios from "axios";
import { IUser } from "@/lib/types";

// Hook for handling receiver user data
export const useReceiver = (receiverId: string) => {
  const [receiverUser, setReceiverUser] = useState<IUser | null>(null);

  const fetchReceiver = async () => {
    if (!receiverId) return;
    try {
      const res = await axios.get(`/api/auth/user/${receiverId}`);
      setReceiverUser(res.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchReceiver();
  }, [receiverId]);

  return {
    receiverUser,
    fetchReceiver
  };
};