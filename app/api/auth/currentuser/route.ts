import { authOptions } from "@/lib/authOptions";
import { connectDatabase } from "@/lib/db";
import User from "@/models/Users";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let userId = session.user.id;

    await connectDatabase();
    const user = await User.findById(userId).select("-password")

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
