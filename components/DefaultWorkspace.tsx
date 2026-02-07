import React from 'react';

const DefaultWorkspace = () => {
  return (
    <div id="default-workspace" className="flex-1 flex flex-col overflow-hidden">
      {/* Workspace Canvas */}
      <main className="flex-1 overflow-hidden relative bg-gray-950">
        <div id="workspace-canvas" className="w-full h-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <i className="fas fa-robot text-4xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">AI Kovcheg Evolution</h2>
              <p className="text-gray-400 mb-6">Click &quot;Development&quot; in the sidebar to open the IDE</p>
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <i className="fas fa-code text-purple-400 text-xl mb-2" />
                  <h3 className="font-medium text-white mb-1">Development IDE</h3>
                  <p className="text-sm text-gray-400">Full-featured code editor with AI assistance</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <i className="fas fa-brain text-blue-400 text-xl mb-2" />
                  <h3 className="font-medium text-white mb-1">Local AI Models</h3>
                  <p className="text-sm text-gray-400">Connect to Ollama for local inference</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <i className="fas fa-sync text-green-400 text-xl mb-2" />
                  <h3 className="font-medium text-white mb-1">Self-Evolution</h3>
                  <p className="text-sm text-gray-400">AI can modify its own codebase</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Command Line */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Message Kovcheg AI..."
              className="w-full bg-gray-700 text-gray-300 placeholder-gray-500 pl-4 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="absolute right-3 top-3 flex space-x-2">
              <button className="text-gray-400 hover:text-white">
                <i className="fas fa-microphone" />
              </button>
              <button className="text-gray-400 hover:text-white">
                <i className="fas fa-paperclip" />
              </button>
            </div>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default DefaultWorkspace;
