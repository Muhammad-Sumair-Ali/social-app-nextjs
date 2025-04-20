"use client"
import Link from "next/link"
import { Github, Loader2, Mail, Eye, EyeOff, Lock, ArrowRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthentication } from "@/hooks/useAuthentication"
import MainLayout from "@/app/layout/MainLayout"

export default function Register() {
  const {
    email,
    setEmail,
    password,
    isLoading,
    handlePasswordChange,
    handleRegister,
    fullName,
    setFullName,
    showPassword,
    setShowPassword,
    setConfirmPassword,
    confirmPassword,
    handleSocialLogin,
    passwordStrength,
  } = useAuthentication()

  return (
    <MainLayout>

    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/50">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your details to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full h-9"
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
                <path
                  fill="currentColor"
                  d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064 5.963 5.963 0 014.123 1.632l2.917-2.917a10.027 10.027 0 00-7.04-2.749 10.087 10.087 0 000 20.173c5.018 0 9.614-3.314 9.614-9.614 0-.508-.064-1.017-.19-1.506h-9.424z"
                />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              className="w-full h-9"
              onClick={() => handleSocialLogin("github")}
              disabled={isLoading}
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
          </div>

          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or with email</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <Label htmlFor="fullName" className="text-xs font-medium">
                Full Name
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-9 h-9 text-sm"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-xs font-medium">
                Email
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-9 text-sm"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-xs font-medium">
                  Password
                </Label>
                {password.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {passwordStrength === 0 && "Too weak"}
                    {passwordStrength === 1 && "Good"}
                  </span>
                )}
              </div>

              <div className="relative mt-1">
                <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  className="pl-9 h-9 text-sm"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-2 py-0 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </Button>
              </div>

              {password.length > 0 && (
                <div className="flex gap-1 mt-1.5">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-0.5 flex-1 rounded-full ${password.length >= 8 ? "bg-green-500" : "bg-muted"}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-xs font-medium">
                Confirm Password
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9 h-9 text-sm"
                  required
                  disabled={isLoading}
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-destructive mt-1">Passwords do not match</p>
              )}
            </div>

            <div className="text-xs text-muted-foreground mt-1">
              <span className={password.length >= 8 ? "text-green-500" : ""}>• At least 8 characters</span>
            </div>

            <Button type="submit" className="w-full h-9 mt-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="text-xs text-center w-full">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline underline-offset-4 font-medium">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
    </MainLayout>

  )
}
