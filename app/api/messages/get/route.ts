import { connectDatabase } from "@/lib/db";
import Message from "@/models/Message";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    await connectDatabase();
    const { searchParams } = new URL(req.url);
    const sender = searchParams.get("sender");
    const receiver = searchParams.get("receiver");
  
    if (!sender || !receiver) {
      return NextResponse.json({ error: "Missing sender or receiver" }, { status: 400 });
    }
  
    const messages = await Message.find({
        $or: [
          { "sender._id": sender, "receiver._id": receiver },
          { "sender._id": receiver, "receiver._id": sender },
        ],
      }).sort({ timestamp: 1 });
      
  
    return NextResponse.json(messages);
  }