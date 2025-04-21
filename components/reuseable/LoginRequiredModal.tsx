"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Lock, UserCircle } from "lucide-react"

interface LoginRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  loginHref?: string
  signupHref?: string
}

export function LoginRequiredModal({
  isOpen,
  onClose,
  title = "Authentication Required",
  description = "Please sign in to your account to access premium content and features.",
  loginHref = "/login",
  signupHref = "/register",
}: LoginRequiredModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <UserCircle className="h-8 w-8 text-gray-700" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold text-gray-900">{title}</DialogTitle>
          <DialogDescription className="text-center text-gray-600 pt-2">{description}</DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-3">
          <div className="flex items-center rounded-md border border-gray-100 bg-gray-50 p-3">
            <Lock className="mr-3 h-5 w-5 text-gray-500" />
            <p className="text-sm text-gray-600">Unlock premium features</p>
          </div>
          <div className="flex items-center rounded-md border border-gray-100 bg-gray-50 p-3">
            <Lock className="mr-3 h-5 w-5 text-gray-500" />
            <p className="text-sm text-gray-600">Access exclusive content</p>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3">
          <Button asChild className="w-full bg-gray-900 hover:bg-gray-800 sm:w-auto">
            <a href={loginHref}>Sign In</a>
          </Button>
          <Button asChild variant="outline" className="w-full border-gray-300 sm:w-auto">
            <a href={signupHref}>Create Account</a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
