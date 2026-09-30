import React from 'react';
import { Shield, Play, Trophy, BarChart3, Home } from 'lucide-react';
import { ScreenState } from '../hooks/useTriviaGame';

interface HeaderProps {
  currentScreen: ScreenState;
  onNavigateHome: () => void;
  onOpenAdmin: () => void;
  onOpenRankingModal?: () => void;
  onNavigateTo?: (screen: ScreenState) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigateHome,
  onOpenAdmin,
  onOpenRankingModal,
  onNavigateTo,
}) => {
  const handleNav = (target: ScreenState) => {
    if (onNavigateTo) {
      onNavigateTo(target);
    } else {
      if (target === 'home') onNavigateHome();
      if (target === 'admin') onOpenAdmin();
      if (target === 'ranking' && onOpenRankingModal) onOpenRankingModal();
    }
  };

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between">
        {/* Marca & Logo */}
        <div 
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-white to-blue-600 p-[2px] shadow-sm group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-xl font-bold">
              🧉
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-amber-400 transition-colors">
                Un Rincón Py
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-full tracking-wider uppercase shadow-xs">
                Fase 2
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Trivia de Cultura, Mitología y Tradiciones Paraguayas
            </p>
          </div>
        </div>

        {/* Acciones de Navegación de Escritorio & Tablet */}
        <nav className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => handleNav('home')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              currentScreen === 'home' || currentScreen === 'quiz' || currentScreen === 'gameover'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Play className="w-3.5 h-3.5" /> Jugar
          </button>

          <button
            onClick={() => handleNav('ranking')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              currentScreen === 'ranking'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800/60'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" /> Ranking
          </button>

          <button
            onClick={() => handleNav('stats')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              currentScreen === 'stats'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'text-slate-300 hover:text-blue-300 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-400" /> Mis Estadísticas
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1"></div>

          <button
            onClick={() => handleNav('admin')}
            title="Panel de Administración"
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              currentScreen === 'admin'
                ? 'bg-red-950/60 text-red-300 border border-red-800/80'
                : 'text-slate-400 hover:text-red-400 hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-red-500" /> Admin
          </button>
        </nav>

        {/* Acceso directo rápido en móviles (Admin) */}
        <div className="flex sm:hidden items-center gap-1">
          <button
            onClick={() => handleNav('admin')}
            title="Panel de Administración"
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
          >
            <Shield className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      {/* Franja de la bandera paraguaya */}
      <div className="h-0.5 w-full flex">
        <div className="h-full w-1/3 bg-red-600"></div>
        <div className="h-full w-1/3 bg-slate-200"></div>
        <div className="h-full w-1/3 bg-blue-600"></div>
      </div>
    </header>
  );
};
