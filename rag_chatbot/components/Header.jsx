'use client';
import { useState, useRef, useEffect } from 'react';
import { Menu, MessageSquare, Settings, Send, Paperclip, Mic } from 'lucide-react';

function Header({ onMenuClick }) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">RAG Chatbot</h1>
        </div>
      </div>
      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <Settings className="w-5 h-5 text-gray-600" />
      </button>
    </header>
  );
}

function WelcomeScreen({ onSendMessage }) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">RAG Chatbot</h1>
          <p className="text-gray-600">Hello! Main aapki RAG chatbot hoon. Aap mujhse kuch bhi pooch sakte hain.</p>
        </div>

        <div className="relative">
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
            <Paperclip className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message RAG Chatbot..."
              className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
            />
            <Mic className="w-5 h-5 text-gray-500" />
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded-lg transition-colors"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message }) {
  return (
    <div className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.role === 'assistant' && (
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shrink-0">
          <MessageSquare className="w-4 h-4 text-white" />
        </div>
      )}
      <div
        className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${message.role === 'user'
          ? 'bg-blue-600 text-white'
          : 'bg-white border border-gray-200 text-gray-800'
          }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}


export default function RAGChatbot() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "user",
          prompt: text,
        }),
      });

    



      const data = await res.json();
      console.log("🔍 API Response:", data);

      const botReply = {
        role: 'assistant',
        content: data.response || data.text || data.message || '❌ No response from AI.',
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error("Fetch Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Error fetching AI response.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => sendMessage(input);
  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <Header />

      {messages.length === 0 ? (
        <WelcomeScreen onSendMessage={sendMessage} />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
            {isLoading && (
              <div className="text-gray-500 text-sm italic text-center">Thinking...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-2xl px-4 py-3 shadow-sm">
              <Paperclip className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Message RAG Chatbot..."
                className="flex-1 bg-transparent outline-none"
              />
              <Mic className="w-5 h-5 text-gray-500" />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded-lg transition-colors"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
