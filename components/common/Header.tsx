"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Home, Search, Plus, LogOut, Menu, X, User } from "lucide-react";
import { useNotification } from "@/components/reuseable/Notification";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/app/context/useAuth";

export default function Header() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 bg-white z-50 transition-all border-b  duration-300">
      <div className=" max-w-[1230px] mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl"
            prefetch={true}
            onClick={() => showNotification("Welcome to ReelsPro PK", "info")}
          >
            <div className="bg-gradient-to-r from-zinc-800 to-gray-500 p-1.5 rounded-md text-white">
              <Home className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline">ReelsPro Pakistani</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                className="bg-muted/50 rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Link href={ user ? "/user/upload" : "/login"}>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full"
              >
                <Plus className="w-4 h-4" />
                <span>Upload</span>
              </Button>
            </Link>

            {user?._id ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-9 w-9 lg:w-11 shadow lg:h-11 border border-gray-200 dark:border-gray-700">
                      <AvatarImage src={user.image || ""} alt={user.fullName} />
                      <AvatarFallback fallbackKey={user.email}>
                        {user.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {user.fullName || "User"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/user/profile"
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button size="sm" className="rounded-full">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            {user?._id && (
              <Link href="/user/upload">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Plus className="w-4 h-4" />
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                className="bg-muted/50 rounded-full pl-10 pr-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {user?._id ? (
              <>
                <div className="flex items-center gap-3 p-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user.fullName || "User"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {user.fullName || "User"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </div>
                <Link
                  href="/user/profile"
                  className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    showNotification("Welcome to Admin Dashboard", "info");
                  }}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 text-destructive hover:bg-muted rounded-md text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  showNotification("Please sign in to continue", "info");
                }}
              >
                <Button className="w-full rounded-full">Login</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
