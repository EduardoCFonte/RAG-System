import React, { useState, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  PlusIcon, 
  ArrowLeftOnRectangleIcon, 
  ChevronRightIcon,
  CircleStackIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

interface ContextItem {
  id: string;
  name: string;
  lastUpdate?: string;
}

interface SidebarProps {
  onAddContext?: () => void;
  onSelectContext?: (id: string) => void;
  activeContextId?: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onAddContext, 
  onSelectContext,
  activeContextId 
}) => {
  const [contexts, setContexts] = useState<ContextItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchContexts = async () => {
      try {
        setIsLoading(true);

        const response = await api.get('/api/v1/contexts');

        setContexts(response.data.ContextsList);
      } catch (error) {
        console.error("Erro ao carregar contextos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContexts();
  }, []);

  return (
    <aside className="w-72 bg-slate-950 text-white flex flex-col h-full shadow-2xl border-r border-slate-800">

      <div className="p-6">
        <div className="flex items-center gap-3 text-indigo-400 mb-8 px-2">
          <CircleStackIcon className="w-8 h-8 animate-pulse" />
          <h1 className="font-extrabold text-xl tracking-tight text-white italic">BRAIN.ai</h1>
        </div>
        
        <button 
          onClick={onAddContext}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-4 rounded-xl transition-all duration-300 font-bold shadow-lg shadow-indigo-900/40 border border-indigo-400/20 active:scale-95"
        >
          <PlusIcon className="w-5 h-5" />
          Novo Contexto
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-1 custom-sidebar-scroll">
        <div className="px-3 mb-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
          Contextos Recentes
        </div>
        
        {isLoading ? (
          <div className="px-3 py-2 space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-10 bg-slate-900 animate-pulse rounded-lg w-full" />
            ))}
          </div>
        ) : contexts.length === 0 ? (
          <p className="text-xs text-slate-600 px-3 italic">Nenhum contexto salvo.</p>
        ) : (
          contexts.map((ctx) => (
            <button
              key={ctx.id}
              onClick={() => onSelectContext?.(ctx.id)}
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

              <ChevronRightIcon 
                className={`w-4 h-4 transition-all duration-300 ${activeContextId === ctx.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} 
              />
            </button>
          ))
        )}
      </nav>

      <div className="px-4 py-2 space-y-1">
        <button className="w-full flex items-center gap-3 p-3 text-slate-500 hover:text-white hover:bg-slate-900 rounded-xl transition-all text-sm font-medium">
          <Cog6ToothIcon className="w-5 h-5" />
          Configurações
        </button>
        <button className="w-full flex items-center gap-3 p-3 text-slate-500 hover:text-white hover:bg-slate-900 rounded-xl transition-all text-sm font-medium">
          <QuestionMarkCircleIcon className="w-5 h-5" />
          Ajuda & Suporte
        </button>
      </div>

      <div className="p-4 bg-slate-950/50 border-t border-slate-900">
        <div className="flex items-center gap-3 p-2 bg-slate-900/30 rounded-2xl border border-slate-800/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shadow-inner">
            E
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-xs font-bold text-white truncate">Eduardo</div>
            <div className="text-[10px] text-slate-500 truncate">edu@workspace.ai</div>
          </div>
          <button title="Sair" className="p-2 text-slate-500 hover:text-red-400 transition-colors">
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style>{`
        .custom-sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;