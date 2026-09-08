import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  header: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, header }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-red-500 selection:text-white font-sans antialiased">
      {/* Header adaptable que ocupa todo el ancho con contenedor responsive */}
      {header}

      {/* Contenedor principal responsive: fluido en móviles y amplio en PC / Tablets */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {children}
      </main>

      {/* Barra inferior adaptable para Web y APK */}
      <footer className="w-full bg-slate-950 border-t border-slate-800/80 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-base">🇵🇾</span>
            <span className="font-bold text-slate-200">Un Rincón Py</span>
            <span className="text-slate-600 dark:text-slate-500">|</span>
            <span className="text-slate-400">Fase 1 • Mitos y Cultura</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Firebase Firestore Activo
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-slate-400">Mobile, Tablet & PC Responsive</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="bg-slate-800/80 px-2 py-0.5 rounded text-[10px] text-slate-300 font-medium">
              APK Ready
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
