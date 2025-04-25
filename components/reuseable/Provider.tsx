"use client";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/app/context/useAuth";
import { SuggestedUsersProvider } from "@/app/context/suggestingUsersContext";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <SuggestedUsersProvider>
          <AuthProvider>{children}</AuthProvider>
        </SuggestedUsersProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
