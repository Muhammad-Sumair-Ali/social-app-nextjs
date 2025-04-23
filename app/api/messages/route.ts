import { connectDatabase } from "@/lib/db";
import Message from "@/models/Message";
import { NextRequest, NextResponse } from "next/server";

// POST /api/messages - Send a message
export async function POST(req: NextRequest) {
  await connectDatabase();
  const body = await req.json();
  const { sender, receiver, text } = body;

  if (!sender._id || !receiver._id || !text) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const newMessage = await Message.create({
    sender: {
      _id: sender._id,
      fullName: sender.fullName,
      email: sender.email,
      image: sender.image,
    },
    receiver: {
      _id: receiver._id,
      fullName: receiver.fullName,
      email: receiver.email,
      image: receiver.image,
    },
    text,
  });
  return NextResponse.json(newMessage);
}


