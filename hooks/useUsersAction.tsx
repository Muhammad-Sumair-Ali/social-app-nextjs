"use client";
import axios from "axios";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IUser } from "@/lib/types";

export const useUsersActions = () => {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await axios.post("/api/posts/follow", {
        userId,
      });
      return response.data;
    },
    onSuccess: (data, userId) => {
      toast.success(data.following ? "Following" : "Unfollowed");
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });

      queryClient.setQueryData(
        ["user", userId],
        (oldData: IUser | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            isFollowing: data.following,
          };
        }
      );
    },
    onError: (error) => {
      console.error("Error following user:", error);
      toast.error("Could not follow/unFollow user. Please try again.");
    },
  });

  // Handle follow/unfollow action
  const handleFollow = async (propUser?: any) => {
    if (!propUser?._id) {
      toast.error("Invalid user");
      return;
    }

    try {
      await followMutation.mutateAsync(propUser._id);
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  };

  const fetchUserById = async (id: string) => {
    try {
      const res = await axios.get(`/api/auth/user/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  };

  const useUser = (userId: string | undefined) => {
    return useQuery({
      queryKey: ["user", userId],
      queryFn: () => fetchUserById(userId as string),
      enabled: !!userId, 
      staleTime: 1000 * 60 * 5, 
      refetchOnWindowFocus: false,
    });
  };

  return {
    handleFollow,
    fetchUserById,
    useUser,
    isFollowLoading: followMutation.isPending
  };
};
