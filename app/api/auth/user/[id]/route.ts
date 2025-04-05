
import { connectDatabase } from "@/lib/db";
import User from "@/models/Users";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split('/').pop(); 
       

        await connectDatabase();
        if (!id) {
            return NextResponse.json(
                { message: "Invalid request Id missing" },
                { status: 400 }
            );
        }

        const user = await User.findById(id).select("-password");
        if (!user) {
            console.error("User not found for ID:", id);
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
