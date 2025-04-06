
import {
    Home,
    Compass,
    PlusSquare,
    Heart,
    User,
    TrendingUp,
    MessageCircle,
  } from "lucide-react";


export const USER_NAV_LINKS = [
    { href: "/", label: "For You", icon: <Home className="w-6 h-6" /> },
    {
      href: "/explore",
      label: "Explore",
      icon: <Compass className="w-6 h-6" />,
    },
    {
      href: "/trending",
      label: "Trending",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      href: "/reels",
      label: "Reels",
      icon: <PlusSquare className="w-6 h-6" />,
    },
    {
      href: "/activity",
      label: "Activity",
      icon: <Heart className="w-6 h-6" />,
    },
    {
      href: "/messages",
      label: "Messages",
      icon: <MessageCircle className="w-6 h-6" />,
    },
    {
      href: "/user/profile",
      label: "Profile",
      icon: <User className="w-6 h-6" />,
    },
  ];