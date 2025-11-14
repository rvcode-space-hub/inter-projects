/* eslint-disable react-hooks/set-state-in-effect */

'use client';

import React, { createContext, useState, useCallback, useEffect } from "react";
import Sidebar from "../components/Sidebar";

export const ChatContext = createContext(null);

export default function ClientLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [chatList, setChatList] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedChats = JSON.parse(localStorage.getItem("chatList") || "[]");
      const savedActive =
        localStorage.getItem("activeChatId") || savedChats[0]?.id || null;

      setChatList(savedChats);
      setActiveChatId(savedActive);
    } catch (err) {
      console.error("Failed to load chatList", err);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("chatList", JSON.stringify(chatList));
  }, [chatList, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (activeChatId) {
      localStorage.setItem("activeChatId", activeChatId);
    }
  }, [activeChatId, isLoaded]);

  const extractTitle = (text) =>
    text ? text.split(" ").slice(0, 5).join(" ") : "New Chat";

  const createNewChat = useCallback((firstMessage = "") => {
    const id = Date.now().toString();
    const title = extractTitle(firstMessage);

    const newChat = {
      id,
      title,
      messages: firstMessage
        ? [{ role: "user", content: firstMessage }]
        : [],
      createdAt: Date.now(),
    };

    setChatList((prev) => [newChat, ...prev]);
    setActiveChatId(id);
  }, []);

  const handleChatSelect = useCallback(
    (id) => {
      if (id === "__new__") {
        createNewChat("");
        return;
      }
      setActiveChatId(id);
    },
    [createNewChat]
  );

  const toggleSidebar = () => setSidebarOpen((prev) => !prev); // ✅ toggle function

  if (!isLoaded) return null;

  return (
    <ChatContext.Provider
      value={{
        chatList,
        setChatList,
        activeChatId,
        setActiveChatId,
        extractTitle,
        createNewChat,
        toggleSidebar, // ✅ pass toggleSidebar in context
      }}
    >
      <div className="h-screen flex relative">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
          chatList={chatList}
          onChatSelect={handleChatSelect}
          activeChatId={activeChatId}
        />

        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </ChatContext.Provider>
  );
}
