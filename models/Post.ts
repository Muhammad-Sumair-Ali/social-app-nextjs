import mongoose, { model, models, Schema } from "mongoose";

export interface IPost {
  user: Object;
  caption: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  likes: mongoose.Types.ObjectId[];
  comments: IComment[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IComment {
  user: Object; 
  text: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>({
  user: {
    type: Object,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new Schema<IPost>(
  {
    user: {
      type: Object,
      required: true
    },
    caption: {
      type: String,
      required: true
    },
    mediaUrl: {
      type: String,
      required: true
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: "User"
    }],
    comments: [commentSchema]
  },
  { timestamps: true }
);

const Post = models?.Post || model<IPost>("Post", postSchema);
export default Post;
