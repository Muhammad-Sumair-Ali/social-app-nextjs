"use client";

import { useSuggestedUsers } from "@/app/context/suggestingUsersContext";
import { useAuth } from "@/app/context/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Search, MessageSquare, UserPlus, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Button } from "../ui/button";

const ChatUsersListing = () => {
  const { user } = useAuth();
  const { users, fetchSuggestedUsers } = useSuggestedUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      fetchSuggestedUsers().finally(() => {
        setIsLoading(false);
      });
    }
  }, [user]);

  const handleStartChat = (userId: string) => {
    router.push(`/messages/${userId}`);
  };

  // Filter users to show only those the current user is following
  const followingUsers = Array.isArray(users)
    ? users.filter(
        (u) =>
          Array.isArray(user?.following) &&
          user.following.map((f) => f.toString()).includes(u._id)
      )
    : [];

  const filteredUsers = followingUsers.filter((u) =>
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex flex-col min-h-screen px-4 py-2">
      <Card className="flex-1 border-none shadow-none -mt-2">
        <CardHeader className="px-2 -my-4">
          <div className="flex items-center justify-between  gap-x-3">
            
            <div className="flex justify-center gap-x-2 items-center">
              <Link href="/" className="mr-1 ">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-12 w-12 bg-gray-200 hover:bg-gray-100"
                >
                  <ArrowLeft size={22} />
                </Button>
              </Link>
            <div>
              <CardTitle className="text-2xl">Messages</CardTitle>
              <CardDescription>Chat with people you follow</CardDescription>
            </div>
            </div>
            <div>
              <Avatar className="h-10 w-10 lg:w-11 shadow lg:h-11 border border-gray-200 dark:border-gray-700">
                <AvatarImage src={user?.image || ""} alt={user?.fullName} />
                <AvatarFallback fallbackKey={user?.email}>
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h">
            {isLoading ? (
              <div className="space-y-4 p-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-2">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </div>
                  ))}
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="divide-y">
                {filteredUsers.map((chatUser) => (
                  <div
                    key={chatUser._id}
                    className="flex items-center p-4 hover:bg-muted bg-zinc-50 rounded-2xl cursor-pointer transition-colors"
                    onClick={() => handleStartChat(chatUser._id)}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={chatUser.image || ""}
                        alt={chatUser.fullName}
                      />
                      <AvatarFallback>
                        {getInitials(chatUser.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center">
                        <p className="font-medium">{chatUser.fullName}</p>
                        {chatUser.followers?.length > 0 && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {chatUser.followers.length} followers
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {chatUser.email}
                      </p>
                    </div>
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <UserPlus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">No conversations found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery
                    ? "Try a different search term"
                    : "You're not following anyone yet. Follow users to start chatting."}
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatUsersListing;
