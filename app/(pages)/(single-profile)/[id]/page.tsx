"use client";
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfilePostCard } from "@/components/post/ProfilePostsCard";
import {
  ProfilePostsSkeleton,
  ProfileSkeleton,
} from "@/components/panel/UserProfileSkeleton";
import { useUsersActions } from "@/hooks/useUsersAction";
import { useUserPosts } from "@/hooks/usePostsActions";

export default function Profile() {
  const { id } = useParams();
  const { useUser } = useUsersActions();
  const { data: user } = useUser(id?.toString());
  const router = useRouter();

  const { userPosts, isLoading } = useUserPosts(user);

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
                  <div className="font-bold">
                    {Array.isArray(user?.followers) ? user.followers.length : 0}
                  </div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>

                <div className="text-center cursor-pointer">
                  <div className="font-bold">{Number(user?.likes) || 0}</div>
                  <div className="text-sm text-gray-500">Likes </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="py-4">
        {isLoading && <ProfilePostsSkeleton />}
        {userPosts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {userPosts?.map((post, index) => (
              <ProfilePostCard key={index} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600 mb-4">
              user haven&#39;t created any posts yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
