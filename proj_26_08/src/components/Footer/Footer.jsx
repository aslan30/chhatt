import React from 'react';

function Footer({ darkMode }) {
  return (
    <footer className={`py-6  text-center transition-all duration-500 ${
      darkMode
        ? 'bg-gradient-to-r from-gray-900 via-purple-900 to-black text-gray-300 border-t border-gray-800'
        : 'bg-gradient-to-r from-indigo-200 via-purple-300 to-indigo-400 text-gray-900 border-t border-gray-300'
    }`}>
      <div className="container mx-auto">
        <p className="text-sm font-semibold">&copy; {new Date().getFullYear()} MyApp. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
