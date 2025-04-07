import React, { useEffect } from "react";
import PostCard from "./PostCard";
import PostCardSkeleton from "../panel/PostCardSkeleton";
import { useFetchPosts } from "@/hooks/usePostsActions";

const ListingPostsCards: React.FC = () => {
  const {
    posts,
    loading,
    hasMore,
    error,
    page,
    handleInfiniteScroll,
    handleFetchPosts,
  } = useFetchPosts();

  useEffect(() => {
    if (hasMore) {
      handleFetchPosts();
    }
  }, [page, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
    return () => {
      window.removeEventListener("scroll", handleInfiniteScroll);
    };
  }, [handleInfiniteScroll]);

  if (error) {
   console.error("Error fetching posts:", error);
  }

  if (posts?.length === 0 && !loading) {
    return (
      <div className="text-center py-8 max-w-md mx-auto">
        <h3 className="text-xl font-medium mb-2">No posts yet</h3>
        <p className="text-gray-600">
          Follow more users or create a post to see content here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-14 ring-amber-400 m-auto -mt-4">
      {posts.map((post, idx) => (
        <PostCard key={idx} post={post} />
      ))}

      {loading && <PostCardSkeleton />}
    </div>
  );
};

export default ListingPostsCards;
