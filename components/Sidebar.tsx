import React from 'react';

const Sidebar = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">
          <i className="fas fa-robot text-purple-500 mr-2" />
          Kovcheg
        </h1>
        <p className="text-sm text-gray-400 mt-1">Evolution v1.0</p>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button id="newChatBtn" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
          <i className="fas fa-plus mr-2" />
          New Chat
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2">
        <a href="/dashboard" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200">
          <i className="fas fa-tachometer-alt w-6 mr-3" />
          Dashboard
        </a>
        <a href="/history" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200">
          <i className="fas fa-history w-6 mr-3" />
          History
        </a>
        <a href="/templates" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200">
          <i className="fas fa-layer-group w-6 mr-3" />
          Templates
        </a>
        {/* NEW: Development Link */}
        <button id="developmentLink" className="flex items-center px-4 py-3 text-purple-400 hover:bg-gray-700 hover:text-purple-300 rounded-lg transition-colors duration-200 border-l-2 border-purple-400 w-full text-left" onClick={() => onNavigate('ide')}>
          <i className="fas fa-code w-6 mr-3" />
          Development
        </button>
        <a href="/settings" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200">
          <i className="fas fa-cog w-6 mr-3" />
          Settings
        </a>
        <a href="/help" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200">
          <i className="fas fa-question-circle w-6 mr-3" />
          Help
        </a>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center">
          <img src="https://picsum.photos/40?random=1" alt="Alex Rivera" className="w-10 h-10 rounded-full" />
          <div className="ml-3">
            <p className="font-medium text-white">Alex Rivera</p>
            <p className="text-sm text-purple-400">AI Systems Engineer</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
