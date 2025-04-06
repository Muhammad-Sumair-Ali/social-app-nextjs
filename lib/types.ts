import mongoose, { Schema } from "mongoose";


  export interface PostCardProps {
   post: {
    _id: string;
    user: {
      _id: string;
      name?: string;
      fullName?: string;
      image?: string;
      email: string;
      following?: object[];
    };
    caption: string;
    mediaUrl: string;
    mediaType: "image" | "video";
    likes: Array<{ 
      _id: string; 
      fullName: string;
      image?: string | null;
    }>;
    comments: Array<{
      _id: string;
      user: {
        id: string;
        name?: string;
        email: string;
        image?: string;
      };
      text: string;
      createdAt: string;
    }>;
    createdAt: string;
  updatedAt: string;

  };
}

export interface PostCardData {
  _id: string;
  user: {
    _id: string;
    name?: string;
    fullName?: string;
    email: string;
    image?: string;
    following?:object[];

  };
  caption: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  likes: Array<{ 
    _id: string; 
    fullName: string;
    image?: string | null;
  }>;
  comments: Array<{
    _id: string;
    user: {
      id: string;
      name?: string;
      email: string;
      image?: string;
    };
    text: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}



export interface IPost {
  user: object;
  caption: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  likes: mongoose.Types.ObjectId[];
  comments: IComment[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IComment {
  user: object; 
  text: string;
  createdAt: Date;
}



export interface IUser {
    email: string;
    fullName?: string;
    password?: string; 
    following?: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: object[]
      }
    providers: {
        provider: string;
        providerId: string;
    }[];
    image?: string;  
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}