"use client";

import { useAuth } from "@/app/context/useAuth";
import { useToast } from "@/components/reuseable/Toast";
import { getFirstNameFromEmail } from "@/lib/helpers";
import { PostCardProps } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";

export const usePostsActions = ({post}:PostCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [liked, setLiked] = useState(
    post?.likes.some((postUser: any) => postUser._id === user?._id?.toString())
  );
  const isOwnPost = post?.user?._id.toString() === user?._id?.toString();

  const [likesCount, setLikesCount] = useState(post?.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post?.comments);
  const [saved, setSaved] = useState(false);

  const [isFollowing, setIsFollowing] = useState(
    post?.user.following
      ?.map((id) => id)
      .some((id: any) => id.toString() === user?._id?.toString()) ?? false
  );

 

  const handleLike = async () => {
    try {
      const response = await axios.post("/api/posts/like", {
        postId: post._id,
      });
      setLiked(response.data.liked);
      setLikesCount((prev) => (response.data.liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error("Error liking post:", error);
      toast({
        title: "Error",
        description: "Could not like post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) return;
    try {
      const response = await axios.post("/api/posts/comment", {
        postId: post._id,
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
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Could not add comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFollow = async () => {
    try {
      const response = await axios.post("/api/posts/follow", {
        userId: post.user._id,
      });
      setIsFollowing(response.data.following);
      toast({
        title: response.data.following ? "Following" : "Unfollowed",
        description: response.data.following
          ? `You are now following ${
              post.user.name || getFirstNameFromEmail(post.user.email)
            }`
          : `You unfollowed ${
              post.user.name || getFirstNameFromEmail(post.user.email)
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

  const handleSave = () => {
    setSaved(!saved);
    toast({
      title: saved ? "Removed from saved" : "Saved",
      description: saved
        ? "Post removed from your saved items"
        : "Post added to your saved items",
    });
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
        toast({
          title: "Link copied",
          description: "Post link copied to clipboard",
        });
        break;
      default:
        break;
    }
  };


  useEffect(() => {
    if (user && post?.user?._id) {
      // Check if following exists and is an array
      if (user.following && Array.isArray(user.following)) {
        const followingIds = user.following.map(id => 
          typeof id === 'string' ? id : id.toString()
        );
        setIsFollowing(followingIds.includes(post.user._id.toString()));
      }
    }
  }, [user, post]);
  

  return {
    handleComment,
    handleFollow,
    handleLike,
    handleShare,
    handleSave,
    liked,
    isOwnPost,likesCount,
    isFollowing,
    comments,setComments,
    commentText,setCommentText,
    showComments,setShowComments,
    saved,setSaved

  }


};
