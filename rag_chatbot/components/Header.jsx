'use client';

import { Menu, Sun, Moon } from 'lucide-react';

export default function Header({ onMenuClick, darkMode, toggleDarkMode }) {
  return (
    <header
      className={`px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-50 border-b transition-colors
        ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
      `}
    >
      {/* Left: Menu + Logo + Title */}
      <div className="flex items-center gap-3">
        {/* Hamburger Menu */}
        <button
          onClick={onMenuClick}
          aria-label="Toggle Sidebar"
          className="lg:hidden p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Menu className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
        </button>

        {/* Logo & App Title */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-600 rounded-full" />
          <h1 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Gemini
          </h1>
        </div>
      </div>

      {/* Right: Dark / Light Mode Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
    </header>
  );
}
