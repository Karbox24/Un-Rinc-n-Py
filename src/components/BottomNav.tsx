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
      activeColor: 'text-red-500',
      activeBg: 'bg-red-500/10 border-red-500/30',
    },
    {
      id: 'ranking' as ScreenState,
      label: 'Ranking',
      icon: Trophy,
      activeColor: 'text-amber-400',
      activeBg: 'bg-amber-400/10 border-amber-400/30',
    },
    {
      id: 'stats' as ScreenState,
      label: 'Estadísticas',
      icon: BarChart3,
      activeColor: 'text-blue-400',
      activeBg: 'bg-blue-400/10 border-blue-400/30',
    },
    {
      id: 'admin' as ScreenState,
      label: 'Admin',
      icon: Shield,
      activeColor: 'text-slate-200',
      activeBg: 'bg-slate-800 border-slate-700',
    },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/90 px-3 py-2 pb-safe shadow-2xl">
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
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all ${
                isActive
                  ? `${item.activeColor} ${item.activeBg} font-bold border`
                  : 'text-slate-400 hover:text-slate-200'
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
