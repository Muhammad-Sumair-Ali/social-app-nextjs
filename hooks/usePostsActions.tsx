"use client";

import { useAuth } from "@/app/context/useAuth";
import { PostCardData, PostCardProps } from "@/lib/types";
import axios from "axios";
import {  useEffect, useState } from "react";
import toast from "react-hot-toast";


// posts , like comment, share, save, follow, unfollow, delete post
export const usePostsActions = ({ post }: PostCardProps) => {
  const { user } = useAuth();
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




    const handleDeletepost = async (postId: string) => {
      if (!postId) return;
      try {
          await axios.delete("/api/posts/delete", {
          params: {
            id: postId,
          },
        });
        toast.success("Post deleted successfully!");
      } catch (error) {
        console.error("Error delete Post", error);
        toast.error("Could not delete post. Please try again.");
      }
    };
    
  const handleLike = async () => {
    try {
      const response = await axios.post("/api/posts/like", {
        postId: post._id,
        postownerId: post.user._id
      });
      setLiked(response.data.liked);
      setLikesCount((prev) => (response.data.liked ? prev + 1 : prev - 1));
      toast.success("Post Liked")
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Could not like post. Please try again.");
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) return;
    try {
      const response = await axios.post("/api/posts/comment", {
        postId: post._id,
        postownerId: post.user._id,
        text: commentText,
      });

      if (response.data) {
        const newComment = response.data;
        setComments((prev) => [
          ...prev,
          {
            ...newComment,
          },
        ]);
        setCommentText("");
      }
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Could not add comment. Please try again.");
    }
  };

  const handleFollow = async () => {
    try {
      const response = await axios.post("/api/posts/follow", {
        userId: post.user._id,
      });
      setIsFollowing(response.data.following);
      toast.success(response.data.following ? "Following" : "Unfollowed",);
    } catch (error) {
      console.error("Error following user:", error);
      toast("Could not follow user. Please try again");
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    toast("Post saved successfully!");
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
  };
};



// fetch posts data hooks
export const useFetchPosts = () => {
  const [posts, setPosts] = useState<PostCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reels, setReels] = useState<PostCardData[]>([]);


  const handleFetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/posts");
      const newPosts = response.data.posts;

      // setPosts((prevPosts) => {
      //   const combined = [...prevPosts, ...newPosts];
      //   const uniquePosts = combined.filter(
      //     (post, index, self) =>
      //       index === self.findIndex((p) => p._id === post._id)
      //   );
      //   return uniquePosts;
      // });
      
      setPosts(newPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


    async function fetchReels() {
      try {
        setLoading(true);
        const res = await axios.get("/api/posts/get-reels");
        setReels(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("ERROR getting reels", error);
        setError("Failed to load reels. Please try again later.");
        setLoading(false);
      }
    }


  const refetchPosts = async () => {
    setPosts([]); 
    await handleFetchPosts(); 
  };
  

  

  return {
    refetchPosts,
    setLoading,
    posts,
    loading,
    error,
    handleFetchPosts,
    reels,fetchReels
  };
};
