
import Post from '../../../models/Post';
import { connectDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';


// Get all Posts 
export async function GET(request:NextRequest) {
  try {
    await connectDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1') || 1;
    const limit = parseInt(searchParams.get('limit') ?? '6') || 6;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const populatedPosts = await Post.populate(posts, {
      path: 'likes',
      select: 'fullName image'
    });

    return NextResponse.json(
      { posts: populatedPosts },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      {
        message: "Error fetching posts",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
