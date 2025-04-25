"use client";

import React from "react";
import PostCard from "@/components/post/PostCard";
import PostCardSkeleton from "@/components/panel/PostCardSkeleton";
import { useFetchPosts } from "@/hooks/usePostsActions";

export default function ReelsPage() {
  const { reels, loading, error, refetchReels } = useFetchPosts();

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={() => refetchReels()}
            className="mt-4 px-4 py-2 bg-rose-600 rounded-full hover:bg-rose-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-2 sm:px-8">
      <div className="w-full sm:max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold px-4 mb-6">Latest Reels 🔥</h1>
        
        <div className="space-y-6 mb-14">
          {loading ? (
            <>
              <PostCardSkeleton />
              <PostCardSkeleton />
            </>
          ) : (
            reels?.map((post, index) => (
              <React.Fragment key={post._id?.toString() || index}>
                <PostCard key={index} post={post} />
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </div>
  );
}