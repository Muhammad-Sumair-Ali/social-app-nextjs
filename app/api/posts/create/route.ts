// api/posts/create.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { connectDatabase } from "@/lib/db";
import Post from "@/models/Post";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/Users";


export async function POST(req: NextRequest) {
  try {
    // Get the user from the session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDatabase();
    let userId = session.user.id;

    const user = await User.findById(userId).select("-password")

    const { caption, mediaBase64 } = await req.json();

    // Upload media to Cloudinary
    const uploadResult = await uploadToCloudinary(mediaBase64, "posts");

    // Create post in database
    const post = await Post.create({
      caption,
      user:user ,
      mediaUrl: uploadResult.url,
      mediaType: uploadResult.resourceType === "video" ? "video" : "image",
      likes: [],
      comments: [],
    });

    if(!post.user){
      return NextResponse.json({ message: "Something Went wrong User" }, { status: 400 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { message: "Error creating post" },
      { status: 500 }
    );
  }
}
