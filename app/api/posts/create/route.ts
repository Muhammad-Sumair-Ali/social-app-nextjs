
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { connectDatabase } from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/Users";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectDatabase();
    const userId = session.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Process form data
    const formData = await req.formData();
    const caption = formData.get('caption') as string;
    const mediaFile = formData.get('media') as File;
    const mediaType = formData.get('mediaType') as string;

    if (!caption || !mediaFile) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Convert the file to buffer/array buffer for Cloudinary upload
    const buffer = await mediaFile.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataURI = `data:${mediaFile.type};base64,${base64}`;

    // Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadOptions = {
        resource_type: mediaType === 'video' ? 'video' : 'image' as 'image' | 'video',
        folder: 'posts',
      };

      cloudinary.uploader.upload(dataURI, uploadOptions, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    // Create post in database
    const post = await Post.create({
      caption,
      user: user,
      mediaUrl: uploadResult.secure_url,
      mediaType: mediaType === 'video' ? 'video' : 'image',
      publicId: uploadResult.public_id,
      likes: [],
      comments: [],
    });

    if (!post.user) {
      return NextResponse.json({ message: "Something went wrong with user association" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Post created successfully",
      post
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { message: "Error creating post" },
      { status: 500 }
    );
  }
}
