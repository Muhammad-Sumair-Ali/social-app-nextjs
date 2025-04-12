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

  
  console.log("posts => ",posts)
  return (
    <div className="space-y-14 ring-amber-400 m-auto -mt-4 mb-10">


      {posts.map((post, idx) => (
        <PostCard key={idx} post={post} />
      ))}

      {loading && <PostCardSkeleton />}
    </div>
  );
};

export default ListingPostsCards;
