"use client";

import type React from "react";
import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Twitter,
  Facebook,
  Instagram,
  Copy,
  Bookmark,
  BookmarkCheck,
  UserPlus,
  UserCheck,
  Send,
  Globe,
  MoreVertical,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import CustomVideoPlayer from "../CustomVideoPlayer";
import { usePostsActions } from "@/hooks/usePostsActions";
import { formatDateIntoAgoTimes, getFirstNameFromEmail } from "@/lib/helpers";
import type { PostCardProps } from "@/lib/types";
import Link from "next/link";

const shareLinks = [
  { id: "copy", icon: Copy, label: "Copy link" },
  { id: "twitter", icon: Twitter, label: "Share to Twitter" },
  { id: "facebook", icon: Facebook, label: "Share to Facebook" },
  { id: "instagram", icon: Instagram, label: "Share to Instagram" },
];

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {
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
    commentText,
    setCommentText,
    showComments,
    setShowComments,
    saved,
  } = usePostsActions({ post });

  const [isHovering, setIsHovering] = useState(false);

  return (
    <Card className=" mx-auto overflow-hidden shadow-md rounded-lg bg-gradient-to-t from-gray-50 to-blue-200/20 dark:bg-zinc-900">
      <CardHeader className="px-4 py-3 -mt-4 space-y-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href={`/user/${post.user._id}`}>
              <Avatar className="h-12 w-12 lg:w-14 lg:h-14 border border-gray-200 dark:border-gray-700">
                <AvatarImage
                  src={post?.user.image || ""}
                  alt={post?.user.fullName}
                />
                <AvatarFallback className="bg-gray-200 dark:bg-gray-700">
                  {post?.user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium px-1 text-sm">
                  {post.user.fullName
                    ? post.user.fullName
                    : getFirstNameFromEmail(post.user.email)}
                </p>
              </div>
              <p className="text-xs flex gap-1 items-center text-muted-foreground">
                <Globe className="h-3 w-3" />
                {formatDateIntoAgoTimes(post.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isOwnPost && (
              <Button
                onClick={handleFollow}
                variant={isFollowing ? "outline" : "default"}
                size="sm"
                className="rounded-full text-xs px-3 h-8"
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="h-4 w-4 mr-1" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-1" />
                    Follow
                  </>
                )}
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-muted"
                >
                  <MoreVertical className="h-7 w-7" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={handleSave}
                  className="cursor-pointer"
                >
                  {saved ? (
                    <>
                      <BookmarkCheck className="h-4 w-4 mr-2 text-primary" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save post
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {shareLinks.map((link) => (
                  <DropdownMenuItem
                    key={link.id}
                    onClick={() => handleShare(link.id)}
                    className="cursor-pointer"
                  >
                    <link.icon className="h-4 w-4 mr-2" />
                    {link.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 pt-0 pb-2 -mt-6">
        {post.caption && (
          <p className="text-sm  mb-3 whitespace-pre-line">{post.caption}</p>
        )}
        <div
          className="overflow-hidden rounded-md bg-black"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {post.mediaType === "image" ? (
            <Image
              src={post.mediaUrl}
              alt="Post content"
              width={500}
              height={400}
              unoptimized
              className="w-full object-cover bg-black"
            />
          ) : (
            <CustomVideoPlayer
              src={post.mediaUrl}
              width="100%"
              height="100%"
              className="object-contain"
              autoPlay={false}
              loop={true}
              muted={false}
            />
          )}
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 flex justify-between border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-6 -mt-6">
          {/* Like Button */}
          <Button
            onClick={handleLike}
            variant="ghost"
            size="lg"
            className={`group border relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              liked ? "text-red-500" : "text-gray-600 hover:text-red-500"
            }`}
          >
            <Heart
              className={`w-7 h-7 transition-all duration-300 ${
                liked
                  ? "fill-red-500 scale-125 drop-shadow-md"
                  : "fill-transparent group-hover:scale-110"
              }`}
              strokeWidth={liked ? 0 : 2}
            />
            <span className="text-lg font-semibold">{likesCount}</span>
          </Button>

          {/* Comment Button */}
          <Button
            onClick={() => setShowComments(!showComments)}
            variant="ghost"
            size="lg"
            className="group border relative flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:text-blue-500 transition-all duration-300"
          >
            <MessageCircle className="w-7 h-7 transition-all duration-300 group-hover:scale-110" />
            <span className="text-lg font-semibold">{comments.length}</span>
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="lg"
              className="p-0 h-auto hover:bg-transparent"
            >
              <Share2 className="w-8 h-8 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {shareLinks.map((link) => (
              <DropdownMenuItem
                key={link.id}
                onClick={() => handleShare(link.id)}
                className="cursor-pointer"
              >
                <link.icon className="h-4 w-4 mr-2" />
                {link.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>

      {showComments && (
        <>
          <Separator className="w-full opacity-50" />
          <div className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50">
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={index} className="flex gap-2">
                    <Avatar className="h-8 w-8 border border-white dark:border-zinc-800">
                      <AvatarImage
                        src={comment?.user?.image || ""}
                        alt={comment?.user?.name}
                      />
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-xs">
                        {comment?.user?.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-white dark:bg-zinc-800 rounded-lg px-3 py-2">
                        <p className="text-xs font-medium">
                          {comment.user.name
                            ? comment.user.name
                            : getFirstNameFromEmail(comment.user.email)}
                        </p>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 ml-1">
                        {formatDateIntoAgoTimes(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4 bg-white dark:bg-zinc-800/50 rounded-lg">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>

            <form onSubmit={handleComment} className="mt-3 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 h-10 px-4 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Add a comment..."
              />
              <Button
                type="submit"
                size="sm"
                className="rounded-full px-4 h-10"
                disabled={!commentText.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </Card>
  );
};

export default PostCard;
