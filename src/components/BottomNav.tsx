import React from 'react';
import { Play, Trophy, BarChart3, Shield } from 'lucide-react';
import { ScreenState } from '../hooks/useTriviaGame';

interface BottomNavProps {
  currentScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  // En plena partida de trivia, ocultamos la barra inferior para máxima inmersión y comodidad táctil
  if (currentScreen === 'quiz') {
    return null;
  }

  const navItems = [
    {
      id: 'home' as ScreenState,
      label: 'Jugar',
      icon: Play,
    },
    {
      id: 'ranking' as ScreenState,
      label: 'Ranking',
      icon: Trophy,
    },
    {
      id: 'stats' as ScreenState,
      label: 'Estadísticas',
      icon: BarChart3,
    },
    {
      id: 'admin' as ScreenState,
      label: 'Admin',
      icon: Shield,
    },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFBF5]/95 backdrop-blur-md border-t border-[#EADCCF] px-3 py-2 pb-safe shadow-md">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentScreen === item.id ||
            (item.id === 'home' && (currentScreen === 'home' || currentScreen === 'gameover'));

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors ${
                isActive
                  ? 'text-[#8B1A1A] font-extrabold bg-[#FFF0DB]/50'
                  : 'text-[#757575] hover:text-[#1A3A5F]'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] leading-tight truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
