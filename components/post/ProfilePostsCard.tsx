"use client";

import { useState, useRef } from "react";
import { Heart, MessageCircle, X } from "lucide-react";
import type { PostCardProps } from "@/lib/types";
import CustomVideoPlayer, { VideoPlayerRef } from "../CustomVideoPlayer";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFetchPosts, usePostsActions } from "@/hooks/usePostsActions";
import { Button } from "../ui/button";
import { useAuth } from "@/app/context/useAuth";

export function ProfilePostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const {
    handleComment,
    handleLike,
    handleSave,
    liked,
    isOwnPost,
    likesCount,
    isFollowing,
    comments,
    commentText,
    setCommentText,
    saved,
    handleFollow,
    handleDeletepost,
  } = usePostsActions({ post });
  const { refetchPosts } = useFetchPosts();

  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef<VideoPlayerRef>(null);

  // Handle hover state for videos
  const handleMouseEnter = () => {
    setIsHovering(true);
    if (post.mediaType === "video" && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch((err) => console.log("Play error:", err));
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (post.mediaType === "video" && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const deletePost = async (postId: string) => {
    if (!postId) return new Error("Post Id Is required");
    await handleDeletepost(postId);
    refetchPosts();
  };

  return (
    <>
      <div
        className="aspect-square overflow-hidden relative cursor-pointer rounded-xl group bg-black/5 dark:bg-white/5 transition-all duration-300 shadow-md hover:shadow-xl w-full h-full"
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onClick={() => setIsModalOpen(true)}
        style={{ minHeight: "280px" }}
      >
        {post.mediaType === "image" ? (
          <Image
            width={400}
            height={400}
            priority
            src={post.mediaUrl || ""}
            alt={post.caption}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center relative">
            <CustomVideoPlayer
              ref={videoRef}
              src={post.mediaUrl}
              width="100%"
              height="100%"
              className="object-cover"
              autoPlay={false}
              muted
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                  isHovering ? "opacity-0" : "opacity-100"
                }`}
              >
                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
              </div>
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:opacity-0 opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-6 w-6 border-2 border-white">
              <AvatarImage
                src={post.user.image || ""}
                alt={post.user.fullName || post.user.email}
              />
              <AvatarFallback>
                {(
                  post.user.fullName?.[0] ||
                  post.user.email?.[0] ||
                  "U"
                ).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="font-medium text-xs text-white truncate">
              {post.user.fullName || post.user.name}
            </p>
          </div>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 fill-white" />
                <span className="text-xs font-medium">{post.likes.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4 fill-white/10" />
                <span className="text-xs font-medium">
                  {post.comments?.length || 0}
                </span>
              </div>
            </div>
            <span className="text-[10px] opacity-80">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Post Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[1000px] p-0 overflow-hidden max-h-[90vh] h-[90vh] flex flex-col">
          <DialogClose className="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-6 w-6 text-white bg-black/20 rounded-full p-1" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogTitle className="sr-only">Post Details</DialogTitle>

          <div className="flex flex-col md:flex-row h-full overflow-hidden">
            {/* Media Section */}
            <div className="w-full md:w-3/5 bg-black flex items-center justify-center h-auto max-h-[40vh] md:max-h-full">
              {post.mediaType === "image" ? (
                <div className="relative w-full h-full">
                  <Image
                    src={post.mediaUrl || ""}
                    alt={post.caption}
                    className="w-full h-full object-contain"
                    width={800}
                    height={800}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <CustomVideoPlayer
                    src={post.mediaUrl}
                    width="100%"
                    height="100%"
                    className="object-contain"
                    autoPlay={true}
                  />
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="w-full md:w-2/5 p-4 flex flex-col h-full overflow-y-auto">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={post.user.image || ""}
                    alt={post.user.fullName || post.user.email}
                  />
                  <AvatarFallback>
                    {(
                      post.user.fullName?.[0] ||
                      post.user.email?.[0] ||
                      "U"
                    ).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {post.user.fullName || post.user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                {!isOwnPost && (
                  <Button
                    onClick={handleFollow}
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}
                {isOwnPost && (
                  <Button
                    onClick={() => deletePost(post._id)}
                    variant="destructive"
                    size="sm"
                    className="ml-auto sm:mr-10"
                  >
                    Delete
                  </Button>
                )}
              </div>

              {/* Caption */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">Caption</h3>
                <p className="text-sm">{post.caption}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 mb-4 pb-3 border-b">
                <div className="flex items-center gap-2">
                  {/* Like Button */}
                  <Button
                    onClick={() => (user ? handleLike() : null)}
                    variant="ghost"
                    size="sm"
                    className={`group border relative flex items-center gap-1 px-2 py-1 rounded-xl transition-all duration-300 ${
                      liked
                        ? "text-red-500"
                        : "text-gray-600 hover:text-red-500"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 transition-all duration-300 ${
                        liked
                          ? "fill-red-500 scale-125 drop-shadow-md"
                          : "fill-transparent group-hover:scale-110"
                      }`}
                      strokeWidth={liked ? 0 : 2}
                    />
                    <span className="text-sm font-semibold">{likesCount}</span>
                  </Button>
                  <span className="text-sm font-medium">
                    {likesCount} likes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {comments?.length || 0} comments
                  </span>
                </div>
                <Button
                  onClick={() => handleSave()}
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                >
                  {saved ? "Saved" : "Save"}
                </Button>
              </div>

              {/* Comments - Main scrollable area */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <h3 className="text-lg font-semibold mb-2">Comments</h3>
                {comments && comments.length > 0 ? (
                  <div className="space-y-3">
                    {comments.map((comment, index) => (
                      <div key={index} className="flex gap-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage
                            src={comment.user?.image || ""}
                            alt={comment.user?.name}
                          />
                          <AvatarFallback>
                            {(comment.user?.name?.[0] || "U").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-muted p-2 rounded-lg">
                            <p className="font-medium text-sm">
                              {comment.user?.name}
                            </p>
                            <p className="text-sm">{comment?.text}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No comments yet.
                  </p>
                )}
              </div>

              {/* Comment Input - Fixed at bottom */}
              <div className="mt-3 pt-3 border-t">
                <form onSubmit={handleComment} className="flex gap-2">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage
                      src={user?.image || "/placeholder.svg?height=32&width=32"}
                      alt={user?.fullName || "Your profile"}
                    />
                    <AvatarFallback>
                      {user?.fullName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 bg-muted px-3 py-2 rounded-l-full text-sm focus:outline-none"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="bg-primary text-primary-foreground px-3 rounded-r-full text-sm font-medium"
                      disabled={!commentText.trim()}
                    >
                      Post
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
