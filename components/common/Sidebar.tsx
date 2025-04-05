"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Home, Compass, PlusSquare, Heart, User, Menu, X, Upload, LogIn, Search, TrendingUp, Music, MessageCircle } from 'lucide-react'
import { useAuth } from "@/app/context/useAuth"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const navLinks = [
    { href: "/", label: "For You", icon: <Home className="w-6 h-6" /> },
    { href: "/explore", label: "Explore", icon: <Compass className="w-6 h-6" /> },
    { href: "/trending", label: "Trending", icon: <TrendingUp className="w-6 h-6" /> },
    { href: "/reels", label: "Reels", icon: <PlusSquare className="w-6 h-6" /> },
    { href: "/activity", label: "Activity", icon: <Heart className="w-6 h-6" /> },
    { href: "/messages", label: "Messages", icon: <MessageCircle className="w-6 h-6" /> },
    { href: "/user/profile", label: "Profile", icon: <User className="w-6 h-6" /> },
  ]

  const suggestedAccounts = [
    { id: 1, name: "dance_queen", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 2, name: "comedy_king", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 3, name: "travel_addict", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 4, name: "food_lover", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 5, name: "fitness_guru", avatar: "/placeholder.svg?height=40&width=40" },
  ]

  if (!mounted) return null

  return (
    <>
      {/* Mobile bottom navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 px-2">
        <div className="flex justify-around items-center h-16">
          {navLinks.slice(0, 5).map((link) => {
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className="flex flex-col items-center justify-center relative"
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full transition-all",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}>
                  {link.icon}
                  {isActive && (
                    <motion.div
                      layoutId="mobileBubble"
                      className="absolute inset-0 bg-primary/10 rounded-full z-[-1]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </div>
                <span className={cn(
                  "text-xs mt-1 transition-colors",
                  isActive ? "text-primary font-medium" : "text-muted-foreground"
                )}>
                  {link.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-[280px] bg-background border-r border-border h-screen sticky top-0 overflow-y-auto scrollbar-hide">

        <nav className="flex-1 px-3 mt-4">
          <div className="space-y-1 mb-6">
            {user?._id ? (
              <Button 
                variant="default" 
                size="lg" 
                className="w-full justify-start gap-3 bg-primary hover:bg-primary/90 text-primary-foreground"
                asChild
              >
                <Link href="/user/upload">
                  <Upload className="w-5 h-5" />
                  <span>Upload</span>
                </Link>
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="lg" 
                className="w-full justify-start gap-3 bg-primary hover:bg-primary/90 text-primary-foreground"
                asChild
              >
                <Link href="/login">
                  <LogIn className="w-5 h-5" />
                  <span>Log in</span>
                </Link>
              </Button>
            )}
          </div>

          <div className="space-y-1 mb-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
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
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </div>
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>

         

          <div className="px-4 py-4 text-xs text-muted-foreground">
            <p className="mb-4">© 2024 TikClone</p>
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              <Link href="#" className="hover:underline">About</Link>
              <Link href="#" className="hover:underline">Newsroom</Link>
              <Link href="#" className="hover:underline">Contact</Link>
              <Link href="#" className="hover:underline">Careers</Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile menu button */}
      <Button 
        variant="outline" 
        size="icon" 
        className="lg:hidden fixed top-4 left-4 z-50 rounded-full w-10 h-10 bg-background/80 backdrop-blur-sm border-border"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile sidebar */}
      {isOpen && (
        <motion.div 
          className="lg:hidden fixed inset-0 bg-background z-40 overflow-y-auto"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        >
          <div className="p-6 pt-20">
            <div className="mb-6">
              {user?._id ? (
                <Button 
                  variant="default" 
                  size="lg" 
                  className="w-full justify-start gap-3"
                  asChild
                >
                  <Link href="/user/upload" onClick={() => setIsOpen(false)}>
                    <Upload className="w-5 h-5" />
                    <span>Upload</span>
                  </Link>
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  size="lg" 
                  className="w-full justify-start gap-3"
                  asChild
                >
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <LogIn className="w-5 h-5" />
                    <span>Log in</span>
                  </Link>
                </Button>
              )}
            </div>

            <nav>
              <ul className="space-y-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 rounded-lg",
                          isActive 
                            ? "bg-accent text-primary font-medium" 
                            : "text-foreground hover:bg-accent/50"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="mt-8 border-t border-border pt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Suggested accounts</h3>
              <div className="space-y-3">
                {suggestedAccounts.map((account) => (
                  <Link 
                    href={`/user/${account.id}`} 
                    key={account.id}
                    className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent/50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Avatar className="w-10 h-10 border border-border">
                      <AvatarImage src={account.avatar} alt={account.name} />
                      <AvatarFallback>{account.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">@{account.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {account.name.split('_').join(' ')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}
