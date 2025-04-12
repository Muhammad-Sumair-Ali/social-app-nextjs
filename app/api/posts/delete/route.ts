import { deleteFromCloudinary } from "@/lib/cloudinary";
import { extractPublicId } from "@/lib/helpers";
import Post from "@/models/Post";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req:NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const postId = searchParams.get("id");


    if (!postId) {
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 }
      );
    }

    const existpost = await Post.findById(postId);
    if (!existpost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const publicId = extractPublicId(existpost.mediaUrl)

    const deleteSuccess = await deleteFromCloudinary(publicId,existpost.mediaType);
    if (!deleteSuccess) {
      return NextResponse.json({ message: "Error deleting existing media" }, { status: 500 });
    }


    await Post.findByIdAndDelete(postId);



    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json({ error: "Post was Deleted" }, { status: 200 });
    }
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}