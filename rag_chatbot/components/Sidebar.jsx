'use client';
import { useState } from 'react';
import { Plus, Search, MessageSquare, X } from 'lucide-react';

export default function Sidebar({
  isOpen,
  onClose,
  onChatSelect,
  chatList = [],
  activeChatId,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chatList.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-20" onClick={onClose} />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 py-1
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-700
          transform duration-300 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              RAG Chatbot
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* New Chat */}
        <div className="p-3">
          <button
            onClick={() => onChatSelect('__new__')}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 w-full text-gray-800 dark:text-gray-100"
          >
            <Plus className="w-4 h-4 dark:text-gray-300" />
            <span className="text-sm font-medium">New Chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 outline-none"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-3 mt-2">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2">
            Chats
          </div>

          {filteredChats.length === 0 && (
            <div className="text-gray-500 text-sm px-3">No chats found</div>
          )}

          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg
                ${
                  activeChatId === chat.id
                    ? 'bg-purple-100 dark:bg-purple-800 font-semibold'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }
                text-gray-800 dark:text-gray-100`}
            >
              <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <span className="text-sm truncate">{chat.title}</span>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}
