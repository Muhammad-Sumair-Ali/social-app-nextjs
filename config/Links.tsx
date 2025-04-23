"use client"
import {
  Home,
  Compass,
  PlusSquare,
  User,
  TrendingUp,
  Bell,
} from "lucide-react";
import { JSX } from "react";

// Define a type for navigation links
export type NavLink = {
  href: string;
  label: string;
  icon: JSX.Element;
  requiresAuth: boolean;
  redirectIfNoAuth?: string;
};

// Single source of truth for navigation links
export const NAV_LINKS: NavLink[] = [
  { 
    href: "/", 
    label: "For You", 
    icon: <Home className="w-6 h-6" />,
    requiresAuth: false // Available to all users
  },
  {
    href: "/explore",
    label: "Explore",
    icon: <Compass className="w-6 h-6" />,
    requiresAuth: true,
    redirectIfNoAuth: "/login"
  },
  {
    href: "/trending",
    label: "Trending",
    icon: <TrendingUp className="w-6 h-6" />,
    requiresAuth: true,
    redirectIfNoAuth: "/login"
  },
  {
    href: "/reels",
    label: "Reels",
    icon: <PlusSquare className="w-6 h-6" />,
    requiresAuth: true,
    redirectIfNoAuth: "/login"
  },
  {
    href: "/notifications",
    label: "Notifications",
    icon: <Bell className="w-6 h-6" />,
    requiresAuth: true,
    redirectIfNoAuth: "/login"
  },
  {
    href: "/chat-home",
    label: "Messages",
    icon: <Bell className="w-6 h-6" />,
    requiresAuth: true,
    redirectIfNoAuth: "/login"
  },
  {
    href: "/profile",
    label: "Profile",
    icon: <User className="w-6 h-6" />,
    requiresAuth: false 
  },
];

export const USER_NAV_LINKS = NAV_LINKS;
export const USER_OFFLINE_LINKS = NAV_LINKS.map(link => 
  link.requiresAuth ? { ...link, href: link.redirectIfNoAuth || "/login" } : link
);