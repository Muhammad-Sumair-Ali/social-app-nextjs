// api/posts/comment.ts
import { authOptions } from '@/lib/authOptions';
import { connectDatabase } from '@/lib/db';
import Post from '@/models/Post';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';


export  async function POST(req: NextRequest) {

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        {message:"Unauthorized"},
        {status:401});
    }

    await connectDatabase();

    const { postId, text } = await req.json();
  

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        {message:"post not found"},
        {status:404});
    }

    const comment = {
      user: {...session.user},
      text,
      createdAt: new Date()
    };

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment }
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      {message:"error adding comment",error},
      {status:500}
    );

  }
}
