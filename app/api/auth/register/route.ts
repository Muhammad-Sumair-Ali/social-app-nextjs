import { connectDatabase } from "@/lib/db";
import User from "@/models/Users";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName} = await request.json();

    if (!email || !password || !fullName)  {
      return NextResponse.json(
        { error: "All fields are Required" },
        { status: 400 }
      );
    }
    await connectDatabase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registred " },
        { status: 400 }
      );
    }

    await User.create({
      email,
      password,
      fullName
    });

    return NextResponse.json(
      { message: "User Registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json(
      { error: "Internal server error, Failed to register User" },
      { status: 500 }
    );
  }
}
