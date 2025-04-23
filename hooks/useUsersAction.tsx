"use client";
import axios from "axios";
import toast from "react-hot-toast";

export const useUsersActions = () => {
  const handleFollow = async (propUser?: any) => {
    try {
      const response = await axios.post("/api/posts/follow", {
        userId: propUser?._id,
      });
      toast.success(response.data.following ? "Following" : "Unfollowed");
    } catch (error) {
      console.error("Error following user:", error);
      toast("Could not follow/unFollow user. Please try again.");
    }
  };

  return {
    handleFollow,
  };
};
