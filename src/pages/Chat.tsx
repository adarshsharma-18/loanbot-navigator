
import React from 'react';
import Navbar from '../components/Navbar';
import ChatInterface from '../components/ChatInterface';
import ChatHistory from '../components/ChatHistory';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const Chat = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-4 px-4 md:px-6 max-w-7xl w-full mx-auto">
        <div className="page-transition h-full flex flex-col">
          <div className="flex items-center justify-between mb-4 md:hidden">
            <h1 className="text-2xl font-bold">Chat</h1>
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showSidebar ? "Close sidebar" : "Open sidebar"}
            >
              {showSidebar ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          <div className="flex-1 flex h-full" style={{ height: 'calc(100vh - 150px)' }}>
            {/* Sidebar for chat history */}
            <aside 
              className={`
                fixed md:relative top-0 left-0 h-full z-40 bg-white md:bg-muted w-80 
                shadow-lg md:shadow-none transition-transform duration-300 
                ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                md:w-64 md:mr-4 md:rounded-2xl md:block md:transition-none
              `}
              style={{ top: showSidebar ? '80px' : '0', height: showSidebar ? 'calc(100vh - 80px)' : '100vh' }}
            >
              <ChatHistory />
            </aside>
            
            {/* Main chat area */}
            <div className="flex-1 h-full">
              <ChatInterface />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
