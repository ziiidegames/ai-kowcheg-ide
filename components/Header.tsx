import React from 'react';

const Header = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <button className="text-gray-400 hover:text-white transition-colors duration-200" onClick={() => onNavigate('workspace')}>
            WORKSPACE
          </button>
          <a href="/projects" className="text-gray-400 hover:text-white transition-colors duration-200">
            Projects
          </a>
          <a href="/models" className="text-gray-400 hover:text-white transition-colors duration-200">
            Models
          </a>
          <a href="/api" className="text-gray-400 hover:text-white transition-colors duration-200">
            API
          </a>
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search knowledge base..."
              className="bg-gray-700 text-gray-300 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-500" />
          </div>

          {/* Icons */}
          <button className="text-gray-400 hover:text-white transition-colors duration-200">
            <i className="fas fa-bell text-xl" />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors duration-200">
            <i className="fas fa-envelope text-xl" />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors duration-200">
            <i className="fas fa-user-circle text-xl" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
