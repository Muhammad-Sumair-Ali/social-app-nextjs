"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import axios from "axios";
import { useEffect, useState } from "react";
import { IUser } from "@/models/Users";
import { useAuth } from "@/app/context/useAuth";
import { handleFollow } from "@/hooks/useUsersAction";
import { Button } from "../ui/button";
import { UserCheck, UserPlus } from "lucide-react";

const UsersSuggestSidebar = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<IUser[] | null>(null);
  const filterUsers = users?.filter((account) => account._id !== user?._id);


  // const Suggestings = users?.filter((account) => account);

const currentUserFollowings = user?.following || []; // Agar undefined ho to empty array le lo



  
  // console.log("is following ", notFollowedUsers);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/auth/users");
        console.log("Users get Suggestings", response);
        setUsers(response.data);
      } catch (error) {
        console.error("Error get users", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <div className="px-4 py-2 mb-2">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Suggested accounts
        </h3>
        <div className="space-y-3">
          {filterUsers?.map((account: IUser, index: any) => (
            <Link
              href={`/user/${account._id}`}
              key={index}
              className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <Avatar className="w-9 h-9 border border-border">
                <AvatarImage src={account.image} alt={account.fullName} />
                <AvatarFallback>
                  {account.email.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">@{account.fullName}</span>
                <span className="text-xs text-muted-foreground">
                  {account.email.split("_").join(" ")}
                </span>

                {/* {users && (
                  <Button
                    onClick={() => handleFollow(account._id)}
                    variant={isFollowing ? "outline" : "default"}
                    size="sm"
                    className="rounded-full text-xs px-3 h-8"
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="h-4 w-4 mr-1" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-1" />
                        Follow
                      </>
                    )}
                  </Button>
                )} */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersSuggestSidebar;
