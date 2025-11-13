'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function ClientLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [currentChatId, setCurrentChatId] = useState(null);

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentChatId={currentChatId}
        onChatSelect={setCurrentChatId}
      />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
