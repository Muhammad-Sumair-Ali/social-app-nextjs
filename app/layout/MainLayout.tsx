"use client";
import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import UsersSuggestSidebar from "@/components/common/UsersSuggestSidebar";
import { MobileNav } from "@/components/common/MobileNavbar";
import { useFetchPosts } from "@/hooks/usePostsActions";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, hasMore, setPage, setLoading } = useFetchPosts();

  useEffect(() => {
    const lenis = new Lenis();
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
  }, []);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = mainRef.current;
      if (!el) return;

      const scrollTop = el.scrollTop;
      const clientHeight = el.clientHeight;
      const scrollHeight = el.scrollHeight;

      if (
        scrollTop + clientHeight + 100 >= scrollHeight &&
        hasMore &&
        !loading
      ) {
        setLoading(true);
        setPage((prev) => prev + 1);
      }
    };

    const el = mainRef.current;
    if (el) el.addEventListener("scroll", handleScroll);

    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, loading]);

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
