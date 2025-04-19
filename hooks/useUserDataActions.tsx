"use client";

import { IUser } from "@/lib/types";
import axios from "axios";
import { useState } from "react";

export const useUserDataActions = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const fetchUserPosts = async (user: IUser) => {
    setIsLoading(true)
    try {
      const response = await axios.post("/api/posts/userposts", {
        userId: user._id,
      });
      setIsLoading(false)
      setUserPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }finally{
        setIsLoading(false)
    }
  };



  return {
    userPosts,
    isLoading,
    fetchUserPosts
  }

};
