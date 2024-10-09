import React from 'react';

function ThemeSwitcher({ isDarkMode, toggleTheme }) {
  return (
    <div className="flex items-center gap-2">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isDarkMode}
          onChange={toggleTheme}
          className="sr-only"
        />
        <div
          className={`relative w-20 h-10 rounded-full transition-colors duration-300 ease-in-out ${isDarkMode ? 'bg-gray-800' : 'bg-gray-300'}`}
        >
          <div
            className={`absolute top-0 left-0 w-10 h-10 rounded-full shadow-md transition-transform duration-300 ease-in-out ${isDarkMode ? 'bg-gray-200 translate-x-10' : 'bg-gray-700 translate-x-0'}`}
          />
          <span
            className={`absolute left-2 top-1/2 transform -translate-y-1/2 text-lg font-semibold select-none cursor-default ${isDarkMode ? 'text-gray-400' : 'text-yellow-500'}`}
          >
            ☀️
          </span>
          <span
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-lg font-semibold select-none cursor-default ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}
          >
            🌙
          </span>
        </div>
      </label>
    </div>
  );
}

export default ThemeSwitcher;
