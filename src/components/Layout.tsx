import React, { ReactNode } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  header: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, header }) => {
  const [isWideMode, setIsWideMode] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-red-500 selection:text-white font-sans antialiased">
      {/* Contenedor principal adaptable para APK y Web */}
      <div className="w-full flex-1 flex flex-col items-center">
        <div
          className={`w-full transition-all duration-300 min-h-screen flex flex-col bg-slate-900 shadow-2xl ${
            isWideMode ? 'max-w-2xl' : 'max-w-md'
          } border-x border-slate-800/80`}
        >
          {/* Header fijado */}
          {header}

          {/* Contenido con scroll suave y padding adecuado */}
          <main className="flex-1 px-4 py-4 pb-12 overflow-y-auto">
            {children}
          </main>

          {/* Barra inferior APK / Modo visualizador */}
          <footer className="w-full bg-slate-950/90 border-t border-slate-800/80 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1">
              <span>🇵🇾</span>
              <span className="font-semibold text-slate-300">Un Rincón Py</span>
              <span className="text-slate-500">• Fase 1</span>
            </div>

            {/* Toggle visual para testing en escritorio (oculto en pantallas táctiles pequeñas) */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] text-slate-500">Vista:</span>
              <button
                type="button"
                onClick={() => setIsWideMode(!isWideMode)}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white text-[10px] font-medium transition-colors"
                title="Alternar ancho móvil / escritorio"
              >
                {isWideMode ? (
                  <>
                    <Smartphone className="w-3 h-3" /> Móvil
                  </>
                ) : (
                  <>
                    <Monitor className="w-3 h-3" /> Expandido
                  </>
                )}
              </button>
            </div>

            <span className="text-[10px] text-slate-500">APK Ready</span>
          </footer>
        </div>
      </div>
    </div>
  );
};
