import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { connectDatabase } from "@/lib/db";
import Post from "@/models/Post";
import { NextRequest, NextResponse } from "next/server";
import { createNotification } from "@/lib/createNotification";
import User from "@/models/User";
import { getTotalLikesOfUser } from "@/lib/getUserLikes";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDatabase();

    const { postId, postownerId } = await req.json();
    const userId = session.user.id;

    const [postOwnerUser, currentUser, post] = await Promise.all([
      User.findById(postownerId).select("-password"),
      User.findById(userId).select("-password"),
      Post.findById(postId),
    ]);
    
    if (!post) {
      return NextResponse.json({ message: "post not found" }, { status: 404 });
    }
    
    const alreadyLiked = post.likes.some(
      (id: string) => id.toString() === userId
    );
    
    if (alreadyLiked) {
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: userId },
      });
      return NextResponse.json({ liked: false }, { status: 200 });
    } else {
      await Promise.all([
        Post.findByIdAndUpdate(postId, {
          $push: { likes: userId },
        }),
        createNotification({
          recipient: postOwnerUser,
          sender: currentUser,
          type: "like",
          post: {
            mediaUrl: post.mediaUrl,
            mediaType: post.mediaType,
          },
          isRead: false,
          createdAt: new Date(),
        }),
      ]);
    
      const totalLikes = await getTotalLikesOfUser(postOwnerUser._id);
      await User.findByIdAndUpdate(postOwnerUser._id, { likes: totalLikes });
    
      return NextResponse.json({ liked: true }, { status: 200 });
    }
    
    
  } catch (error) {
    console.error("Error liking/unliking post:", error);
    return NextResponse.json(
      { message: "Error liking/unliking post", error },
      { status: 500 }
    );
  }
}
