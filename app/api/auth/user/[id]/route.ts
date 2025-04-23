
import { connectDatabase } from "@/lib/db";
import { getTotalLikesOfUser } from "@/lib/getUserLikes";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    try {
        const url = new URL(request.url);
        const userId = url.pathname.split('/').pop(); 
       

        await connectDatabase();
        if (!userId) {
            return NextResponse.json(
                { message: "Invalid request Id missing" },
                { status: 400 }
            );
        }
            const totalLikes = await getTotalLikesOfUser(userId);
            const user = await User.findByIdAndUpdate(userId, { likes: totalLikes }).select("-password")
     
        if (!user) {
            console.error("User not found for ID:", userId);
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Internal server error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
