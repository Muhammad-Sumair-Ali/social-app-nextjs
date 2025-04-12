import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import Post from "@/models/Post";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest) {
    try {
      const { postId, newMediaFile } = await req.json();

      // Find the existing post
      const post = await Post.findById(postId);
      if (!post) {
        return NextResponse.json({ message: "Post not found" }, { status: 404 });
      }

      // Delete the existing media from Cloudinary
      const deleteSuccess = await deleteFromCloudinary(post.publicId);
      if (!deleteSuccess) {
        return NextResponse.json({ message: "Error deleting existing media" }, { status: 500 });
      }

      // Now upload the new media
      const uploadResponse = await uploadToCloudinary(newMediaFile, "posts");
      const updatedPost = await Post.findByIdAndUpdate(postId, {
        mediaUrl: uploadResponse.url,
        publicId: uploadResponse.publicId,
      });

      return NextResponse.json({ updatedPost }, { status: 200 });
    } catch (error) {
      console.error("Error updating post:", error);
      return NextResponse.json({ message: "Error updating post", error }, { status: 500 });
    }
  }
