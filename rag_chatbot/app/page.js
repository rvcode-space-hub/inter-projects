"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import Header from "@/components/Header";
import ChatMessage from "@/components/ChatMessage";
import WelcomeScreen from "@/components/WelcomeScreen";
import InputBox from "@/components/InputBox";
import { ChatContext } from "@/lib/ClientLayout";

export default function Page() {
  const { chatList, setChatList, activeChatId, extractTitle, createNewChat } =
    useContext(ChatContext);

  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // new

  const messagesEndRef = useRef(null);

  useEffect(() => setMounted(true), []);

  // Load messages for active chat
  useEffect(() => {
    if (!activeChatId) return;
    const saved = localStorage.getItem("chat-" + activeChatId);
    setMessages(saved ? JSON.parse(saved) : []);
  }, [activeChatId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (mounted) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mounted]);

  // Ensure chat exists
  const ensureChatExists = () => {
    if (!activeChatId) {
      createNewChat();
      return Date.now().toString();
    }
    return activeChatId;
  };

  // ---------------------------
  // SEND MESSAGE
  // ---------------------------
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const cleaned = text.trim();
    const chatId = ensureChatExists();

    const userMsg = { role: "user", content: cleaned };
    const updated = [...messages, userMsg];
    setMessages(updated);
    localStorage.setItem("chat-" + chatId, JSON.stringify(updated));

    // Update chat title if needed
    const chat = chatList.find((c) => c.id === chatId);
    if (chat && chat.title === "New Chat") {
      const newTitle = extractTitle(cleaned);
      setChatList(
        chatList.map((c) => (c.id === chatId ? { ...c, title: newTitle } : c))
      );
    }

    setIsLoading(true);

    try {
      // Store message in DB
      await fetch("/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: chatId, text: cleaned }),
      });

      // Call context-aware AI chat API
      const AIChat = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: cleaned }),
      });
      const llmJson = await AIChat.json();

      const aiMessage = {
        role: "assistant",
        content: llmJson.response || "⚠️ No response from AI.",
      };

      const finalMsgs = [...updated, aiMessage];
      setMessages(finalMsgs);
      localStorage.setItem("chat-" + chatId, JSON.stringify(finalMsgs));
    } catch (err) {
      console.error("Chat API Error:", err);
      const errorMsg = [
        ...updated,
        { role: "assistant", content: "⚠️ Error getting response from AI." },
      ];
      setMessages(errorMsg);
      localStorage.setItem("chat-" + chatId, JSON.stringify(errorMsg));
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------
  // HANDLE FILE UPLOAD
  // ---------------------------
  const handleFileAction = async (input, fileContent) => {
    if (!fileContent) return;
    const combined = (input ? input + "\n\n" : "") + fileContent;
    sendMessage(combined);
  };

  // ---------------------------
  // TOGGLE SIDEBAR
  // ---------------------------
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (!mounted)
    return (
      <div className="flex items-center justify-center h-full text-gray-700 dark:text-gray-200">
        Loading...
      </div>
    );

  return (
    <div
      className={`flex h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >

      <div className="flex-1 flex flex-col">
        <Header
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          onMenuClick={toggleSidebar} // ✅ function passed
        />

        {activeChatId && messages.length === 0 ? (
          <WelcomeScreen
            onSendMessage={sendMessage}
            onFileAction={handleFileAction}
            darkMode={darkMode}
          />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} message={msg} darkMode={darkMode} />
              ))}

              {isLoading && (
                <p className="text-center text-sm text-gray-500 italic dark:text-gray-400">
                  Thinking...
                </p>
              )}

              <div ref={messagesEndRef} />
            </div>

            <InputBox onSend={sendMessage} disabled={isLoading} darkMode={darkMode} />
          </>
        )}
      </div>
    </div>
  );
}
