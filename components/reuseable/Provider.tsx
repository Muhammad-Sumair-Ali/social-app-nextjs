"use client";
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "@/components/reuseable/Notification";
import { ToastProvider } from "./Toast";
import { AuthProvider } from "@/app/context/useAuth";

export default function Providers({ children }: { children: React.ReactNode }) {


  return (
    <SessionProvider>
    <ToastProvider>
      <AuthProvider>
      <NotificationProvider>
          {children}
      </NotificationProvider>
      </AuthProvider>
    </ToastProvider>
    </SessionProvider>
  );
}