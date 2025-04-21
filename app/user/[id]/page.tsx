"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfilePostCard } from "@/components/post/ProfilePostsCard";
import { ProfileSkeleton } from "@/components/panel/UserProfileSkeleton";
import { IUser } from "@/lib/types";
import { useUserDataActions } from "@/hooks/useUserDataActions";

export default function Profile() {

  const { id } = useParams();
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    if(!id) return;
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/auth/user/${id}`);
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [id]);

  const { fetchUserPosts, userPosts } = useUserDataActions();

  useEffect(() => {
    if (user) {
      fetchUserPosts(user);
    }
  }, [user?._id]);
  


  if (!user) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 min-h-screen pb-20">
      <div className="bg-white shadow-sm rounded-t-2xl">
        <div className="max-w-4xl mx-auto px-4 py-6 ">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row pl-5 rounded-xl items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="h-28 w-28 md:w-32 md:h-32 mt-2 rounded-full  bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              <Avatar className="h-28 w-28 md:w-32 md:h-32 rounded-full shadow   border-white dark:border-zinc-800 ">
                <AvatarImage
                  src={user?.image || ""}
                  alt="user profile"
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-medium">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center mt-1 md:text-left">
              <div className="flex flex-col  gap-3 mb-3">
                <h1 className="text-xl font-bold">{user?.fullName}</h1>
                <p className="text-gray-500 -mt-3 ml-4 text-sm">
                  @{user?.email?.split("@")[0]}
                </p>
              </div>

              {/* Stats */}
              <div className="flex justify-center text-2xl md:justify-start gap-6 ml-6 mb-4">
                <div className="text-center cursor-pointer">
                  <div className="font-bold">{userPosts.length}</div>
                  <div className="text-sm text-gray-500">Posts</div>
                </div>
                <div className="text-center cursor-pointer">
                  <div className="font-bold">
                    {Array.isArray(user?.following) ? user.following.length : 0}
                  </div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>

                <div className="text-center cursor-pointer">
                  <div className="font-bold">{Number(user?.likes) || 0}</div>
                  <div className="text-sm text-gray-500">Likes </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm mb-4">{"Professional Developer 👨‍💻"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <div className="border-b bg-white px-3 pb-2 rounded-b-2xl">
          <TabsList className="max-w-4xl mx-auto h-12 bg-transparent">
            <TabsTrigger
              value="posts"
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:rounded-none data-[state=active]:shadow-none"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="liked"
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:rounded-none data-[state=active]:shadow-none"
            >
              Liked
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="posts" className="w-full md:w-4xl mx-auto  md:px-4 mt-2 border py-6 ">
          {userPosts?.length > 0 ? (
            <div className="relative grid  grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-x-1 md:gap-4">
              {userPosts?.map((post, index) => (
                <ProfilePostCard key={index} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600 mb-4">
                User haven&apos;t created any posts yet.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="liked" className="max-w-4xl mx-auto px-4 mt-6">
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600">No liked posts yet</p>
          </div>
        </TabsContent>

        <TabsContent value="saved" className="max-w-4xl mx-auto px-4 mt-6">
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600">No saved posts yet</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
