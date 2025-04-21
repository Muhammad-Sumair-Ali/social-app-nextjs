"use client"

import type React from "react"
import { useState} from "react"
import { Heart, MessageCircle} from "lucide-react"
import type { PostCardProps } from "@/lib/types"
import CustomVideoPlayer from "../CustomVideoPlayer"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"


export function ProfilePostCard({ post }: PostCardProps) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <>
      <div
        className="aspect-auto overflow-hidden h-[auto] w-[170px] md:w-[240px] relative cursor-pointer rounded-xl group bg-black/5 dark:bg-white/5 transition-all duration-300 shadow-xl"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {post.mediaType === "image" ? (
          <Image
            width={400}
            height={400}
            priority
            src={post.mediaUrl || ""}
            alt={post.caption}
            className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center relative">
            <CustomVideoPlayer
              src={post.mediaUrl}
              width="100%"
              height="100%"
              className="object-cover"
              autoPlay={isHovering} 
              muted
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
              </div>
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent  group-hover:opacity-0 opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-7 w-7 border-2 border-white">
              <AvatarImage src={post.user.image || ""} alt={post.user.fullName || post.user.email} />
              <AvatarFallback>{(post.user.fullName?.[0] || post.user.email?.[0] || "U").toUpperCase()}</AvatarFallback>
            </Avatar>
            <p className="font-medium text-sm text-white">{post.user.fullName || post.user.name}</p>
          </div>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Heart className={"w-5 h-5 fill-white"} />
                <span className="text-sm font-medium">{post.likes.length}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-5 h-5 fill-white/10" />
                <span className="text-sm font-medium">{post.comments?.length || 0}</span>
              </div>
            </div>
            <span className="text-xs opacity-80">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>

     
    </>
  )
}
