
import Post from '../../../models/Post';
import { connectDatabase } from '@/lib/db';
import { NextResponse } from 'next/server';


// Get all Posts 
export async function GET() {
  try {
    await connectDatabase();

    // Get all posts sorted by creation date
    const posts = await Post.find()
      .sort({ createdAt: -1 })

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