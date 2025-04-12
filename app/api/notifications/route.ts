import { authOptions } from "@/lib/authOptions";
import { connectDatabase } from "@/lib/db";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";


// Get all notifications for the current user
export async function GET() {
  await connectDatabase();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }


  const notifications = await Notification.find({
    "recipient._id": new mongoose.Types.ObjectId(userId),
  });

  return NextResponse.json({ notifications });
}

// Mark all notifications as read
export async function PUT() {
  try {
    await connectDatabase();
    
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    const result = await Notification.updateMany(
      { "recipient._id": new mongoose.Types.ObjectId(userId), isRead: false },
      { $set: { isRead: true } }
    );
    
    
    return NextResponse.json({
      message: "All notifications marked as read",
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Delete a notification
export async function DELETE(req: NextRequest) {
  try {
    await connectDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const notificationId = searchParams.get("id")?.trim();

    if (!notificationId) {
      return NextResponse.json(
        { message: "Notification ID is required" },
        { status: 400 }
      );
    }

    const deletedNotification = await Notification.findByIdAndDelete(notificationId);

    if (!deletedNotification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Notification deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}