import { authOptions } from "@/lib/authOptions";
import { connectDatabase } from "@/lib/db";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";


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
