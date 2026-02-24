import React, { useState, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  ChevronRightIcon, 
  CircleStackIcon, 
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

interface SidebarProps {
  contexts: any[];
  setContexts: React.Dispatch<React.SetStateAction<any[]>>;
  onAddContext: () => void;
  onSelectContext: (id: string | null, history: any[]) => void;
  activeContextId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  contexts,
  setContexts,
  onAddContext,
  onSelectContext,
  activeContextId
}) => {

  useEffect(() => {
    const fetchContexts = async () => {
      try {
        const response = await api.get('/api/v1/contexts');
        const rawData = Array.isArray(response.data) ? response.data : response.data.ContextsList;
        
        if (rawData) {
          const formatted = rawData.map((item: any) => {
            const id = typeof item === 'string' ? item : item.id;
            const displayName = typeof item === 'string' ? item : (item.name || item.id);
            
            return {
              id: id,
              name: displayName.replace(/_/g, ' '),
              lastUpdate: item.lastUpdate || null
            };
          });
          setContexts(formatted);
        }
      } catch (err) {
        console.error("Erro ao buscar contextos:", err);
      }
    };
    fetchContexts();
  }, []);

  const handleContextClick = async (ctxId: string) => {
    try {
      const response = await api.get(`/api/v1/contexts/select/${ctxId}`);
      const history = response.data.messages || response.data.History || [];
      console.log(history, "resposta Context");
      onSelectContext(ctxId, history);
    } catch (error) {
      console.error("Erro ao buscar histórico do contexto:", error);
      onSelectContext(ctxId, []); 
    }
  };

  const handleDeleteContext = async (e: React.MouseEvent, ctxId: string) => {
    e.stopPropagation();

    const confirmed = window.confirm(`Tem certeza que deseja excluir o contexto "${ctxId.replace(/_/g, ' ')}"?`);
    if (!confirmed) return;

    try {
      const response = await api.delete(`/api/v1/contexts/${ctxId}`);
      console.log("DELETE RESPONSE:", response.data.message);
      setContexts(prev => prev.filter(c => c.id !== ctxId));
      if (activeContextId === ctxId) {
        onSelectContext(null, []);
      }
      console.log("tudOk")
    } catch (error) {
      console.error("Erro ao deletar contexto:", error);
    }
  };

  return (
    <aside className="w-72 bg-slate-950 text-white flex flex-col h-full border-r border-slate-800 shrink-0 shadow-2xl">
      <div className="p-6">
        <div className="flex items-center gap-3 text-indigo-400 mb-8 px-2">
          <CircleStackIcon className="w-8 h-8" />
          <h1 className="font-bold text-xl text-white italic tracking-tighter">BRAIN.ai</h1>
        </div>
        
        <button 
          onClick={onAddContext}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl transition-all font-bold shadow-lg active:scale-95"
        >
          <PlusIcon className="w-5 h-5" />
          Novo Contexto
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="px-3 mb-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Meus Contextos
        </div>
        
        {contexts.map((ctx) => (
          <button
            key={ctx.id}
            onClick={() => handleContextClick(ctx.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative
              ${activeContextId === ctx.id 
                ? 'bg-slate-800 text-indigo-400 border border-slate-700' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
          >
            {activeContextId === ctx.id && (
              <div className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-r-full" />
            )}
            
            <ChatBubbleLeftRightIcon className={`w-5 h-5 ${activeContextId === ctx.id ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
            
            <div className="flex-1 text-left truncate">
              <div className={`text-sm font-semibold truncate ${activeContextId === ctx.id ? 'text-white' : ''}`}>
                {ctx.name}
              </div>
              {ctx.lastUpdate && (
                <div className="text-[10px] text-slate-500">{ctx.lastUpdate}</div>
              )}
            </div>

            <div className="flex items-center gap-1">
              <div
                onClick={(e) => handleDeleteContext(e, ctx.id)}
                className="p-1.5 rounded-lg text-slate-600 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                title="Excluir contexto"
              >
                <TrashIcon className="w-4 h-4" />
              </div>

              <ChevronRightIcon 
                className={`w-4 h-4 transition-all duration-300 ${activeContextId === ctx.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} 
              />
            </div>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;