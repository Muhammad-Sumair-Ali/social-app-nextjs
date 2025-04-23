"use client";

import { useParams } from "next/navigation";
import { useState, FormEvent } from "react";
import { useAuth } from "@/app/context/useAuth";
import { getFirstNameFromEmail } from "@/lib/helpers";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, RefreshCw, ArrowLeft, Smile, Paperclip } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMessages } from "@/hooks/useMessages";
import { useReceiver } from "@/hooks/useReceiver";
import { useMessageUI } from "@/hooks/useMessageUI";

export default function UserMessagesChat() {
  const { user: currentUser } = useAuth();
  const [text, setText] = useState("");
  const { id: receiverId } = useParams<{ id: string }>();
  
  // Custom hooks
  const { receiverUser } = useReceiver(receiverId);
  const { messages, loading, sending, fetchMessages, sendMessage, setupPolling } = useMessages(currentUser, receiverId);
  const { messagesEndRef, inputRef, formatMessageTime, isCurrentUser, groupedMessages, focusInput } = useMessageUI(messages, currentUser?._id);

  // Initialize polling
  setupPolling();

  // Handle message submission
  const handleSendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!receiverUser || !text.trim()) return;
    
    await sendMessage(text, receiverUser);
    setText("");
    focusInput();
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-80px)] md:h-[85vh] rounded-lg shadow-md border bg-background overflow-hidden">
      {/* Header */}
      <div className="flex items-center p-3 border-b bg-white/90 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <Link href="/messages" className="mr-3">
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-gray-100">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        
        <Link href={`/${receiverUser?._id}`} className="flex items-center flex-1 min-w-0">
          <Avatar className="h-10 w-10 border shadow-sm mr-3">
            <AvatarImage
              src={receiverUser?.image}
              alt={receiverUser?.fullName || "User"}
            />
            <AvatarFallback>
              {receiverUser?.fullName?.substring(0, 2).toUpperCase() || 
               receiverUser?.email?.substring(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="truncate">
            <h2 className="text-base font-semibold text-foreground truncate">
              {receiverUser?.fullName || getFirstNameFromEmail(receiverUser?.email || "")}
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              {receiverUser?.email}
            </p>
          </div>
        </Link>
        
        <Button 
          onClick={fetchMessages} 
          variant="ghost" 
          size="icon" 
          className="ml-auto rounded-full h-8 w-8 hover:bg-gray-100"
          disabled={loading}
          title="Refresh messages"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>

      {/* Messages area */}
      <div className="flex-1 -mt-6 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-slate-50 to-white">
        {Object.keys(groupedMessages).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Send size={24} className="text-primary" />
            </div>
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs">Start a conversation with {receiverUser?.fullName || "this user"}!</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              <div className="flex justify-center">
                <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                  {date}
                </span>
              </div>
              
              {dateMessages.map((msg, index) => {
                const isSentByMe = isCurrentUser(msg.sender._id);
                const showAvatar = !isSentByMe && 
                  (index === 0 || 
                   dateMessages[index - 1]?.sender._id.toString() !== msg.sender._id.toString());
                
                return (
                  <AnimatePresence key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex ${isSentByMe ? "flex-row-reverse" : "flex-row"} items-end gap-2 max-w-[85%]`}>
                        {!isSentByMe && showAvatar ? (
                          <Avatar className="h-6 w-6 flex-shrink-0">
                            <AvatarImage src={msg.sender.image} />
                            <AvatarFallback>
                              {msg.sender.fullName?.substring(0, 2).toUpperCase() || 
                               msg.sender.email?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-6 flex-shrink-0" />
                        )}
                        
                        <div className="flex flex-col">
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                              isSentByMe
                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                : "bg-gray-100 text-foreground rounded-tl-none"
                            }`}
                          >
                            {msg.text}
                          </div>
                          <span className={`text-xs text-muted-foreground mt-1 ${isSentByMe ? "text-right" : "text-left"} px-1`}>
                            {formatMessageTime(msg.timestamp)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSendMessage} className="p-3 border-t bg-white/90 backdrop-blur-sm">
        <div className="flex gap-2 items-center bg-gray-50 rounded-full px-3 border border-gray-100 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50">
          <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-transparent"
          >
            <Smile size={20} />
          </Button>
          
          <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-transparent"
          >
            <Paperclip size={20} />
          </Button>
          
          <Input
            ref={inputRef}
            placeholder="Type a message..."
            className="flex-1 h-11 border-0 bg-transparent focus-visible:ring-0 px-1"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={!receiverUser}
          />
          
          <Button 
            type="submit"
            className="h-9 w-9 rounded-full p-0 flex items-center justify-center bg-primary hover:bg-primary/90 text-white"
            disabled={!text.trim() || sending || !receiverUser}
          >
            <Send size={16} className={sending ? "animate-pulse" : ""} />
          </Button>
        </div>
      </form>
    </Card>
  );
}