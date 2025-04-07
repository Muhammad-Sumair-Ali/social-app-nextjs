import React, { useEffect, useState } from 'react';
import axios from "axios";
import { PostCardData } from '@/lib/types';
import PostCard from './PostCard';
import PostCardSkeleton from '../panel/PostCardSkeleton';

const ListingPostsCards: React.FC = () => {
  const [posts, setPosts] = useState<PostCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); 

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/api/posts?page=${page}&limit=2`);
        const newPosts = response.data.posts;

        if (newPosts.length === 0) {
          setHasMore(false); 
          return;
        }

        setPosts((prev) => [...prev, ...newPosts]);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (hasMore) {
      fetchPosts();
    }
  }, [page, hasMore]);

  const handleInfiniteScroll = React.useCallback(() => {
      try {
        if (
          window.innerHeight + document.documentElement.scrollTop + 100 >=
          document.documentElement.scrollHeight &&
          hasMore &&
          !loading
        ) {
          setLoading(true);
          setPage((prev) => prev + 1);
        }
      } catch (error) {
        console.error('Error in infinite scroll:', error);
      }
    }, [hasMore, loading]);
  
    useEffect(() => {
      window.addEventListener('scroll', handleInfiniteScroll);
      return () => {
        window.removeEventListener('scroll', handleInfiniteScroll);
      };
    }, [handleInfiniteScroll]); 

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
        {error}
      </div>
    );
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
      {posts.map((post,idx) => (
        <PostCard key={idx} post={post} />
      ))}

      {loading && <PostCardSkeleton />}
    </div>
  );
};

export default ListingPostsCards;
