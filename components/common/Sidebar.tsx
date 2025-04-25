"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Upload, LogIn } from "lucide-react";
import { useAuth } from "@/app/context/useAuth";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/config/Links";

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  const storedNotifications =
    typeof window !== "undefined"
      ? localStorage.getItem("unreadNotificationsCount")
      : null;

  const [notificationData, setNotificationData] = useState<number>(0);

  useEffect(() => {
    if (storedNotifications) {
      setNotificationData(
        storedNotifications ? JSON.parse(storedNotifications) : 0
      );
    }
  }, [storedNotifications]);

  useEffect(() => {
    setMounted(true);
  }, []);
    
  if (!mounted) return null;
  
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-[280px] bg-background border-r border-border h-screen sticky top-0 overflow-y-auto scrollbar-hide">
        <nav className="flex-1 px-3 mt-4">
          <div className="mb-6">
            {user ? (
              <Link
                href="/upload"
                className="block"
              >
                <div className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-white bg-gradient-to-r from-slate-700 to-zinc-800 hover:opacity-90 transition">
                  <Upload className="w-5 h-5" />
                  <span>Upload Post</span>
                </div>
              </Link>
            ) : (
              <Link
                href="/login"
                className="block"
              >
                <div className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-white bg-gradient-to-r from-slate-700 to-zinc-800 hover:opacity-90 transition">
                  <LogIn className="w-5 h-5" />
                  <span>Log in</span>
                </div>
              </Link>
            )}
          </div>

          <div className="space-y-1 mb-8">
            {NAV_LINKS.map((link) => {
              // Determine the actual href based on auth status
              const actualHref = (!user && link.requiresAuth) 
                ? (link.redirectIfNoAuth || "/login") 
                : link.href;
                
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={actualHref}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-lg relative group transition-all",
                    isActive
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  <div className="relative">
                    {link.icon}
                    {isActive && (
                      <motion.div
                        layoutId="bubble"
                        className="absolute inset-0 bg-primary/20 rounded-full z-[-1] w-10 h-10 -m-2"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                  </div>
                  <span>{link.label}</span>
                  {link.label === "Notifications" &&
                    notificationData > 0 && (
                      <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                        {notificationData}
                      </span>
                    )}
                </Link>
              );
            })}
          </div>

          <div className="px-4 py-4 text-xs text-muted-foreground">
            <p className="mb-4">© 2025 ReelsPro PK</p>
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              <Link href="#" className="hover:underline">
                About
              </Link>
              <Link href="#" className="hover:underline">
                Newsroom
              </Link>
              <Link href="#" className="hover:underline">
                Contact
              </Link>
              <Link href="#" className="hover:underline">
                Careers
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}