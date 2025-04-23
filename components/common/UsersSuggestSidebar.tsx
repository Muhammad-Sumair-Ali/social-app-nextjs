"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/app/context/useAuth";
import { useUsersActions } from "@/hooks/useUsersAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, RefreshCw, Users } from "lucide-react";
import { useSuggestedUsers } from "@/app/context/suggestingUsersContext";
import type { IUser } from "@/lib/types";
import { motion } from "framer-motion";
import { useEffect } from "react";

const UsersSuggestSidebar = () => {
  const { user } = useAuth();
  const { users, loading,fetchSuggestedUsers } = useSuggestedUsers();
  const { handleFollow } = useUsersActions();

  useEffect(() => {
    if (user) {
      fetchSuggestedUsers();
    }
  }, [user]);

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
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Users className="h-5 w-5" />
            Discover People
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <Users className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-base font-medium">Sign in to connect</h3>
            <p className="text-sm text-muted-foreground">
              Login to discover and follow interesting people
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-[16px] font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Discover People
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchSuggestedUsers}
            className="h-8 w-8"
            title="Refresh suggestions"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="-mt-7">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-20 ml-auto rounded-full" />
              </div>
            ))}
          </div>
        ) : filterUsers?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-3 text-center space-y-2">
           
            <p className="text-sm text-muted-foreground">
              You&#39;re following all suggested users
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSuggestedUsers}
              className="mt-2"
            >
              <RefreshCw className="h-3 w-3 mr-2" />
              Refresh
            </Button>
          </div>
        ) : (
          <div className="space-y-2 mt-2">
            {filterUsers?.map((account: IUser, index: number) => (
              <motion.div
                key={account._id?.toString()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/40 transition-all"
              >
                <Link href={`/${account._id}`} className="shrink-0">
                  <Avatar className="h-12 w-12 border border-border shadow-sm transition-transform hover:scale-105">
                    <AvatarImage src={account.image} alt={account.fullName} />
                    <AvatarFallback fallbackKey={account.email}>
                      {account.email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>

                <div className="flex flex-col min-w-0">
                  <Link
                    href={`/${account._id}`}
                    className="hover:underline"
                  >
                    <span className="text-sm font-medium truncate block">
                      {account.fullName}
                    </span>
                  </Link>
                  <span className="text-xs text-muted-foreground truncate">
                    @{account.email?.split("@")[0] || account.email}
                  </span>
                </div>
                <Button
                  onClick={async () => {
                    await handleFollow(account);
                  }}
                  variant="outline"
                  size="sm"
                  className="ml-auto shrink-0 rounded-full h-8 px-3 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                  Follow
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersSuggestSidebar;
