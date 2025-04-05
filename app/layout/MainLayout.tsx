import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import UsersSuggestSidebar from "@/components/common/UsersSuggestSidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="max-w-[1210px] mx-auto flex bg-zinc-50 min-h-screen relative">
        <aside className="w-[280px]  h-screen sticky top-0 overflow-y-auto hidden lg:block bg-white shadow-md">
          <Sidebar />
        </aside>

        <main className="flex-1 p-2 py-4 border-2 border-red-400 min-h-screen bg-white overflow-y-auto">
          <div className="mx-auto">{children}</div>
        </main>

        <aside className="w-[280px] h-screen sticky top-0 overflow-y-auto hidden lg:block bg-white shadow-md">
          <UsersSuggestSidebar/>
        </aside>
      </div>
    </>
  );
}
