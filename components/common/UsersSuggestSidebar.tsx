"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/app/context/useAuth";
import { useUsersActions } from "@/hooks/useUsersAction";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";
import { useSuggestedUsers } from "@/app/context/suggestingUsersContext";
import { IUser } from "@/lib/types";

const UsersSuggestSidebar = () => {
  const { user } = useAuth();
  const { users, fetchSuggestedUsers } = useSuggestedUsers();
  const { handleFollow } = useUsersActions();

  const filterUsers = users?.filter((account: IUser) => {
    const isFollowing =
      Array.isArray(user?.following) &&
      user.following.some(
        (followingId: string) => followingId === account._id?.toString()
      );
    return !isFollowing && account._id !== user?._id;
  });

  if (!user) {
    return (
      <div className="p-6">
        <h2>Login to view user.......... </h2>
      </div>
    );
  }
  return (
    <div>
      <div className="px-4 py-2 mb-2">
        <h3 className="text-[14px] mt-2 font-medium text-muted-foreground mb-4">
          Suggested accounts
        </h3>
        <div className="space-y-3">
          {filterUsers?.map((account: IUser, index: number) => (
            <div
              key={index}
              className="flex items-center  gap-3 px-2 py-1.5 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <Link href={`/user/${account._id}`}>
                <Avatar className="w-12 h-12 border  shadow-lg">
                  <AvatarImage src={account.image} alt={account.fullName} />
                  <AvatarFallback className="text-black bg-gradient-to-t from-blue-400/80 font-semibold to-violet-500/80 ">
                    {account.email.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex flex-col justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    @{account.fullName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {account.email.split("_").join(" ")}
                  </span>
                </div>

                {filterUsers && (
                  <Button
                    onClick={async () => {
                      await handleFollow(account);
                      fetchSuggestedUsers();
                    }}
                    variant={"custombtn"}
                    size="sm"
                    className="w-24 cursor-pointer shadow rounded-full text-xs px-3 h-7"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Follow
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersSuggestSidebar;
