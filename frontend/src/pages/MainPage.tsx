import React, { useState } from 'react';
import FileUpload from '../components/UI/FileUpload'; 
import Sidebar from '../components/Layout/Sidebar';

const MainPage: React.FC = () => {
  const [activeContextId, setActiveContextId] = useState<string | null>(null);

  const handleSelectContext = (id: string) => {
    setActiveContextId(id);
  };

  const handleAddContext = () => {
    setActiveContextId(null);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100 overflow-hidden font-sans">
      <Sidebar 
        activeContextId={activeContextId}
        onSelectContext={handleSelectContext}
        onAddContext={handleAddContext}
      />
      <main className="flex-1 overflow-y-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Processador de Documentos
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Selecione um contexto na barra lateral e envie seus PDFs para alimentar a base de conhecimento.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <FileUpload />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;