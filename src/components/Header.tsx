import React, { useState } from 'react';
import { Shield, Home, Sparkles, Trophy } from 'lucide-react';
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
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Marca & Logo */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-white to-blue-600 p-[2px] shadow-sm group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-lg font-bold">
              🧉
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-amber-400 transition-colors">
                Un Rincón Py
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-red-600/90 text-white rounded-full tracking-wider uppercase">
                Fase 1
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Trivia Cultural y Mitología</p>
          </div>
        </div>

        {/* Acciones de Navegación */}
        <div className="flex items-center gap-1.5">
          {currentScreen !== 'home' && (
            <button
              onClick={onNavigateHome}
              title="Volver al Inicio"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Home className="w-4 h-4" />
            </button>
          )}

          {onOpenRankingModal && (
            <button
              onClick={onOpenRankingModal}
              title="Ranking Global (Fase 2)"
              className="p-2 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <Trophy className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onOpenAdmin}
            title="Panel de Administración"
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors relative"
          >
            <Shield className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Franja sutil de la bandera tricolor paraguaya */}
      <div className="h-0.5 w-full flex">
        <div className="h-full w-1/3 bg-red-600"></div>
        <div className="h-full w-1/3 bg-slate-200"></div>
        <div className="h-full w-1/3 bg-blue-600"></div>
      </div>
    </header>
  );
};
