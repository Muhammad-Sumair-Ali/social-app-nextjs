"use client";

import type React from "react";
import {
  Heart,
  MessageCircle,
  Share2,
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
  Delete,
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
import { useFetchPosts, usePostsActions } from "@/hooks/usePostsActions";
import { formatDateIntoAgoTimes, getFirstNameFromEmail } from "@/lib/helpers";
import type { PostCardProps } from "@/lib/types";
import Link from "next/link";
import { useState, useEffect } from "react";
import { LoginRequiredModal } from "../reuseable/LoginRequiredModal";
import { useAuth } from "@/app/context/useAuth";

const shareLinks = [
  { id: "copy", icon: Copy, label: "Copy link" },
  { id: "twitter", icon: Twitter, label: "Share to Twitter" },
  { id: "facebook", icon: Facebook, label: "Share to Facebook" },
  { id: "instagram", icon: Instagram, label: "Share to Instagram" },
];

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {
    handleComment,
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
    handleFollow,
    handleDeletepost,
  } = usePostsActions({ post });
  const { refetchPosts } = useFetchPosts();
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [mediaOrientation, setMediaOrientation] = useState("landscape");
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const deletePost = async (postId: string) => {
    if (!postId) return new Error("Post Id Is required");
    await handleDeletepost(postId);
    refetchPosts();
  };

  // Check media orientation when it loads
  const handleMediaLoad = (
    e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement>
  ) => {
    const element = e.currentTarget;
    const width =
      element instanceof HTMLImageElement
        ? element.naturalWidth
        : element instanceof HTMLVideoElement
        ? element.videoWidth
        : 0;
    const height =
      element instanceof HTMLImageElement
        ? element.naturalHeight
        : element instanceof HTMLVideoElement
        ? element.videoHeight
        : 0;

    if (height > width) {
      setMediaOrientation("portrait");
    } else {
      setMediaOrientation("landscape");
    }

    setMediaLoaded(true);
  };

  return (
    <Card className="mx-auto overflow-hidden shadow-md rounded-lg bg-gradient-to-t from-gray-50 to-blue-200/20 dark:bg-zinc-900">
      <CardHeader className="px-4 pt-1 -mt-4 space-y-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href={`/${post.user._id}`}>
              <Avatar className="h-12 w-12 lg:w-14 shadow-lg lg:h-14 border border-gray-200 dark:border-gray-700">
                <AvatarImage
                  src={post?.user.image || ""}
                  alt={post?.user.fullName}
                />
                <AvatarFallback fallbackKey={post.user.email}>
                  {post.user.email.substring(0, 2).toUpperCase()}
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
                onClick={async () => (user ? handleFollow() : setIsModalOpen(true))}
                variant={isFollowing ? "outline" : "default"}
                size="sm"
                className="rounded-full shadow cursor-pointer text-xs px-3 h-8"
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
                <button className="h-10 cursor-pointer hover:bg-black/10 w-10 flex overflow-hidden justify-center items-center rounded-full bg-black/5 p-2">
                  <MoreVertical size={45} className="font-bold" />
                </button>
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
                {isOwnPost && (
                  <DropdownMenuItem
                    onClick={() => deletePost(post._id)}
                    className="cursor-pointer"
                  >
                    <Delete className="h-4 w-4 mr-2 text-red-500" />
                    Delete Post
                  </DropdownMenuItem>
                )}
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

      <CardContent className="px-4 lg:px-5 pt-0 md:pb-2 -mt-6">
        {post.caption && (
          <p className="text-sm ml-2 mb-3 whitespace-pre-line">
            {post.caption}
          </p>
        )}
        <div className="overflow-hidden rounded-md bg-gradient-to-br from-zinc-400 via-gray-200 to-zinc-400  shadow-lg">
          {post.mediaType === "image" ? (
            <Image
              src={post.mediaUrl}
              alt={post.caption}
              width={500}
              height={400}
              unoptimized
              onLoad={isLargeScreen ? (handleMediaLoad as any) : undefined}
              className={
                isLargeScreen
                  ? `${
                      mediaOrientation === "portrait" && mediaLoaded
                        ? "w-auto m-auto max-w-full h-auto md:max-h-[calc(100vh-220px)] lg:max-h-[calc(100vh-80px)] object-contain"
                        : "w-full min-h-[400px] md:min-h-[400px] max-h-[700px] object-cover"
                    }`
                  : "w-full min-h-[500px] md:min-h-[400px] max-h-[900px] object-cover"
              }
            />
          ) : (
            <CustomVideoPlayer
              src={post.mediaUrl}
              width="100%"
              height="100%"
              onLoadedMetadata={
                isLargeScreen ? (handleMediaLoad as any) : undefined
              }
              className={
                isLargeScreen
                  ? `${
                      mediaOrientation === "portrait" && mediaLoaded
                        ? "object-contain min-h-[400px] md:max-h-[calc(100vh-220px)] lg:max-h-[calc(100vh-180px)] flex justify-center items-center"
                        : "object-contain min-h-[400px] md:min-h-[450px] max-h-[700px] flex justify-between items-center"
                    }`
                  : "object-contain min-h-[400px] flex justify-between items-center md:min-h-[450px] max-h-[900px]"
              }
              autoPlay={false}
              loop={true}
              muted={false}
            />
          )}
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 flex justify-between border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-6 -mt-6">
          <div className="sr-only">
            <LoginRequiredModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>

          {/* Like Button */}
          <Button
            onClick={() => (user ? handleLike() : setIsModalOpen(true))}
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
            <span className="text-lg font-semibold">{comments?.length}</span>
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
              {comments?.length > 0 ? (
                comments?.map((comment, index) => (
                  <div key={index} className="flex gap-2 ">
                    <Avatar className="h-11 w-11 border border-white shadow dark:border-zinc-800">
                      <AvatarImage
                        src={comment?.user?.image || ""}
                        alt={comment?.user?.name}
                      />
                      <AvatarFallback className="text-black text-sm bg-gradient-to-t from-blue-400/80  to-violet-500/80 ">
                        {comment?.user?.email?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-white dark:bg-zinc-800 rounded-lg px-3 py-2">
                        <p className="text-sm font-medium">
                          {comment.user.name
                            ? comment.user.name
                            : getFirstNameFromEmail(comment.user.email)}
                        </p>
                        <p className="text-sm ml-2 mt-1">{comment.text}</p>
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

            <form
              onSubmit={(e) => {
                e.preventDefault(); 
                if (user) {
                  handleComment(e);
                } else {
                  setIsModalOpen(true);
                }
              }}
              className="mt-3 flex gap-2"
            >
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
