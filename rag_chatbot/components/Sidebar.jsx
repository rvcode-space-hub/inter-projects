'use client';
import { useState } from 'react';
import { Plus, Search, MessageSquare, X } from 'lucide-react';

export default function Sidebar({ isOpen, onClose, onChatSelect }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-20" onClick={onClose} />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-800">RAG Chatbot</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* New Chat */}
        <div className="p-3">
          <button
            onClick={() => onChatSelect('new')}
            className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 w-full"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">New Chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg text-sm focus:ring-2 focus:ring-gray-200 outline-none"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-3 mt-2">
          <div className="text-xs font-semibold text-gray-500 px-3 py-2">Chats</div>
          <button
            onClick={() => onChatSelect(1)}
            className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg"
          >
            <MessageSquare className="w-4 h-4 text-gray-600" />
            <span className="text-sm">Sample Chat</span>
          </button>
        </div>
      </aside>
    </>
  );
}
