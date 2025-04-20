"use client";
import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import UsersSuggestSidebar from "@/components/common/UsersSuggestSidebar";
import { MobileNav } from "@/components/common/MobileNavbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  useEffect(() => {
    const lenis = new Lenis();
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
  }, []);
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Header />
      <div className="max-w-[1210px] mx-auto flex bg-zinc-50 min-h-screen relative">
        <aside className="w-[280px]  h-screen sticky top-14 overflow-y-auto hidden lg:block bg-white shadow-md">
          <Sidebar />
        </aside>

        <main
          ref={mainRef}
          className="flex-1 p-2 py-4 min-h-screen bg-white overflow-y-auto"
        >
          <div className="mx-auto">{children}</div>
        </main>

        <aside className="w-[280px] h-screen sticky top-14 overflow-y-auto hidden lg:block bg-white shadow-md">
          <UsersSuggestSidebar />
        </aside>
      </div>
      <div className="block  md:hidden">
        <MobileNav />
      </div>
    </>
  );
}
