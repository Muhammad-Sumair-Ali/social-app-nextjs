import Post from "../../../models/Post";
import { connectDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { extractPublicId } from "@/lib/helpers";


// Get all Posts
export async function GET() {
  await connectDatabase();
  try {


    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .lean(); 

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      {
        message: "Error fetching posts",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


// Delete post with image delete
export async function DELETE(req: NextRequest) {
  try {
    const { postId } = await req.json();
    
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
 
    const publicId = extractPublicId(post.mediaUrl)
    // console.log("extracted publicId =>",publicId)

    // Delete the media from Cloudinary
    const deleteSuccess = await deleteFromCloudinary(publicId);
    // console.log("delete success=>",deleteSuccess)
    if (!deleteSuccess) {
      return NextResponse.json({ message: "Error deleting media" }, { status: 500 });
    }
    
    // Now delete the post from your database
    await Post.findByIdAndDelete(postId);

    const isDeleted = await Post.findById(postId)

    if(!isDeleted){
      return NextResponse.json({ message: "Post and media deleted successfully" }, { status: 200 });
    }
    
    NextResponse.json({ message: "Something went wrong delete failed" }, { status: 500 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ message: "Error deleting post", error }, { status: 500 });
  }
}