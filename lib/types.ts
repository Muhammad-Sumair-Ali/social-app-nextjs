

  export interface PostCardProps {
   post: {
    _id: string;
    user: {
      _id: string;
      name?: string;
      fullName?: string;
      image?: string;
      email: string;
      following?: Object[];
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
    following?:Object[];

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