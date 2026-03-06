import React, { useState } from 'react';
import FileUpload from '../components/UI/FileUpload'; 
import Sidebar from '../components/Layout/Sidebar';
import ChatHistory from '../components/UI/Chat';

const MainPage: React.FC = () => {
  const [activeContextId, setActiveContextId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [contexts, setContexts] = useState<any[]>([]);

  const handleSelectContext = (id: string | null, history: any[]) => {
    setActiveContextId(id);  
    setChatHistory(history);   
  };

  const handleAddContext = () => {
    setActiveContextId(null);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100 overflow-hidden font-sans">
      <Sidebar 
        contexts={contexts}
        setContexts={setContexts}
        activeContextId={activeContextId}
        onSelectContext={handleSelectContext}
        onAddContext={handleAddContext}
      />
      <main className="flex-1 flex flex-col h-full overflow-hidden p-6 md:p-10">
        {activeContextId ? (
          <ChatHistory 
            contextId={activeContextId} 
            messages={chatHistory}
            setChatHistory={setChatHistory}
            onBack={() => setActiveContextId(null)}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <FileUpload setContexts={setContexts} />
          </div>
        )}
      </main>
    </div>
  );
};

export default MainPage;