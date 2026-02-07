"use client";
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFile, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Editor, { OnMount } from '@monaco-editor/react';

interface FileItem {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileItem[];
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const FileTreeItem = ({ item, onSelect, selectedPath }: {
  item: FileItem;
  onSelect: (file: FileItem) => void;
  selectedPath?: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const isSelected = selectedPath === item.path;

    if (item.type === 'directory') {
        return (
            <div className="ml-4">
                <div
                    className={`cursor-pointer flex items-center p-1 rounded ${isSelected ? 'bg-purple-800' : 'hover:bg-gray-700'}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <FontAwesomeIcon icon={faFolder} className="mr-2 text-purple-400" />
                    <span>{item.name}</span>
                </div>
                {isOpen && item.children && item.children.map(child => (
                    <FileTreeItem key={child.path} item={child} onSelect={onSelect} selectedPath={selectedPath} />
                ))}
            </div>
        );
    } else {
        return (
            <div className="ml-4">
                <div
                    className={`cursor-pointer flex items-center p-1 rounded ${isSelected ? 'bg-purple-800' : 'hover:bg-gray-700'}`}
                    onClick={() => onSelect(item)}
                >
                    <FontAwesomeIcon icon={faFile} className="mr-2 text-gray-400" />
                    <span>{item.name}</span>
                </div>
            </div>
        );
    }
};

// Mock-данные для дерева файлов
const mockFileTreeData: FileItem = {
    name: "ai-kovcheg",
    type: "directory",
    path: "/ai-kovcheg",
    children: [
        { name: "package.json", type: "file", path: "/ai-kovcheg/package.json" },
        { name: "README.md", type: "file", path: "/ai-kovcheg/README.md" },
        {
            name: "src", type: "directory", path: "/ai-kovcheg/src",
            children: [
                { name: "index.js", type: "file", path: "/ai-kovcheg/src/index.js" },
                {
                    name: "components", type: "directory", path: "/ai-kovcheg/src/components",
                    children: [
                        { name: "App.jsx", type: "file", path: "/ai-kovcheg/src/components/App.jsx" },
                    ]
                }
            ]
        }
    ]
};

const mockFileContent: Record<string, string> = {
    "/ai-kovcheg/package.json": JSON.stringify({ name: "ai-kovcheg", version: "0.1.0", private: true }, null, 2),
    "/ai-kovcheg/README.md": "# AI Kovcheg\n\nПроект для демонстрации интеграции AI в среду разработки.",
    "/ai-kovcheg/src/index.js": "console.log('Hello, AI Kovcheg!');",
    "/ai-kovcheg/src/components/App.jsx": "import React from 'react';\n\nconst App = () => <div>Hello from App!</div>;\n\nexport default App;",
};

const DevelopmentIDE = () => {
    const [fileTree, setFileTree] = useState<FileItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
    const [fileContent, setFileContent] = useState('// Select a file to start editing');
    const editorInstanceRef = useRef<any>(null);

    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: 'Hello! I am your AI code assistant. Select a file to start editing, or ask me to help you with any coding task.' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFileTree(mockFileTreeData);
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!selectedFile) return;
        const content = mockFileContent[selectedFile.path] || `// Content for ${selectedFile.name} not found`;
        setFileContent(content);
    }, [selectedFile]);

    const handleFileSelect = (file: FileItem) => {
        if (file.type === 'file') {
            setSelectedFile(file);
        }
    };

    const handleEditorDidMount: OnMount = (editor) => {
        editorInstanceRef.current = editor;
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || isTyping) return;

        const userMessage: Message = { sender: 'user', text: inputMessage };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:11434/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: "llama3:8b",
                    messages: [...messages, userMessage].map(m => ({
                        role: m.sender === 'ai' ? 'assistant' : 'user',
                        content: m.text
                    })),
                    stream: false
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const data = await response.json();

            if (data && data.message && data.message.content) {
                const aiMessage: Message = { sender: 'ai', text: data.message.content };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                throw new Error("Unexpected response structure from Ollama API");
            }

        } catch (error) {
            console.error("Error communicating with Ollama:", error);
            const errorMessage: Message = {
                sender: 'ai',
                text: "Sorry, I'm having trouble with the AI model's response. Please check if Ollama is running correctly."
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            {/* Панель с деревом файлов */}
            <div className="w-1/5 bg-gray-800 p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">File Explorer</h2>
                {isLoading ? (
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                        <span>Loading files...</span>
                    </div>
                ) : (
                    fileTree && <FileTreeItem item={fileTree} onSelect={handleFileSelect} selectedPath={selectedFile?.path} />
                )}
            </div>

            {/* Основная область с редактором кода */}
            <div className="w-3/5 flex flex-col">
                <div className="flex-1 bg-gray-900">
                    <Editor
                        height="100%"
                        theme="vs-dark"
                        path={selectedFile ? selectedFile.path : 'untitled.txt'}
                        defaultValue="// Select a file to start editing"
                        value={fileContent}
                        onMount={handleEditorDidMount}
                        options={{ minimap: { enabled: false } }}
                    />
                </div>
            </div>

            {/* Панель AI Assistant */}
            <div className="w-1/5 bg-gray-800 flex flex-col">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold">AI Assistant</h2>
                </div>
                <div id="chat-messages" className="flex-1 p-4 space-y-4 overflow-y-auto">
                     {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`rounded-lg px-4 py-2 max-w-xs lg:max-w-md ${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="rounded-lg px-4 py-2 max-w-xs lg:max-w-md bg-gray-700 text-gray-300">
                                <p className="text-sm">
                                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                                    AI is typing...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-gray-700">
                    <form onSubmit={handleSendMessage}>
                        <textarea
                            className="w-full bg-gray-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows={3}
                            placeholder="Ask AI for help..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                        />
                        <button type="submit" className="w-full mt-2 bg-purple-600 hover:bg-purple-700 rounded-lg p-2 text-sm font-bold">
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DevelopmentIDE;
