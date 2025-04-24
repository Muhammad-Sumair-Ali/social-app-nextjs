import Post from "@/models/Post";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const videoPosts = await Post.find({ mediaType: "video" });

    return NextResponse.json({ data: videoPosts }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong getting video posts", error },
      { status: 500 }
    );
  }
}
