"use client";

import ChatLayout from "@/app/layout/ChatLayout";
import ChatUsersListing from "@/components/chat/ChatUsersListings";

const ChatUsersListingPage = () => {
  return (
    <ChatLayout>
      <div className="min-h-screen">
        <div className="md:hidden block">
        <ChatUsersListing />
        </div>
      </div>
    </ChatLayout>
  );
};

export default ChatUsersListingPage;
