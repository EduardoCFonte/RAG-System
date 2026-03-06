import React from 'react';
import { HomeModernIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const logoImobiliare = 'https://placehold.co/300x80/334155/ffffff?text=IMOBILIARE&font=raleway';

const Header: React.FC = () => {
  const {user, token, logout} = useAuth()
  const navigate = useNavigate(); 
  const handleMidLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/')
    logout()
};
  return (
  <>
  <header className="w-full bg-white shadow-md sticky top-0 z-50">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">

        <div className="flex-1 flex justify-start">
          {token ?<a href="/main" className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors duration-300">
            <HomeModernIcon className="h-8 w-8" />
          </a>
          :<a href="/" className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors duration-300">
          <HomeModernIcon className="h-8 w-8" />
        </a>}
        </div>
        <div className="flex-1 flex justify-center">
          <button 
            type="button" 
            onClick={handleMidLogo}
            
            className="bg-transparent border-none p-0 cursor-pointer appearance-none hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md" 
        >
          
            <img 
                src={logoImobiliare} 
                alt="Logo da Imobiliare" 
                className="h-10" 
            />
        </button>
        </div>
        <div className="flex-1 flex justify-end items-center space-x-3">
        {token ? <span className="hidden sm:inline font-medium text-slate-700">
          Olá {user?.firstName}
        </span>
          :<span className="hidden sm:inline font-medium text-slate-700">
          Faça Login
        </span>}
          <button className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-colors duration-300">
            <img src="https://i.pravatar.cc/48?u=eduardo" alt="Avatar do usuário" />
          </button>
        </div>

      </div>
    </div>
  </header>
  </>
)}

export default Header;



  
  
