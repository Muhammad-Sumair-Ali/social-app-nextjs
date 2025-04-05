import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import axios from "axios";
import { PostCardData } from '@/lib/types';
import TikTokPostCard from './PostCard';


const ListingPostsCards: React.FC = () => {
  const [posts, setPosts] = useState<PostCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts');
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
        {error}
      </div>
    );
  }

  if (posts?.length === 0) {
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
    <div className="space-y-14  ring-amber-400 m-auto -mt-4">
      {posts && posts.map((post) => (
        <TikTokPostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default ListingPostsCards;