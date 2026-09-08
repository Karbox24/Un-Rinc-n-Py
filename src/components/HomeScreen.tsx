import React, { useState } from 'react';
import { Sparkles, Play, Shield, Award, HelpCircle, CheckCircle2 } from 'lucide-react';
import { AVATAR_OPTIONS } from '../lib/utils';

interface HomeScreenProps {
  nickname: string;
  avatar: string;
  questionMode: 'test10' | 'all';
  onStartGame: (nick: string, avatar: string, mode: 'test10' | 'all') => void;
  onOpenAdmin: () => void;
  onOpenRanking: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  nickname: initialNick,
  avatar: initialAvatar,
  questionMode: initialMode,
  onStartGame,
  onOpenAdmin,
  onOpenRanking,
}) => {
  const [nick, setNick] = useState(initialNick);
  const [selectedAvatar, setSelectedAvatar] = useState(initialAvatar || 'terere');
  const [mode, setMode] = useState<'test10' | 'all'>(initialMode);
  const [errorMsg, setErrorMsg] = useState('');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNick = nick.trim();
    if (!cleanNick) {
      setErrorMsg('Por favor ingresá un apodo para jugar');
      return;
    }
    if (cleanNick.length < 2) {
      setErrorMsg('El apodo debe tener al menos 2 letras');
      return;
    }
    setErrorMsg('');
    onStartGame(cleanNick, selectedAvatar, mode);
  };

  return (
    <div className="flex flex-col gap-5 py-2">
      {/* Banner de Bienvenida Cultural */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/60 p-5 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20 mb-2">
              <Sparkles className="w-3 h-3" /> ¡Mba'éichapa!
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Un Rincón Py
            </h1>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-[280px]">
              Poné a prueba tus conocimientos sobre los mitos, gastronomía, idioma y tradiciones de nuestra querida tierra guaraní.
            </p>
          </div>
          <div className="text-4xl filter drop-shadow-md animate-bounce">
            🧉
          </div>
        </div>

        {/* Indicadores de Fase 1 */}
        <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-300">
          <span className="flex items-center gap-1 font-medium text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Firebase Firestore Conectado
          </span>
          <span className="text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded text-[10px]">
            Mobile-First / APK Ready
          </span>
        </div>
      </div>

      {/* Formulario de Entrada */}
      <form onSubmit={handleStart} className="flex flex-col gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <label htmlFor="nickname" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Tu Apodo o Nombre de Jugador
          </label>
          <div className="relative">
            <input
              id="nickname"
              type="text"
              value={nick}
              onChange={(e) => {
                setNick(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Ej: Katu, Mburuvicha, Sol, Dani..."
              maxLength={25}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm"
            />
            {nick && (
              <span className="absolute right-3 top-3 text-xs text-slate-400">
                {nick.length}/25
              </span>
            )}
          </div>
          {errorMsg && (
            <p className="text-red-500 text-xs font-semibold mt-1.5 flex items-center gap-1">
              ⚠️ {errorMsg}
            </p>
          )}
        </div>

        {/* Selector de Avatar Típico */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Elegí tu Emblema Cultural
          </label>
          <div className="grid grid-cols-4 gap-2">
            {AVATAR_OPTIONS.map((item) => {
              const isSelected = selectedAvatar === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSelectedAvatar(item.id)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 shadow-sm scale-105 ring-1 ring-blue-600'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl mb-1">{item.icon}</span>
                  <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 truncate w-full">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selección de Modo de Preguntas */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Modalidad de Partida
            </label>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
              Fase 1 Inicial
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode('test10')}
              className={`p-3 rounded-xl border text-left transition-all ${
                mode === 'test10'
                  ? 'border-red-600 bg-red-50/70 dark:bg-red-950/30 text-slate-900 dark:text-white ring-1 ring-red-600'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">10 de Prueba</span>
                <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.2 rounded">Recomendado</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Fase 1: Mitos y cultura esencial.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMode('all')}
              className={`p-3 rounded-xl border text-left transition-all ${
                mode === 'all'
                  ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/30 text-slate-900 dark:text-white ring-1 ring-blue-600'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">Banco Completo</span>
                <span className="text-[10px] text-slate-400">30+ Qs</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Desafío completo de preguntas.
              </p>
            </button>
          </div>
        </div>

        {/* Botón de Inicio Principal */}
        <button
          type="submit"
          className="mt-2 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-blue-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-600/20 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-white" />
          Comenzar Trivia Guaraní
        </button>
      </form>

      {/* Categorías Temáticas Destacadas */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
          Ejes Temáticos del Desafío
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
            👹 7 Mitos Guaraníes
          </span>
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
            🍲 Sopa, Chipa y Mbeju
          </span>
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
            🧉 Tereré & Pohã Ñana
          </span>
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
            📜 Idioma Guaraní
          </span>
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40">
            🏛️ Historia y Héroes
          </span>
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-teal-100 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800/40">
            🗺️ Geografía y Cerros
          </span>
        </div>
      </div>

      {/* Acciones Secundarias (Ranking & Admin) */}
      <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
        <button
          type="button"
          onClick={onOpenRanking}
          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-1.5"
        >
          <Award className="w-4 h-4 text-amber-500" />
          Ranking Global (Fase 2)
        </button>
        <button
          type="button"
          onClick={onOpenAdmin}
          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-1.5"
        >
          <Shield className="w-4 h-4 text-slate-500" />
          Panel Administrador
        </button>
      </div>
    </div>
  );
};
