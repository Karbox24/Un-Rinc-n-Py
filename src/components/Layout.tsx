import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  header: ReactNode;
  bottomNav?: ReactNode;
  isQuizActive?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  header, 
  bottomNav, 
  isQuizActive = false 
}) => {
  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#1A1A1A] flex flex-col justify-between selection:bg-[#8B1A1A] selection:text-white font-sans antialiased relative">
      {/* Textura sutil de ñandutí con 5% de opacidad */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.05] z-0"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="nanduti-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
            {/* Círculos concéntricos y radios de tejido ñandutí */}
            <circle cx="50" cy="50" r="44" fill="none" stroke="#8B1A1A" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx="50" cy="50" r="32" fill="none" stroke="#8B1A1A" strokeWidth="0.8" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="#8B1A1A" strokeWidth="0.8" strokeDasharray="2,2" />
            <circle cx="50" cy="50" r="8" fill="none" stroke="#8B1A1A" strokeWidth="0.8" />
            <circle cx="50" cy="50" r="2" fill="#8B1A1A" />
            {/* Rayos radiales */}
            <line x1="50" y1="6" x2="50" y2="94" stroke="#8B1A1A" strokeWidth="0.8" />
            <line x1="6" y1="50" x2="94" y2="50" stroke="#8B1A1A" strokeWidth="0.8" />
            <line x1="19" y1="19" x2="81" y2="81" stroke="#8B1A1A" strokeWidth="0.6" />
            <line x1="19" y1="81" x2="81" y2="19" stroke="#8B1A1A" strokeWidth="0.6" />
            {/* Pétalos florales de encaje */}
            <path d="M50 16 Q58 33 50 50 Q42 33 50 16" fill="none" stroke="#8B1A1A" strokeWidth="0.6" />
            <path d="M84 50 Q67 58 50 50 Q67 42 84 50" fill="none" stroke="#8B1A1A" strokeWidth="0.6" />
            <path d="M50 84 Q42 67 50 50 Q58 67 50 84" fill="none" stroke="#8B1A1A" strokeWidth="0.6" />
            <path d="M16 50 Q33 42 50 50 Q33 58 16 50" fill="none" stroke="#8B1A1A" strokeWidth="0.6" />
            {/* Motivos en las esquinas para enlazar */}
            <circle cx="0" cy="0" r="10" fill="none" stroke="#8B1A1A" strokeWidth="0.8" />
            <circle cx="100" cy="0" r="10" fill="none" stroke="#8B1A1A" strokeWidth="0.8" />
            <circle cx="0" cy="100" r="10" fill="none" stroke="#8B1A1A" strokeWidth="0.8" />
            <circle cx="100" cy="100" r="10" fill="none" stroke="#8B1A1A" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#nanduti-pattern)" />
      </svg>

      {/* Header adaptable */}
      <div className="relative z-10">
        {header}
      </div>

      {/* Contenedor principal responsive: centrado, limpio, adaptable a 360px */}
      <main className={`flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6 relative z-10 ${isQuizActive ? 'pb-6' : 'pb-20 sm:pb-8'}`}>
        {children}
      </main>

      {/* Barra inferior adaptable para Web y APK */}
      <footer className="w-full bg-[#FFFBF5]/90 backdrop-blur-xs border-t border-[#EADCCF] mt-auto hidden sm:block relative z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#757575]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#8B1A1A]">Un Rincón Py</span>
            <span className="text-[#C4B2A2]">·</span>
            <span>Trivia Guaraní & Ranking</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-[#757575]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Sincronizado
            </span>
            <span className="text-[#C4B2A2]">·</span>
            <span>Cultura Paraguaya</span>
          </div>
        </div>
      </footer>

      {/* Barra de navegación táctil para móviles */}
      <div className="relative z-20">
        {bottomNav}
      </div>
    </div>
  );
};
