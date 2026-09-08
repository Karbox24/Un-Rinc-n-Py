import React from 'react';
import { Shield, Home, Trophy } from 'lucide-react';
import { ScreenState } from '../hooks/useTriviaGame';

interface HeaderProps {
  currentScreen: ScreenState;
  onNavigateHome: () => void;
  onOpenAdmin: () => void;
  onOpenRankingModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigateHome,
  onOpenAdmin,
  onOpenRankingModal,
}) => {
  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Marca & Logo */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-white to-blue-600 p-[2px] shadow-sm group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-xl font-bold">
              🧉
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-amber-400 transition-colors">
                Un Rincón Py
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-red-600/90 text-white rounded-full tracking-wider uppercase">
                Fase 1
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Trivia de Cultura, Mitología y Tradiciones Paraguayas
            </p>
          </div>
        </div>

        {/* Acciones de Navegación Responsive */}
        <div className="flex items-center gap-2">
          {currentScreen !== 'home' && (
            <button
              onClick={onNavigateHome}
              title="Volver al Inicio"
              className="px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Inicio</span>
            </button>
          )}

          {onOpenRankingModal && (
            <button
              onClick={onOpenRankingModal}
              title="Ranking Global (Fase 2)"
              className="px-3 py-2 rounded-xl text-amber-400 hover:text-amber-300 hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold border border-amber-400/20"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Ranking</span>
            </button>
          )}

          <button
            onClick={onOpenAdmin}
            title="Panel de Administración"
            className="px-3 py-2 rounded-xl text-slate-300 hover:text-red-400 hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold relative"
          >
            <Shield className="w-4 h-4 text-red-500" />
            <span className="hidden sm:inline">Admin</span>
            <span className="sm:hidden w-1.5 h-1.5 bg-red-500 rounded-full"></span>
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
