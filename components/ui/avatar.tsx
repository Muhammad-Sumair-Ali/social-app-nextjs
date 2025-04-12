"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"
import { getColorFromString } from "@/lib/helpers"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}


function AvatarFallback({
  className,
  fallbackKey = "",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> & {
  fallbackKey?: string
}) {
  const bgColor = getColorFromString(fallbackKey)

  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full text-white",
        bgColor,
        className
      )}
      {...props}
    />
  )
}


export { Avatar, AvatarImage, AvatarFallback }
