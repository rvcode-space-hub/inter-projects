'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

export default function Page() {

  const [darkMode, setDarkMode] = useState(false);


  // Dark Mode toggle effect
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <div
      className={`flex flex-col h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'
      }`}
    >
      {/* Header */}
      <Header>
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="ml-auto mr-4 text-sm px-3 py-1 rounded-lg border transition-colors duration-200
            dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-300"
        >
          {darkMode ? '🌙 Dark' : '☀️ Light'}
        </button>
      </Header>

    </div>
  );
}
