"use client"
import React from "react";
import PostCard from "./PostCard";
import PostCardSkeleton from "../panel/PostCardSkeleton";
import { useFetchPosts } from "@/hooks/usePostsActions";
import SuggestUsersMobile from "../common/SuggestUserMobile";

const ListingPostsCards: React.FC = () => {
  const { posts, loading } = useFetchPosts();


  return (
    <div className="space-y-12 ring-amber-400 m-auto -mt-4 mb-10">
      {posts?.map((post, index) => (
        <React.Fragment key={post._id}>
          <PostCard key={index} post={post} />
          {index === 4 && <SuggestUsersMobile />}
        </React.Fragment>
      ))}
      {loading && <PostCardSkeleton />}
    </div>
  );
};

export default ListingPostsCards;
