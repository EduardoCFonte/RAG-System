import React, { useState, useEffect, useRef } from 'react';
import { 
  PaperAirplaneIcon, 
  UserIcon, 
  CpuChipIcon, 
  ArrowPathIcon, 
  ChatBubbleLeftRightIcon, 
  ArrowLeftIcon 
} from '@heroicons/react/24/solid';
import api from '../../services/api';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatHistoryProps {
  contextId: string;
  messages: Message[];
  setChatHistory: React.Dispatch<React.SetStateAction<Message[]>>;
  onBack: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ 
  contextId, 
  messages, 
  setChatHistory, 
  onBack 
}) => {
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };

    setChatHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/api/v1/chat', { 
        context_name: contextId, 
        question: input 
      });

      const botMsg: Message = { role: 'assistant', content: response.data.answer };
      setChatHistory(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in duration-500 font-sans">

      <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="p-2 hover:bg-slate-200 rounded-full transition-colors outline-none focus:ring-2 focus:ring-indigo-500"
            title="Voltar ao Upload"
          >
            <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
          </button>
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 leading-tight truncate max-w-[200px]">
              {contextId.replace(/_/g, ' ')}
            </h2>
            <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">Base de Conhecimento Ativa</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border
                ${msg.role === 'user' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white text-slate-700 border-slate-200'}`}>
                {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <CpuChipIcon className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start gap-3 items-center text-slate-400">
             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
               <ArrowPathIcon className="w-4 h-4 animate-spin text-indigo-600" />
             </div>
             <span className="text-xs italic">Consultando documentos...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSend} className="p-6 border-t bg-white">
        <div className="relative flex items-center max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            placeholder="Digite a sua dúvida aqui..."
            className="w-full p-4 pr-16 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 p-2.5 rounded-xl transition-all
              ${!input.trim() || isLoading 
                ? 'bg-slate-200 text-slate-400' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg active:scale-95'}`}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatHistory;