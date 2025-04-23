"use client";
import ChatUsersListing from "@/components/chat/ChatUsersListings";
import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div> 
      <div className="sm:block hidden">

      <Header/>
      </div>

      <div className="max-w-[1210px] mx-auto flex bg-zinc-50 h-[calc(100vh-56px)]  relative">
        {/* Left Sidebar */}
        <aside className="w-[280px] hidden lg:block bg-white shadow-md">
          <Sidebar />
        </aside>

        {/* Chat Users Listing */}
        <aside className="w-[330px] hidden lg:block bg-white shadow-md">
          <ChatUsersListing />
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 h-full overflow-y-auto bg-white border-l">
          <div className="max-w-full h-full px-3 py-4 ">{children}</div>
        </main>
      </div>
    </div>
  );
}
