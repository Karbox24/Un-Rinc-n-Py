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
    <header className="w-full bg-[#FFFBF5]/95 backdrop-blur-md border-b border-[#EADCCF] text-[#1A1A1A] sticky top-0 z-30 shadow-xs">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Marca & Logo */}
        <div 
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFF0DB] border border-[#FFB347]/50 flex items-center justify-center text-lg font-bold">
            🧉
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-[#8B1A1A]">
                Un Rincón Py
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#FFF0DB] text-[#8B1A1A] rounded-full border border-[#FFB347]/40">
                Trivia
              </span>
            </div>
          </div>
        </div>

        {/* Acciones de Navegación de Escritorio & Tablet */}
        <nav className="hidden sm:flex items-center gap-1">
          <button
            onClick={() => handleNav('home')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              currentScreen === 'home' || currentScreen === 'quiz' || currentScreen === 'gameover'
                ? 'bg-[#1A3A5F] text-white shadow-xs'
                : 'text-[#757575] hover:text-[#1A3A5F] hover:bg-[#FFF0DB]/60'
            }`}
          >
            Jugar
          </button>

          <button
            onClick={() => handleNav('ranking')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              currentScreen === 'ranking'
                ? 'bg-[#1A3A5F] text-white shadow-xs'
                : 'text-[#757575] hover:text-[#1A3A5F] hover:bg-[#FFF0DB]/60'
            }`}
          >
            Ranking
          </button>

          <button
            onClick={() => handleNav('stats')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              currentScreen === 'stats'
                ? 'bg-[#1A3A5F] text-white shadow-xs'
                : 'text-[#757575] hover:text-[#1A3A5F] hover:bg-[#FFF0DB]/60'
            }`}
          >
            Estadísticas
          </button>

          <button
            onClick={() => handleNav('admin')}
            title="Panel de Administración"
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              currentScreen === 'admin'
                ? 'bg-[#1A3A5F] text-white shadow-xs'
                : 'text-[#757575] hover:text-[#1A3A5F] hover:bg-[#FFF0DB]/60'
            }`}
          >
            Admin
          </button>
        </nav>

        {/* Acceso directo en móviles */}
        <div className="flex sm:hidden items-center gap-1">
          <button
            onClick={() => handleNav('admin')}
            title="Panel de Administración"
            className="p-2 rounded-xl text-[#757575] hover:text-[#1A3A5F] hover:bg-[#FFF0DB]/60 transition-colors"
          >
            <Shield className="w-4 h-4 text-[#757575]" />
          </button>
        </div>
      </div>
    </header>
  );
};
