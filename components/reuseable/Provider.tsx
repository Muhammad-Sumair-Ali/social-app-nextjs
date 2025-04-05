"use client";
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "@/components/reuseable/Notification";
import { ToastProvider } from "./Toast";
import { AuthProvider } from "@/app/context/useAuth";
import { SuggestedUsersProvider } from "@/app/context/suggestingUsersContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <SuggestedUsersProvider>
          <AuthProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </AuthProvider>
        </SuggestedUsersProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
