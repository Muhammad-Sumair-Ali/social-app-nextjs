
"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useSuggestedUsers } from "@/app/context/suggestingUsersContext"
import { useAuth } from "@/app/context/useAuth"
import { useUsersActions } from "@/hooks/useUsersAction"
import type { IUser } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { UserPlus, Users } from "lucide-react"

const SuggestUsersMobile = () => {
  const { user } = useAuth()
  const { users, fetchSuggestedUsers, loading } = useSuggestedUsers()
  const { handleFollow } = useUsersActions()

  useEffect(() => {
    if (user && (!users || users.length === 0)) {
      fetchSuggestedUsers()
    }
  }, [user, users, fetchSuggestedUsers])

  const filterUsers = users?.filter((account: IUser) => {
    const isFollowing =
      Array.isArray(user?.following) &&
      user.following.some((followingId: string) => followingId === account._id?.toString())
    return !isFollowing && account._id !== user?._id
  })

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="px-4 py-3">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          People you may know
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="min-w-[200px] max-w-[200px] border shadow-sm">
              <CardContent className="p-0">
                <div className="flex flex-col items-center">
                  <div className="w-full h-24 bg-muted/50 rounded-t-lg" />
                  <div className="flex flex-col items-center -mt-10 px-3 pb-3 w-full">
                    <Skeleton className="h-16 w-16 rounded-full border-4 border-background" />
                    <div className="mt-3 space-y-1.5 w-full">
                      <Skeleton className="h-4 w-3/4 mx-auto" />
                      <Skeleton className="h-3 w-1/2 mx-auto" />
                      <div className="flex justify-center gap-4 mt-2">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                      <Skeleton className="h-8 w-full mt-3 rounded-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!filterUsers || filterUsers.length === 0) {
    return null
  }

  return (
    <div className="px-4 py-3">
      <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5">
        <Users className="h-4 w-4" />
        People you may know
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {filterUsers.map((account: IUser) => (
          <Card
            key={account._id?.toString()}
            className="min-w-[200px] pt-2 max-w-[200px] border  shadow-sm hover:shadow-md transition-all duration-300 snap-start"
          >
          
            <CardContent className="p-0 relative">
              <div className="flex flex-col items-center px-4 -mb-1">

                <div className="flex flex-row gap-2 justify-between items-center">
                <div className=" w-full flex justify-center">
                  <Link href={`/user/${account._id}`} className="block -ml-4">
                    <Avatar className="h-20 w-20 border-4 border-background shadow-md hover:scale-105 transition-transform duration-300">
                      <AvatarImage
                        src={account.image || "/placeholder.svg?height=80&width=80"}
                        alt={account.fullName}
                      />
                      <AvatarFallback fallbackKey={account.email}  className="text-lg">
                        {account.fullName?.substring(0, 2).toUpperCase() ||
                          account.email?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </div>

                <div className=" text-center w-full">
                  <Link href={`/user/${account._id}`} className="hover:underline inline-block">
                    <h4 className="font-semibold text-lg">{account.fullName}</h4>
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">@{account.email?.split("@")[0]}</p>
                </div>

                </div>


                {/* Stats row */}
                <div className="flex justify-center gap-6 mt-3 w-full">
                  <div className="text-center">
                    <div className="font-bold text-sm">
                      {Array.isArray(account?.following) ? account.following.length : 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Following</div>
                  </div>

                  <div className="text-center">
                    <div className="font-bold text-sm">{Number(account.likes) || 0}</div>
                    <div className="text-xs text-muted-foreground">Likes</div>
                  </div>
                </div>

                {/* Follow button */}
                <Button
                  onClick={async () => {
                    await handleFollow(account)
                    fetchSuggestedUsers()
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full mt-2  rounded-full hover:bg-violet-500 hover:text-white hover:border-violet-500 transition-colors"
                >
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                  Follow
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default SuggestUsersMobile
