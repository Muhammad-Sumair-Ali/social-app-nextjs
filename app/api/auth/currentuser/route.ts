import { authOptions } from "@/lib/authOptions";
import { connectDatabase } from "@/lib/db";
import { getTotalLikesOfUser } from "@/lib/getUserLikes";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    await connectDatabase();

    const totalLikes = await getTotalLikesOfUser(userId);
    const user = await User.findByIdAndUpdate(userId, { likes: totalLikes }).select("-password")

    if (!user) {
      return NextResponse.json(
        { message: "user was not found" },
        { status: 400 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
