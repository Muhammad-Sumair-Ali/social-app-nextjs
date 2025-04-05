
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { connectDatabase } from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/Users';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId: currentUserId } = await request.json();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDatabase();

    // Get current user
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const posts = await Post.find({
      $or: [
        { "user._id": { $in: currentUser.following } },
        { "user._id": new mongoose.Types.ObjectId(currentUserId) }
      ]
    })
      .sort({ createdAt: -1 });

    const populatedPosts = await Post.populate(posts, {
      path: 'likes',
      select: 'fullName image'
    });

    return NextResponse.json({ posts: populatedPosts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ 
      message: "Error fetching posts", 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
