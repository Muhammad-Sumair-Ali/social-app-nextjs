import Post from "@/models/Post";
import mongoose from "mongoose";

export async function getTotalLikesOfUser(userId: string) {
  const result = await Post.aggregate([
    {
      $match: {
        "user._id": new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $project: {
        likesCount: { $size: "$likes" },
      },
    },
    {
      $group: {
        _id: null,
        totalLikes: { $sum: "$likesCount" },
      },
    },
  ]);

  return result[0]?.totalLikes || 0;
}
