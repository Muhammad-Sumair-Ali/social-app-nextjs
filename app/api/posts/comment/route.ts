import { authOptions } from "@/lib/authOptions";
import { createNotification } from "@/lib/createNotification";
import { connectDatabase } from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/Users";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDatabase();
    const userId = session.user.id;
    const { postId, text, postownerId } = await req.json();

    const postOwnerUser = await User.findById(postownerId).select("-password");
    const currentUser = await User.findById(userId).select("-password");

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: "post not found" }, { status: 404 });
    }

    const comment = {
      user: { ...session.user },
      text,
      createdAt: new Date(),
    };

    //  Create a notification
    await createNotification({
      recipient: postOwnerUser,
      sender: currentUser,
      type: "comment",
      isRead: false,
      createdAt: new Date(),
    });
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { message: "error adding comment", error },
      { status: 500 }
    );
  }
}
