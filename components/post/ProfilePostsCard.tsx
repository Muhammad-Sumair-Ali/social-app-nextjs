"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { PostCardProps } from "@/lib/types";
import CustomVideoPlayer from "../CustomVideoPlayer";
import Image from "next/image";

export function ProfilePostCard({ post }: PostCardProps) {
  const [open, setOpen] = useState(false);

  const handlePostClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div
        className="aspect-auto overflow-hidden relative  cursor-pointer"
        onClick={handlePostClick}
      >
        {post.mediaType === "image" ? (
          <Image
            width={200}
            height={200}
            priority
            src={post.mediaUrl}
            alt={post.caption}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center relative">
            <CustomVideoPlayer
              src={post.mediaUrl}
              width="100%"
              height="100%"
              className="object-contain"
              autoPlay={false}
              loop={true}
              muted={false}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogOverlay className="bg-black/80" />
        <DialogContent className="max-w-7xl p-0 border-none bg-transparent shadow-none">
          <DialogTitle className="sr-only">post detals</DialogTitle>
          <div className="flex flex-col md:flex-row bg-background rounded-lg overflow-hidden">
            <div
              className={cn(
                "relative w-full md:w-2/3 aspect-square md:aspect-auto",
                post.mediaType === "video" ? "bg-black" : ""
              )}
            >
              {post.mediaType === "image" ? (
                <Image
                  priority
                  src={post.mediaUrl || "https://placehold.co/600x400"}
                  alt={post.caption}
                  className="w-full h-full object-contain"
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
            <div className="w-full md:w-1/3 p-4 overflow-y-auto max-h-[300px] md:max-h-[500px]">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src={post?.user?.image || "https://placehold.co/600x400"} 
                    alt={post.user.fullName || post.user.email}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">
                    {post.user.fullName || post.user.name}
                  </p>
                </div>
              </div>
              <p className="text-sm mb-4">{post.caption}</p>
              <div className="text-xs text-muted-foreground mb-2">
                {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
