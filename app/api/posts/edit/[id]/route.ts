import Post from "@/models/Post";
import { NextRequest, NextResponse } from "next/server";

// // Delete post
// export async function DELETE({ params }: { params: { id: string } }) {
//   try {
//     const userId = params.id;

//     if (!userId) {
//       return NextResponse.json(
//         { error: "userId is required" },
//         { status: 400 }
//       );
//     }

//     await Post.findByIdAndDelete(userId);

//     const post = await Post.findById(userId);

//     if (!post) {
//       return NextResponse.json({ error: "Post was Deleted" }, { status: 201 });
//     }
//   } catch {
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }



export async function POST(req:NextRequest) {
  try {
    const userId =await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    await Post.findByIdAndDelete(userId);

    const post = await Post.findById(userId);

    if (!post) {
      return NextResponse.json({ error: "Post was Deleted" }, { status: 201 });
    }
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}




// newwwwwww






// export async function PATCH(req: NextRequest) {
//     try {
//       const { postId, newMediaFile } = await req.json();
  
//       // Find the existing post
//       const post = await Post.findById(postId);
//       if (!post) {
//         return NextResponse.json({ message: "Post not found" }, { status: 404 });
//       }
  
//       // Delete the existing media from Cloudinary
//       const deleteSuccess = await deleteFromCloudinary(post.publicId);
//       if (!deleteSuccess) {
//         return NextResponse.json({ message: "Error deleting existing media" }, { status: 500 });
//       }
  
//       // Now upload the new media
//       const uploadResponse = await uploadToCloudinary(newMediaFile, "posts");
//       const updatedPost = await Post.findByIdAndUpdate(postId, {
//         mediaUrl: uploadResponse.url,
//         publicId: uploadResponse.publicId,
//       });
  
//       return NextResponse.json({ updatedPost }, { status: 200 });
//     } catch (error) {
//       console.error("Error updating post:", error);
//       return NextResponse.json({ message: "Error updating post", error }, { status: 500 });
//     }
//   }
  