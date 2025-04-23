"use client";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/app/context/useAuth";
import { SuggestedUsersProvider } from "@/app/context/suggestingUsersContext";



export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SuggestedUsersProvider>
        <AuthProvider>

          {children}
          
        </AuthProvider>
      </SuggestedUsersProvider>
    </SessionProvider>
  );
}
