"use client";

import { useAuth } from "@/app/context/useAuth";
import { useToast } from "@/components/reuseable/Toast";
import { getFirstNameFromEmail } from "@/lib/helpers";
import axios from "axios";
import { useEffect, useState } from "react";

export const useUsersActions = (propUser: any) => {
  const { user: currentUser } = useAuth(); // Logged-in user
  const [isFollowing, setIsFollowing] = useState(false);

  // Check if the current user follows the propUser
  useEffect(() => {
    if (currentUser && propUser) {
      const followingIds = currentUser.following?.type.map((id: any) => id.toString()) || [];
      setIsFollowing(followingIds.includes(propUser._id?.toString()));
    }
  }, [currentUser, propUser]);

  return { isFollowing };
};

// Separate follow function to pass in props
export const handleFollow = async (user: any) => {
    const { user: currentUser } = useAuth(); 
    const { toast } = useToast();
    console.log("USER JISKO FOLLOW KARNA HAI", user);
  
    if (!currentUser || !user) return;
  
    try {
      const response = await axios.post("/api/users/follow", {
        userId: user._id, // User to follow
      });
  
      const isNowFollowing = response.data.following;
  
      toast({
        title: isNowFollowing ? "Following" : "Unfollowed",
        description: isNowFollowing
          ? `You are now following ${user.name}`
          : `You unfollowed ${user.name}`,
      });
  
      return isNowFollowing; // Follow state return karega
    } catch (error) {
      console.error("Error following user:", error);
      toast({
        title: "Error",
        description: "Could not follow user. Please try again.",
        variant: "destructive",
      });
  
      return null;
    }
  };
