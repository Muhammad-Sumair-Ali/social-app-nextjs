// api/posts/like.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { connectDatabase } from '@/lib/db';
import Post from '@/models/Post';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/Users';

export  async function POST(req: NextRequest) {

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        {message:"Unauthorized"},
        {status:401});
    }

    await connectDatabase();

    const { postId } = await req.json();
    const userId = session.user.id;


    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        {message:"post not found"},
        {status:404});
    }

    // Check if the user already liked the post
    const alreadyLiked: boolean = post.likes.some((id: string) => id.toString() === userId);

    if (alreadyLiked) {
      // Unlike the post
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: userId }
      });
      return NextResponse.json(
        {liked:false},
        {status:200});
    } else {
      // Like the post
      await Post.findByIdAndUpdate(postId, {
        $push: { likes: userId }
      });
      return NextResponse.json(
        {liked:true},
        {status:200});
    }
  } catch (error) {
    console.error('Error liking/unliking post:', error);
    return NextResponse.json(
      {message:"Error liking/unliking post",error},
      {status:500});
  }
}