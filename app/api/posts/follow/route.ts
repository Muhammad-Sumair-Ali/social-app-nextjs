import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { connectDatabase } from '@/lib/db';
import User from '@/models/Users';
import { createNotification } from '@/lib/createNotification';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDatabase();

    const { userId } = await req.json();
    const currentUserId = session.user.id;

    const userToFollow = await User.findById(userId).select("-password");
    const currentUser = await User.findById(currentUserId).select("-password");

    if (!userToFollow || !currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const alreadyFollowing = currentUser.following.includes(userId);

    if (alreadyFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: userId }
      });
      return NextResponse.json({ following: false }, { status: 200 });

    } else {
      // Follow
      await User.findByIdAndUpdate(currentUserId, {
        $push: { following: userId }
      });

      // Create a notification
      await createNotification({
        recipient: userToFollow,
        sender: currentUser,
        type: "follow",
        isRead: false,
        createdAt: new Date(),
      });

      return NextResponse.json({ following: true }, { status: 200 });
    }

  } catch (error) {
    console.error('Error following/unfollowing user:', error);
    return NextResponse.json({ message: 'Error following/unfollowing user', error }, { status: 500 });
  }
}
