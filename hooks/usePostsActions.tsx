"use client";

import { useAuth } from "@/app/context/useAuth";
import { PostCardData, PostCardProps } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// posts , like comment, share, save, follow, unfollow, delete post
export const usePostsActions = ({ post }: PostCardProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [liked, setLiked] = useState(
    post?.likes.some((postUser: any) => postUser._id === user?._id?.toString())
  );
  const isOwnPost = post?.user._id.toString() === user?._id?.toString();

  const [likesCount, setLikesCount] = useState(post?.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post?.comments);
  const [saved, setSaved] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkFollowing = () => {
      const followingIds = Array.isArray(user?.following)
        ? user.following.map((id: any) => id.toString())
        : [];
      const postUserId = post.user?._id?.toString();

      setIsFollowing(followingIds.includes(postUserId));
    };

    checkFollowing();
  }, [user, post]);



  // Delete Post Mutation
  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      return await axios.delete("/api/posts/delete", {
        params: { id: postId },
      });
    },
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      // Invalidate and refetch posts after deletion
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["reels"] });
    },
    onError: (error) => {
      console.error("Error delete Post", error);
      toast.error("Could not delete post. Please try again.");
    },
  });

  const handleDeletepost = async (postId: string) => {
    if (!postId) return;
    deletePostMutation.mutate(postId);
  };

  // Like Post Mutation
  const likePostMutation = useMutation({
    mutationFn: async () => {
      return await axios.post("/api/posts/like", {
        postId: post._id,
        postownerId: post.user._id,
      });
    },
    onSuccess: (response) => {
      setLiked(response.data.liked);
      setLikesCount((prev) => (response.data.liked ? prev + 1 : prev - 1));
      toast.success(response.data.liked ? "Post Liked" : "Post Unliked");
      // Update post cache
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Error liking post:", error);
      toast.error("Could not like post. Please try again.");
    },
  });

  const handleLike = async () => {
    likePostMutation.mutate();
  };

  // Comment Post Mutation
  const commentPostMutation = useMutation({
    mutationFn: async (commentData: { text: string }) => {
      return await axios.post("/api/posts/comment", {
        postId: post._id,
        postownerId: post.user._id,
        text: commentData.text,
      });
    },
    onSuccess: (response) => {
      const newComment = response.data;
      setComments((prev) => [
        ...prev,
        {
          ...newComment,
        },
      ]);
      setCommentText("");
      toast.success("Comment added successfully!");
      // Update post cache to reflect new comment
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
      toast.error("Could not add comment. Please try again.");
    },
  });

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    commentPostMutation.mutate({ text: commentText });
  };

  // Follow User Mutation
  const followUserMutation = useMutation({
    mutationFn: async () => {
      return await axios.post("/api/posts/follow", {
        userId: post.user._id,
      });
    },
    onSuccess: (response) => {
      setIsFollowing(response.data.following);
      toast.success(response.data.following ? "Following" : "Unfollowed");
      // Update user data in cache
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Error following user:", error);
      toast.error("Could not follow user. Please try again");
    },
  });

  const handleFollow = async () => {
    followUserMutation.mutate();
  };

  // Save Post Function
  const savePostMutation = useMutation({
    mutationFn: async () => {
      // You should implement an API endpoint for saving posts
      return await axios.post("/api/posts/save", {
        postId: post._id,
      });
    },
    onSuccess: (response) => {
      setSaved(response.data.saved);
      toast.success(response.data.saved ? "Post saved" : "Post unsaved");
      // Update saved posts in cache if you have a separate query for it
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
    },
    onError: () => {
      toast.error("Could not save post. Please try again.");
    },
  });

  const handleSave = () => {
    setSaved(!saved);
    toast.success("Post saved successfully!");
  };

  const handleShare = (platform: string) => {
    const postUrl = `${window.location.origin}/posts/${post._id}`;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            postUrl
          )}&text=${encodeURIComponent(post.caption || "Check out this post!")}`
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            postUrl
          )}`
        );
        break;
      case "copy":
        navigator.clipboard.writeText(postUrl);
        toast.success("Post URL copied to clipboard!");
        break;
      default:
        break;
    }
  };

  return {
    handleDeletepost,
    handleComment,
    handleFollow,
    handleLike,
    handleShare,
    handleSave,
    liked,
    isOwnPost,
    likesCount,
    isFollowing,
    comments,
    setComments,
    commentText,
    setCommentText,
    showComments,
    setShowComments,
    saved,
    setSaved,
    isDeleting: deletePostMutation.isPending,
    isLiking: likePostMutation.isPending,
    isCommenting: commentPostMutation.isPending,
    isFollowingLoading: followUserMutation.isPending,
    isSaving: savePostMutation.isPending,
  };
};




// fetch posts data hooks with React Query
export const useFetchPosts = () => {
  const queryClient = useQueryClient();

  // Query for fetching all posts
  const {
    data: posts = [],
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await axios.get("/api/posts");
      return response.data.posts as PostCardData[];
    },
    refetchOnWindowFocus: true,
    staleTime: 60000, 
  });

  // Query for fetching reels
  const {
    data: reels = [],
    isLoading: reelsLoading,
    error: reelsError,
    refetch: refetchReels,
  } = useQuery({
    queryKey: ["reels"],
    queryFn: async () => {
      const response = await axios.get("/api/posts/get-reels");
      return response.data.data as PostCardData[];
    },
    refetchOnWindowFocus: true,
    staleTime: 60000, // 1 minute
  });

  // Create Post Mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      return await axios.post("/api/posts/create", postData);
    },
    onSuccess: () => {
      toast.success("Post created successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["reels"] });
    },
    onError: () => {
      toast.error("Failed to create post. Please try again.");
    },
  });

  const loading = postsLoading || reelsLoading;
  const error = postsError
    ? "Failed to load posts. Please try again later."
    : reelsError
    ? "Failed to load reels. Please try again later."
    : "";

  return {
    posts,
    reels,
    loading,
    error,
    refetchPosts,
    refetchReels,
    createPost: createPostMutation.mutate,
    isCreatingPost: createPostMutation.isPending,
  };
};




// separate hook for user posts
export const useUserPosts = (user: any) => {
  const {
    data: userPosts = [],
    isLoading,
    error,
    refetch: refetchUserPosts
  } = useQuery({
    queryKey: ["userPosts", user?._id],
    queryFn: async () => {
      const response = await axios.post("/api/posts/userposts", {
        userId: user._id,
      });
      return response.data.posts as PostCardData[];
    },
    refetchOnWindowFocus: true,
    staleTime: 60000,
    enabled: !!user && !!user._id,
  });

  const effectiveIsLoading = !user || isLoading;

  return {
    userPosts,
    isLoading: effectiveIsLoading,
    error: error ? "Failed to load user posts. Please try again later." : "",
    refetchUserPosts
  };
};