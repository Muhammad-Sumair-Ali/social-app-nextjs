"use client";
import { useToast } from "@/components/reuseable/Toast";
import { getFirstNameFromEmail } from "@/lib/helpers";
import axios from "axios";

export const useUsersActions = () => {
  const { toast } = useToast();

  const handleFollow = async (propUser?: any) => {
    try {
      const response = await axios.post("/api/posts/follow", {
        userId: propUser?._id,
      });
      toast({
        title: response.data.following ? "Following" : "Unfollowed",
        description: response.data.following
          ? `You are now following ${
              propUser?.fullName || getFirstNameFromEmail(propUser?.email)
            }`
          : `You unfollowed ${
              propUser?.fullName || getFirstNameFromEmail(propUser?.email)
            }`,
      });
    } catch (error) {
      console.error("Error following user:", error);
      toast({
        title: "Error",
        description: "Could not follow user. Please try again.",
        variant: "destructive",
      });
    }
  };



  return {
    handleFollow,
  };
};
